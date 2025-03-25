import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getComapany, getComapanyById, registerCompany, updateCompany } from '../controllers/company.controller.js';
import { singleUpload } from '../middlewares/multer.js';

const router=express.Router();

router.route("/register").post(isAuthenticated,registerCompany)
router.route("/get").get(isAuthenticated,getComapany);
router.route("/get/:id").get(isAuthenticated,getComapanyById)
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany)

export default router;