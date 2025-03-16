import { razorpay } from "../config/razorpay.js";
import prisma from "../db/dbClient.js";
import { telegramValidation } from "../types/telegramValidation.js";
import { SchemaValidator } from "../utils/validator.js";

export async function createTelegram(req, res) {
    try {

        const isValid = await SchemaValidator(telegramValidation, req.body, res);
        if(!isValid) {
            return
        }
        const {
            title,
            description,
            subscriptions,
            imageUrl,
            genre,
            channelId,
            channelName

        } = req.body;
        const user = req.user;
        
        await prisma.telegram.create({
            data: {
                title,
                description,
                subscription: subscriptions,
                imageUrl,
                genre,
                channelId,
                channelName,
                createdById: user.id
            }
        })

        res.status(200).json({
            success: true,
            message: "Telegram created successfully."
        })

    } catch (error) {
        console.error("Error in creating telegram.", error);
        res.status(500).json({
            success: false,
            meesage: "Internal server error."
        })
        
    }
}

export async function getCreatorTelegram(req, res) {
    try {
        
        const user = req.user;

        const telegram = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                createdTelegrams: {
                    include: {
                        _count: {
                            select: {
                                telegramSubscriptions: true
                            }
                        }
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Fetched telegrams successfully.",
            payload: {
                telegrams: telegram.createdTelegrams
            }
        })


    } catch (error) {

        console.error("Error in fetching Telegrams.", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching Telegrams."
        })

    }
}
export async function getTelegramById(req, res) {
    try {

        const { telegramId } = req.params;
        console.log(req.params);
        
        if(!telegramId) {
            return res.status(403).json({
                success: false,
                message: "No telegramId Id provided."
            })
        }
        
        const telegram = await prisma.telegram.findUnique({
            where: {
                id: telegramId
            }
        })
        
        return res.status(200).json({
            success: true,
            message: "Fetched telegram successfully.",
            payload: {
                telegram
            }
        })
        
    } catch (error) {
        console.error("Error in fetching telegram.", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching telegram."
        })
    }
}


export async function purchaseTelegram(req, res) {

    try {

        const { telegramId, days } = req.body;
        const user = req.user;
        if(!telegramId) {
            return res.status(400).json({
                success: false,
                message: "Telegram Id required."
            })
        }

        const telegram = await prisma.telegram.findUnique({
            where: {
                id: telegramId
            }
        });

        if(!telegram) {
            return res.status(400).json({
                success: false,
                message: "Telegram not found."
            })
        }

        // if (telegram.createdById === user.id) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "You cannot purchase your own channel."
        //     })
        // }

        
        const subscriptionDetails = telegram.subscription.find(sub => sub.days === days)

        if(!subscriptionDetails) {
            return res.status(400).json({
                success: false,
                message: "No subscription found."
            })
        }

        const option = {
            amount: parseFloat(subscriptionDetails.cost) * 100,
            currency: "INR",
            payment_capture: 1
        }

        const order = await razorpay.orders.create(option);

        return res.status(200).json({
            success: true,
            payload: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                telegramId: telegram.id
            }
        })
        
    } catch (error) {
        console.error("Error while purchasing telegram.", error);
        res.status(500).json({
            success: false,
            message: "Please try again later."
        })
    }
}