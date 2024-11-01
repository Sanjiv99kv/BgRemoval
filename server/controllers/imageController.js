import axios from 'axios'
import fs from 'fs';
import FormData from 'form-data'
import { userModel } from '../models/userModel.js';
import { log } from 'console';


export const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const user = await userModel.findOne({ clerkId });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.creditBalance === 0) {
            return res.json({
                success: false,
                message: 'You have insufficient balance to remove background',
                creditBalance: user.creditBalance
            });
        }

        // Check if file is present
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // Use the buffer directly
        const formdata = new FormData();
        formdata.append('image_file', req.file.buffer, {
            filename: req.file.originalname, // Optional: helps identify the file name
            contentType: req.file.mimetype   // Optional: sets correct MIME type
        });

        const { data } = await axios.post("https://clipdrop-api.co/remove-background/v1", formdata, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formdata.getHeaders(),
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.json({
            success: true,
            resultImage,
            creditBalance: user.creditBalance - 1,
            message: "Background removed",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};