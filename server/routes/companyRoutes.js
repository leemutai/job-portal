import express from "express";
import { changeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controllers/companyController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Register a company
router.post('/register',upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// get company data
router.get('/company', getCompanyData)

// Post a job
router.post('/post-job', postJob)

// Get Applicants data of Company
router.get('/applicants', getCompanyJobApplicants)

// Get company job lists
router.get('/list-jobs', getCompanyPostedJobs)

//Change application status
router.post('/change-status', changeJobApplicationStatus)

// Change Applications Visibility
router.post('/change-visibility', changeVisibility)

export default router;