import Job from "../models/job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';


// Get user Data
export const getUserData = async (req, res) => {
    try {
        const auth = await req.auth();
        const userId = auth.userId;

        console.log('Clerk ID from request:', userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User is not authenticated'
            });
        }

        const user = await User.findById(userId);

        console.log('User found in MongoDB:', !!user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('getUserData error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user data'
        });
    }
};

// Apply for a job

export const applyForJob = async (req, res) => {
    try {
        // Get the authenticated Clerk user ID
        const { userId } = await req.auth();

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Please log in to apply for this job'
            });
        }

        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }

        // Check whether the user has already applied
        const existingApplication = await JobApplication.findOne({
            jobId,
            userId
        });

        if (existingApplication) {
            return res.json({
                success: false,
                message: 'Already applied'
            });
        }

        // Find the job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Create the application
        await JobApplication.create({
            companyId: job.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        return res.json({
            success: true,
            message: 'Applied successfully'
        });

    } catch (error) {
        console.error('Apply for job error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = await req.auth()

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    const applications = await JobApplication.find({ userId })
      .populate('companyId', 'name email image')
      .populate(
        'jobId',
        'title description location category level salary'
      )

    return res.json({
      success: true,
      applications
    })
  } catch (error) {
    console.error('Fetch applications error:', error)

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update user profile (resume)


export const updateUserResume = async (req, res) => {
    try {
        // Clerk Express exposes auth as a function
        const { userId } = await req.auth();

        console.log('Clerk user ID:', userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User is not authenticated'
            });
        }

        // Look up the MongoDB user using the Clerk ID
        const userData = await User.findOne({ _id: userId });

        console.log('User found in MongoDB:', !!userData);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found for Clerk ID: ' + userId
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select a resume file'
            });
        }

        const resumeUpload = await cloudinary.uploader.upload(
            req.file.path,
            { resource_type: 'raw' }
        );

        userData.resume = resumeUpload.secure_url;
        await userData.save();

        return res.json({
            success: true,
            message: 'Resume updated successfully'
        });

    } catch (error) {
        console.error('Resume update error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

