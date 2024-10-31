import express from 'express';
import { clerkWebhooks } from '../controllers/userController.js'

export const userRouter = express.Router();


userRouter.post("/webhooks", clerkWebhooks);