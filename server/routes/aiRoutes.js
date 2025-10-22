import express, { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { enchanceJobDescription, enchanceProfessionalSummary, uploadResume } from "../controllers/aiControllers.js";

const aiRoutes = express.Router();

aiRoutes.post('/enhance-pro-sum',protect,enchanceProfessionalSummary)
aiRoutes.post('/enhance-job-desc',protect,enchanceJobDescription)
aiRoutes.post('/upload-resume',protect,uploadResume)

export default aiRoutes;
