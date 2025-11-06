import express, { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aiControllers.js";

const aiRoutes = express.Router();

aiRoutes.post('/enhance-pro-sum', enhanceProfessionalSummary)
aiRoutes.post('/enhance-job-desc', enhanceJobDescription)
aiRoutes.post('/upload-resume', protect, uploadResume)

export default aiRoutes;
