import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/job.js";
import JobApplication from "../models/JobApplication.js";

// Register a new company
export const registerCompany = async (req, res) => {

    const {name, email, password } = req.body

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({success:false, message: "Missing details"})
        
    }

    try {

        const companyExists = await Company.findOne({email})

        if (companyExists) {
            return res.json({success:false, message: "Company already registered"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)

        })

        
        
    } catch (error) {
        res.json({success:false, message: error.message})
        
    }

}

// Company Login
export const loginCompany = async (req, res) => {

    const {email, password} = req.body

    try {
        const company = await Company.findOne({email})

        if (await bcrypt.compare(password, company.password)) {

            res.json({
                success: true,
                company: {
                    _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
                },
                token: generateToken(company._id)
            })
            
        }

        else {
            res.json({success: false, message: 'Invalid email or password'})
        }
        
    } catch (error) {

        res.json({success: false, message: error.message})
        
    }

}

//Get company data
export const getCompanyData = (req, res) => {

    

    try {

        const company = req.company

        res.json({success: true, company})
        
    } catch (error) {

        res.json({success: false, message: error.message})
        
    }



}

// Post a new job
export const postJob = async (req, res) => {

    const {title, description, location, salary, level, category} = req.body

     const companyId = req.company._id

    try {

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        res.json({success: true, newJob})
        
    } catch (error) {

        res.json({success: false, message: error.message})
        
    }

}

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {

    try {

        const companyId = req.company._id

        // Find job applications for the user and populate related data

        const applications = await JobApplication.find({companyId})
        .populate('userId', 'name image resume')
        .populate('jobId', 'title location category level salary')
        .exec();

        return res.json({ success: true, applications})
        
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }

}

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {

    try {

        const companyId = req.company._id

        const jobs = await Job.find({companyId})

        

        //Adding no of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({jobId: job._id});
            return {...job.toObject(), applicants: applicants.length}

        } ))

        res.json({success: true, jobsData})


        
    } catch (error) {

        res.json({success: false, message: error.message})
        
    }

}

// change job application status
// Change job application status
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const companyId = req.company?._id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company authentication required",
      });
    }

    if (!id || !["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "A valid application ID and status are required",
      });
    }

    // Only update applications belonging to this company.
    const application = await JobApplication.findOneAndUpdate(
      { _id: id, companyId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found for this company",
      });
    }

    return res.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Change application status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update application status",
    });
  }
};

// change job visibility status
export const changeVisibility = async (req, res) => {

    try {

        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {

            job.visible = !job.visible
            
        }

        await job.save()

        res.json({success: true, job})
        
    } catch (error) {

        res.json({success: false, message: error.message})
        
    }

}