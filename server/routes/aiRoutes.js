import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    enhanceJobDescription,
    enhanceProfessionalSummary,
    uploadResume
} from "../controllers/aiControllers.js";

const aiRoutes = express.Router();

// All AI routes require authentication
aiRoutes.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRoutes.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRoutes.post('/upload-resume', protect, uploadResume);

export default aiRoutes;