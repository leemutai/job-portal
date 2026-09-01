import express from "express";
import { changeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a company
router.post('/register',upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// get company data
router.get('/company',protectCompany, getCompanyData)

// Post a job
router.post('/post-job', protectCompany, postJob)

// Get Applicants data of Company
router.get('/applicants',protectCompany, getCompanyJobApplicants)

// Get company job lists
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)

//Change application status
router.post('/change-status', protectCompany,changeJobApplicationStatus)

// Change Applications Visibility
router.post('/change-visibility', protectCompany,changeVisibility)

export default router;