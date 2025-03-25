import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJobs, getAllJobs, getJobByID, postJob } from '../controllers/jobs.controller.js';

const router=express.Router();

router.route("/post").post(isAuthenticated,postJob)
router.route("/get").get(isAuthenticated,getAllJobs)
router.route("/getadminsjobs").get(isAuthenticated,getAdminJobs)
router.route("/get/:id").get(isAuthenticated,getJobByID)




export default router;