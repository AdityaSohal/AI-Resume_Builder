import express from 'express';
import { getUserByID, getUserResume, loginUser, registerUser } from '../controllers/userControllers.js';
import protect from '../middleware/authMiddleware.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data',protect, getUserByID)
userRouter.get('/resume',protect, getUserResume)

export default userRouter;

