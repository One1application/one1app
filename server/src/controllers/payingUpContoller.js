import { imagekit } from "../config/imagekit.js";
import { razorpay } from "../config/razorpay.js";
import prisma from "../db/dbClient.js";

export async function createPayingUp(req, res) {

    try {
        
        console.log(req.body);

        const { title, description, paymentDetails, category, testimonials, faqs, refundPolicies, tacs, coverImage, files} = req.body;
    
        const user = req.user;

        await prisma.payingUp.create({

            data: {
                title,
                description,
                paymentDetails,
                category,
                testimonials,
                faqs,
                refundPolicies,
                coverImage,
                tacs,
                files,
                createdById: user.id,
                
            }
        })
        
        return res.status(200).json({
            success: true,
            message: "Paying up created successfully.",
        })


    } catch (error) {
        
        console.error("Error while creating paying Up.", error);
        res.status(500).json({
            success: false,
            message: "Please try again later."
        })
        
    }
}

export async function editPayingUpDetails(req, res) {
    
        try {
            const { payingUpId } = req.params;
            const { title, description, paymentDetails, category, testimonials, faqs, refundPolicies, tacs, coverImage, files} = req.body;
        
            const user = req.user;
    
            const payingUp = await prisma.payingUp.findUnique({
                where: {
                    id: payingUpId
                }
            })
    
            if(payingUp.createdById !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to edit this payingUp."
                })
            }
    
            const resdd = await prisma.payingUp.update({
                where: {
                    id: payingUpId
                },
                data: {
                    title,
                    description,
                    paymentDetails,
                    category,
                    testimonials,
                    faqs,
                    refundPolicies,
                    coverImage,
                    tacs,
                    files,
                }
            })
            console.log(resdd);
            
            const updatedPayingUp = await prisma.payingUp.findUnique({
                where: {
                    id: payingUpId
                }
            })

            return res.status(200).json({
                success: true,
                message: "Paying up updated successfully.",
                paylaod:{
                    payingUp: updatedPayingUp
                }
            })
    
    
        } catch (error) {
            
            console.error("Error while updating paying Up.", error);
            res.status(500).json({
                success: false,
                message: "Please try again later."
            })
            
        }
}



export async function getCreatorPayingUps(req, res) {
    try {
        
        const user = req.user;

        const payingUps = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                createdPayingUps: {
                    include: {
                        _count: {
                            select: {
                                payingUpTickets: true
                            }
                        }
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Fetched webinars successfully.",
            payload: {
                payingUps: payingUps.createdPayingUps
            }
        })


    } catch (error) {

        console.error("Error in fetching Paying Ups.", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching Paying Ups."
        })

    }
}

export async function getPayingUpById(req, res) {
    try {
        const { payingUpId } = req.params;
        const user = req.user;
        
        if(!payingUpId) {
            return res.status(403).json({
                success: false,
                message: "No paying up Id provided."
            })
        }
        
        const payingUp = await prisma.payingUp.findUnique({
            where: {
                id: payingUpId
            },
            include: {
                payingUpTickets: user ? {
                    where: {
                        boughtById: user.id
                    }
                } : false
            }
        })

        if(!payingUp) {
            return res.status(401).json({
                success: false,
                message: "No paying found."
            })
        }

        const sendFiles = user && (payingUp.createdById === user.id || payingUp.payingUpTickets.length > 0);
        
        return res.status(200).json({
            success: true,
            message: "Fetched payingUp successfully.",
            payload: {
                payingUp: {
                    ...payingUp,
                    ...(sendFiles ? {files: payingUp.files} : {files: null})
                }
            }
        })
        
    } catch (error) {
        console.error("Error in fetching paying up.", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching paying up."
        })
    }
}


export async function purchasePayingUp(req, res) {

    try {

        const { payingUpId } = req.body;
        const user = req.user;

        if(!payingUpId) {
            return res.status(400).json({
                success: false,
                message: "PayingUp Id required."
            })
        }



        const payingUp = await prisma.payingUp.findUnique({
            where: {
                id: payingUpId,    
            },
            include: {
                payingUpTickets: {
                    where: {
                        boughtById: user.id
                    }
                }
            }
        });

        if(!payingUp) {
            return res.status(400).json({
                success: false,
                message: "PayingUp not found."
            })
        }

        if (payingUp.createdById === user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot purchase your own paying up."
            })
        }

        if(payingUp.payingUpTickets?.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You have already purchased the tickets."
            })
        }


        if(!payingUp.paymentDetails.paymentEnabled) {

            await prisma.payingUpTicket.create({
                data: {
                    payingUpId,
                    boughtById: user.id
                }
            })
            return res.status(200).json({
                success: true,
                message: "Ticket bought successfully for payingUp."
            })
        }

        const option = {
            amount: payingUp.paymentDetails.totalAmount * 100,
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
                payingUpId: payingUp.id
            }
        })
        
    } catch (error) {
        console.error("Error while purchasing paying up.", error);
        res.status(500).json({
            success: false,
            message: "Please try again later."
        })
    }
}