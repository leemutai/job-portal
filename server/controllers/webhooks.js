
import { Webhook } from "svix";
import User from "../models/User.js";

// Clean up name fields received from Clerk
const cleanName = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const cleaned = value.trim();

    if (!cleaned || cleaned.toLowerCase() === "null") {
        return "";
    }

    return cleaned;
};

// Get a usable name even when the user skips entering a username
const getUserName = (data, email) => {
    const firstName = cleanName(data.first_name);
    const lastName = cleanName(data.last_name);

    const fullName = [firstName, lastName]
        .filter(Boolean)
        .join(" ");

    return (
        fullName ||
        cleanName(data.username) ||
        email?.split("@")[0] ||
        "User"
    );
};

// Manage Clerk users in MongoDB
export const clerkWebhooks = async (req, res) => {
    try {
        const secret = process.env.CLERK_WEBHOOK_SECRET;

        if (!secret) {
            console.error("CLERK_WEBHOOK_SECRET is missing");

            return res.status(500).json({
                success: false,
                message: "Webhook configuration error",
            });
        }

        // Initialize Svix webhook verification
        const webhook = new Webhook(secret);

        // Read the original raw request body
        const payload = Buffer.isBuffer(req.body)
            ? req.body.toString("utf8")
            : typeof req.body === "string"
                ? req.body
                : null;

        if (!payload) {
            console.error("Webhook body is not raw text");

            return res.status(400).json({
                success: false,
                message: "Invalid webhook request body",
            });
        }

        // Verify the Clerk webhook signature
        const evt = webhook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = evt;

        switch (type) {
            // Create or synchronize a new user
            case "user.created": {
                // Prefer the primary email address
                const email =
                    data.email_addresses?.find(
                        (item) =>
                            item.id === data.primary_email_address_id
                    )?.email_address ||
                    data.email_addresses?.[0]?.email_address;

                if (!email) {
                    console.error(
                        "No email address found for Clerk user:",
                        data.id
                    );

                    return res.status(400).json({
                        success: false,
                        message: "User email is missing",
                    });
                }

                const normalizedEmail = email.toLowerCase();
                const name = getUserName(data, normalizedEmail);

                const userData = {
                    _id: data.id,
                    email: normalizedEmail,
                    name,
                    image: data.image_url || "",
                    resume: "",
                };

                // Create the user if it does not already exist.
                // $setOnInsert preserves an existing resume on webhook retries.
                await User.findByIdAndUpdate(
                    data.id,
                    {
                        $setOnInsert: userData,
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true,
                    }
                );

                console.log(
                    "Clerk user created/synced:",
                    data.id,
                    normalizedEmail,
                    name
                );

                return res.status(200).json({
                    success: true,
                    message: "User created or already exists",
                });
            }

            // Update an existing user
            case "user.updated": {
                const email =
                    data.email_addresses?.find(
                        (item) =>
                            item.id === data.primary_email_address_id
                    )?.email_address ||
                    data.email_addresses?.[0]?.email_address;

                const normalizedEmail = email?.toLowerCase();
                const name = getUserName(data, normalizedEmail);

                const updateData = {
                    name,
                    image: data.image_url || "",
                };

                if (normalizedEmail) {
                    updateData.email = normalizedEmail;
                }

                const updatedUser = await User.findByIdAndUpdate(
                    data.id,
                    {
                        $set: updateData,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

                if (!updatedUser) {
                    console.warn(
                        "Received user.updated for a missing MongoDB user:",
                        data.id
                    );

                    // Acknowledge the event. The user.created event is
                    // responsible for initially creating the user.
                    return res.status(200).json({
                        success: true,
                        message: "User update skipped; user does not exist",
                    });
                }

                console.log(
                    "Clerk user updated:",
                    data.id,
                    updatedUser.name
                );

                return res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                });
            }

            // Delete a user
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);

                console.log("Clerk user deleted:", data.id);

                return res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
            }

            // Ignore event types not handled by this application
            default: {
                console.log("Ignoring Clerk webhook event:", type);

                return res.status(200).json({
                    success: true,
                    message: "Event ignored",
                });
            }
        }
    } catch (error) {
        console.error("Clerk webhook error:", error);

        return res.status(400).json({
            success: false,
            message: "Webhook verification or processing failed",
        });
    }
};
