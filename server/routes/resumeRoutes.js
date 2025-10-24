import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createResume, deleteResume, findResumeByID, getPublicResumeByID, updateResume, updateResumeTitle } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create',protect, createResume);
resumeRouter.put('/upload',upload.single('image'), protect, updateResume);
resumeRouter.put('/update-title/:resumeID', protect, updateResumeTitle);
resumeRouter.delete('/delete/:resumeID',protect, deleteResume);
resumeRouter.get('/get/:resumeID',protect, findResumeByID);
resumeRouter.get('/public/:resumeID', getPublicResumeByID);

export default resumeRouter;
