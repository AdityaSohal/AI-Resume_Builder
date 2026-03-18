import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createResume,
    deleteResume,
    findResumeByID,
    getPublicResumeByID,
    updateResume,
    updateResumeTitle
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.put('/update-title/:resumeID', protect, updateResumeTitle);
resumeRouter.delete('/delete/:resumeID', protect, deleteResume);

// FIX: /public/:resumeID MUST be defined before /:resumeID
// Otherwise Express matches "public" as the resumeID param and the public route never runs
resumeRouter.get('/public/:resumeID', getPublicResumeByID);
resumeRouter.get('/:resumeID', protect, findResumeByID);

export default resumeRouter;