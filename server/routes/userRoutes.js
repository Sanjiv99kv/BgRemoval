import express from 'express';
import { buyCredits, clerkWebhooks, userCredits, verifyPayment } from '../controllers/userController.js'
import { authUser } from '../middlewares/auth.js';

export const userRouter = express.Router();

userRouter.post("/webhooks", clerkWebhooks);
userRouter.get("/credits", authUser, userCredits);
userRouter.post("/buyCredits", authUser, buyCredits);
userRouter.post("/verifyPayment", authUser, verifyPayment);