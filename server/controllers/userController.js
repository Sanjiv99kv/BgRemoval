import { Webhook } from 'svix';
import { userModel } from '../models/userModel.js';
import Stripe from 'stripe';
import { transactionModel } from '../models/transactionModel.js'
import urlencode from 'urlencode'

const stripe = new Stripe("sk_test_51PzVZhP2ox7QBZEwqGSdqf4bZ0MNMAR8LmxkuGwNsfCLhAWQkt9bOQWPwRi2AFxv4A9owXCWnuLn8EClvwKbMF1Z00bOAIDH90");

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.create(userData);
                res.json({})
                break;
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                res.json({})
                break;
            }
            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id })
                res.json({});
                break;
            }
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.body;

        const userData = await userModel.findOne({ clerkId })

        res.json({ success: true, credits: userData.creditBalance });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const buyCredits = async (req, res) => {
    try {
        const { pack, amount, credits, clerkId } = req.body;

        const frontend_url = "http://localhost:5173";

        const date = Date.now();

        const transactionData = {
            clerkId,
            plan: pack,
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const line_items = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: pack,
                    },
                    unit_amount: amount * 100 * 278,
                },
                quantity: 1,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&transactionId=${urlencode(newTransaction._id)}`,
            cancel_url: `${frontend_url}/verify?success=false&transactionId=${urlencode(newTransaction._id)}`,
        })


        return res.status(201).json({
            success: true,
            session_url: session.url,
        });


    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const verifyPayment = async (req, res) => {
    const { transactionId, clerkId, success } = req.body;
    try {
        if (success) {
            const transaction = await transactionModel.findById(transactionId);
            await transactionModel.findByIdAndUpdate(transactionId, { payment: true });
            const user = await userModel.findOne({ clerkId });
            await userModel.findOneAndUpdate({ clerkId }, { creditBalance: user.creditBalance + transaction.credits });
            return res.json({
                success: true,
                message: "Paid"
            })
        } else {
            await transactionModel.findByIdAndDelete(transactionId)
            return res.json({
                success: false,
                message: "Not paid"
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error"
        })
    }
}
