
import crypto from 'crypto';
import prisma from '../db/dbClient.js';
import { createContact, createFundAccount, createPayout, razorpay } from '../config/razorpay.js';
import { fetchPaymentDetails } from '../config/razorpay.js';
import axios from 'axios';
import { generateSignedUrl } from '../config/imagekit.js';
import dotenv from "dotenv";
dotenv.config();



export async function getWalletDetails(req, res) {

    try {

        const user = req.user;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }

        const wallet = await prisma.wallet.findUnique({
            where: {
                userId: user.id
            }
        })

        const accountNumbers = await prisma.bankDetails.findMany({
            where: {
                userId: user.id
            },
            select: {
                accountNumber: true
            }
        })

        const upiIds = await prisma.uPI.findMany({
            where: {
                userId: user.id
            },
            select: {
                upiId: true
            }
        })

        const accountNumberResponse = accountNumbers.map(account => account.accountNumber);
        const upiIdResponse = upiIds.map(upi => upi.upiId);


        return res.status(200).json({
            success: true,
            message: "Fetched wallet details successfully.",
            payload: {
                balance: wallet.balance === null ? 0 : wallet.balance,
                totalEarnings: wallet.totalEarnings === null ? 0 : wallet.totalEarnings,
                totalWithdrawals: wallet.totalWithdrawals === null ? 0 : wallet.totalWithdrawals,
                lastModified: wallet.updatedAt,
                accountNumbers: accountNumberResponse,
                upiIds: upiIdResponse
            }
        })


    } catch (error) {
        console.error("Error while fetching balance.", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })

    }

}


export async function verifyPayment(req, res) {

    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            webinarId,
            courseId,
            payingUpId,
            telegramId,
            days,
            channelId
        } = req.body;
        
        const user = req.user;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: user.id
            },
        })

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }

        if (!courseId && !webinarId && !payingUpId && !telegramId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request."
            })
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !existingUser.id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            })
        }

        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature."
            })
        }


        const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

        await prisma.$transaction(async (prisma) => {

            if (webinarId) {
                
                const creator = await prisma.webinar.findUnique({
                    where: {
                        id: webinarId
                    },
                })

                if (!creator) {
                    return res.status(400).json({ success: false, message: "Creator not found." });
                }
                
                const creatorWallet = await prisma.wallet.update({
                    where: {
                        userId: creator.createdById
                    },
                    data: {
                        totalEarnings: { increment: parseFloat(creator.amount) },
                        balance: { increment: parseFloat(creator.amount) }
                    }
                })


                const webinar = await prisma.webinarTicket.create({
                    data: {
                        webinarId,
                        boughtById: existingUser.id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                    }
                })

                if (!webinar) {
                    return res.status(400).json({ success: false, message: "Failed to buy ticket for webinar." });
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        amount: parseFloat(creator.amount),
                        email: existingUser.email,
                        modeOfPayment: paymentDetails.method,
                        phoneNumber: existingUser.phone,
                        product: "Webinar",
                        status: paymentDetails.status,
                        walletId: creatorWallet.id,
                    }
                })

                if (!transaction) {
                    return res.status(400).json({ success: false, message: "Failed to create transaction." });
                }

            }

            if (courseId) {

                const creator = await prisma.course.findFirst({
                    where: {
                        id: courseId
                    },
                })

                if (!creator) {
                    return res.status(400).json({ success: false, message: "Creator not found." });
                }
                
                const creatorWallet = await prisma.wallet.update({
                    where: {
                        userId: creator.createdBy
                    },
                    data: {
                        totalEarnings: { increment: parseFloat(creator.price) },
                        balance: { increment: parseFloat(creator.price) }
                    }
                })

                const course = await prisma.coursePurchasers.create({
                    data: {
                        courseId,
                        purchaserId: existingUser.id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                    }
                })

                if (!course) {
                    return res.status(400).json({ success: false, message: "Failed to buy course." });
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        amount: parseFloat(creator.price),
                        email: existingUser.email,
                        modeOfPayment: paymentDetails.method,
                        phoneNumber: existingUser.phone,
                        product: "Course",
                        status: paymentDetails.status,
                        walletId: creatorWallet.id,
                    }
                })

                if (!transaction) {
                    return res.status(400).json({ success: false, message: "Failed to create transaction." });
                }
            }

            if (payingUpId) {

                const creator = await prisma.payingUp.findFirst({
                    where: {
                        id: payingUpId
                    },
                    select: {
                        createdById: true,
                        paymentDetails: true
                    }
                })

                console.log("cre", creator);
                

                if (!creator) {
                    return res.status(400).json({ success: false, message: "Creator not found." });
                }

                const creatorWallet = await prisma.wallet.update({
                    where: {
                        userId: creator.createdById
                    },
                    data: {
                        totalEarnings: { increment: parseFloat(creator.paymentDetails.totalAmount) },
                        balance: { increment: parseFloat(creator.paymentDetails.totalAmount) }
                    }
                })

                const payingUpTicket = await prisma.payingUpTicket.create({
                    data: {
                        payingUpId,
                        boughtById: existingUser.id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                    }
                })

                if (!payingUpTicket) {
                    return res.status(400).json({ success: false, message: "Failed to buy course." });
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        amount: parseFloat(creator.paymentDetails.totalAmount),
                        email: existingUser.email,
                        modeOfPayment: paymentDetails.method,
                        phoneNumber: existingUser.phone,
                        product: "PayingUp",
                        status: paymentDetails.status,
                        walletId: creatorWallet.id,
                    }
                })

                if (!transaction) {
                    return res.status(400).json({ success: false, message: "Failed to create transaction." });
                }
            }

            if (telegramId && days) {
                
                const creator = await prisma.telegram.findFirst({
                    where: {
                        id: payingUpId
                    },
                    select: {
                        createdById: true,
                        subscription: true
                    }
                })
                
                if (!creator) {
                    return res.status(400).json({ success: false, message: "Creator not found." });
                }

                const subscriptionDetails = creator.subscription.find(sub => sub.days === days)

                const creatorWallet = await prisma.wallet.update({
                    where: {
                        userId: creator.createdById
                    },
                    data: {
                        totalEarnings: { increment: parseFloat(subscriptionDetails.cost) },
                        balance: { increment: parseFloat(subscriptionDetails.cost) }
                    }
                })

                const telegramSubs = await prisma.telegramSubscription.create({
                    data: {
                        telegramId,
                        boughtById: existingUser.id,
                        validDays: days,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                    }
                })

                if (!telegramSubs) {
                    return res.status(400).json({ success: false, message: "Failed to buy course." });
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        amount: parseFloat(subscriptionDetails.cost),
                        email: existingUser.email,
                        modeOfPayment: paymentDetails.method,
                        phoneNumber: existingUser.phone,
                        product: "Telegram",
                        status: paymentDetails.status,
                        walletId: creatorWallet.id,
                    }
                })

                if (!transaction) {
                    return res.status(400).json({ success: false, message: "Failed to create transaction." });
                }
            }
        })

        if(webinarId) {
            const response = await prisma.webinar.findUnique({
                where: {
                    id: webinarId
                }
            })
            
            return res.status(200).json({
                success: true,
                message: "Webinar purchased successfully.",
                payload: {
                    webinarDetail: response.link,
                    venue: response.venue
                }
            })
        }

        if(courseId) {
            return res.status(200).json({
                success: true,
                message: "Course purchased successfully.",
                payload: null
            })
        }

        if(payingUpId) {

            const response = await prisma.payingUp.findUnique({
                where: {
                    id: payingUpId
                }
            })

            const signedUrls = response.files.value.map((file) => {
                const filePath = new URL(file.url).pathname.replace(/^.*\/images/, "/images");
                return generateSignedUrl(filePath)
            })
            
            return res.status(200).json({
                success: true,
                message: "Paying up purchased successfully.",
                payload: {
                    urls: signedUrls
                }
            })
        }

        if(telegramId && days) {
            const response = await axios.get(`http://localhost:3000/generate-invitelink?channelId=${channelId}&boughtById=${user.id}`)
            return res.status(200).json({
                success: true,
                message: "Telegram purchased successfully.",
                payload: {
                    telegramInvitelink: response.data.payload.inviteLink
                }
            })
        }

        return res.status(200).json({
            success: true,
            message: "Purchase successfully."
        })



    } catch (error) {
        console.error("Error in verifying payment.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
}


export async function addBusinessInfo(req, res) {
    try {
        const user = req.user;
        const { firstName, lastName, businessStructure, gstNumber, sebiNumber, sebiCertificate } = req.body;

        if (!firstName || !lastName || !businessStructure || !gstNumber || !sebiNumber || !sebiCertificate) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const businessExists = await prisma.businessInfo.findFirst({
            where: {
                userId: user.id
            }
        })

        if (businessExists) {
            return res.status(400).json({ success: false, message: "Business Information already exists." });
        }

        const businessInfo = await prisma.businessInfo.create({
            data: {
                userId: user.id,
                firstName,
                lastName,
                businessStructure,
                gstNumber,
                sebiNumber,
                sebiCertificate
            }
        })

        if (!businessInfo) {
            return res.status(400).json({ success: false, message: "Failed to add business info." });
        }

        return res.status(200).json({
            success: true,
            message: "Business info added successfully."
        })
    } catch (error) {
        console.error("Error in adding business info.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}


export async function getBusinessInfo(req, res) {
    try {
        const user = req.user;

        const businessInfo = await prisma.businessInfo.findUnique({
            where: {
                userId: user.id
            }
        })

        if (!businessInfo) {
            return res.status(400).json({ success: false, message: "Business info not found." });
        }

        return res.status(200).json({
            success: true,
            payload: businessInfo,
            message: "Fetched business info successfully."
        })
    } catch (error) {
        console.error("Error in fetching business info.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function addKycDetails(req, res) {
    try {
        const user = req.user;
        const { socialMedia, idVerification } = req.body;
        const { aadhaarNumber, aadhaarFront, aadhaarBack, panCard, selfie } = idVerification;

        if (!socialMedia || !idVerification || !aadhaarNumber || !aadhaarFront || !aadhaarBack || !panCard || !selfie) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const kycExists = await prisma.kycRecords.findFirst({
            where: {
                userId: user.id
            }
        })

        if (kycExists) {
            return res.status(400).json({ success: false, message: "KYC details already exists." });
        }


        const kyc = await prisma.kycRecords.create({
            data: {
                aadhaarBack,
                aadhaarFront,
                aadhaarNumber,
                panCard,
                selfie,
                socialMedia,
                userId: user.id,
            }
        })

        if (!kyc) {
            return res.status(400).json({ success: false, message: "Failed to add KYC details." });
        }

        return res.status(200).json({
            success: true,
            message: "KYC details added successfully."
        })

    } catch (error) {
        console.error("Error in adding KYC details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function getKycDetails(req, res) {
    try {
        const user = req.user;

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }



        const kyc = await prisma.kycRecords.findUnique({
            where: {
                userId: user.id
            }
        })

        if (!kyc) {
            return res.status(400).json({ success: false, message: "KYC details not found." });
        }

        return res.status(200).json({
            success: true,
            payload: kyc,
            message: "Fetched KYC details successfully."
        })


    } catch (error) {
        console.error("Error in fetching KYC details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function addBankDetails(req, res) {
    let contactId = null;
    try {
        const user = req.user;
        const { bankingInfo } = req.body;
        const { ifscCode, accountHolderName, accountNumber, bankDocument, upiId } = bankingInfo;

        if (!ifscCode || !accountHolderName || !accountNumber || !bankDocument || !upiId) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const userWallet = await prisma.wallet.findUnique({
            where: {
                userId: userExists.id
            }
        })

        if (!userWallet) {
            return res.status(400).json({ success: false, message: "User wallet not found." });
        }

        if(!userWallet.isKycVerified) {
            return res.status(400).json({
                success: false,
                message: "Kyc is not verified."
            })
        }


        const existingBankDetails = await prisma.bankDetails.findFirst({
            where: {
                userId: userExists.id,
                primary: true
            }
        })

        if (existingBankDetails) {
            return res.status(400).json({ success: false, message: "Primary Bank details already exist." });
        }


        const razorpayContactData = {
            name: accountNumber,
            email: userExists.email,
            contact: userExists.phone,
            type: 'customer'
        }

        const contactResponse = await createContact(razorpayContactData);

        if (!contactResponse) {
            return res.status(400).json({ success: false, message: "Failed to create contact." });
        }
        
        contactId = contactResponse.id;

        const bankFundAccountData = {
            contact_id: contactId,
            account_type: 'bank_account',
            bank_account: { name: userExists.name, ifsc: ifscCode, account_number: accountNumber },
        };



        const fundAccountResponseForBankAccount = await createFundAccount(bankFundAccountData);

        if (!fundAccountResponseForBankAccount) {
            return res.status(400).json({ success: false, message: "Invalid Details. Check them properly" });
        }

        const fundAccountIdForBankAccount = fundAccountResponseForBankAccount.id;

        const bankDetails = await prisma.bankDetails.create({
            data: {
                ifscCode: ifscCode,
                accountHolderName,
                accountNumber,
                bankDocument,
                userId: user.id,
                primary: true,
                razorpayContactID: contactId,
                razorpayFundAccountID: fundAccountIdForBankAccount
            }
        })

        if (!bankDetails) {
            return res.status(400).json({ success: false, message: "Failed to add bank details." });
        }

        const upiFundAccountData = {
            "account_type": "vpa",
            "contact_id": contactId,
            "vpa": {
                "address": upiId
            }
        }

        const fundAccountResponseForUpi = await createFundAccount(upiFundAccountData);

        const fundAccountIdForUpi = fundAccountResponseForUpi.id;

        const updateUpiId = await prisma.uPI.create({
            data: {
                upiId: upiId,
                razorpayFundAccountID: fundAccountIdForUpi,
                bankDetailsId: bankDetails.id,
                userId: user.id
            }
        })

        if (!updateUpiId) {
            return res.status(400).json({ success: false, message: "Failed to add UPI ID." });
        }

        return res.status(200).json({
            success: true,
            message: "KYC updated and bank details added successfully."
        })

    } catch (error) {
        if (contactId !== null) {
            try {
                await axios.patch(`https://api.razorpay.com/v1/contacts/${contactId}`, {
                    active: false
                }, {
                    auth: {
                        username: process.env.RAZORPAY_KEY_ID,
                        password: process.env.RAZORPAY_SECRET
                    }
                })
            } catch (error) {
                console.error("Error in deactivating contact.", error);
            }
        }
        console.error("Error in adding bank details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function getBankDetails(req, res) {
    try {

        const user = req.user;

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const bankDetails = await prisma.bankDetails.findFirst({
            where: {
                userId: userExists.id
            }
        })

        if (!bankDetails) {
            return res.status(400).json({ success: false, message: "Bank details not found." });
        }

        return res.status(200).json({
            success: true,
            payload: bankDetails,
            message: "Fetched bank details successfully."
        })

    } catch (error) {
        console.error("Error in fetching bank details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function withdrawAmount(req, res) {
    try {
        const user = req.user;
        const { withdrawAmount, withdrawalMethod, withdrawFrom, mpin } = req.body;
        //TODO
        if (!withdrawAmount || !withdrawalMethod || !withdrawFrom) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: userExists.id
            }
        })

        if (!wallet) {
            return res.status(400).json({ success: false, message: "Wallet not found." });
        }

        if (wallet.mpin !== mpin) {
            return res.status(400).json({ success: false, message: "Invalid MPIN." });
        }

        if (wallet.balance < withdrawAmount) {
            return res.status(400).json({ success: false, message: "Insufficient balance." });
        }

        if (wallet.isKycVerified === false) {
            return res.status(400).json({ success: false, message: "KYC not completed." });
        }

        if (withdrawalMethod == "bank") {
            const bankDetails = await prisma.bankDetails.findFirst({
                where: {
                    userId: userExists.id,
                    accountNumber: withdrawFrom
                }
            })

            if (!bankDetails) {
                return res.status(400).json({ success: false, message: "Bank details not found." });
            }


            const payoutData = {
                account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
                fund_account_id: bankDetails.razorpayFundAccountID,
                amount: withdrawAmount * 100,
                currency: 'INR',
                mode: 'IMPS',
                purpose: 'payout',
                notes: {
                    user_id: userExists.id,
                    description: 'Withdrawal request',
                },
            };

            const payout = await createPayout(payoutData);

            if (!payout || payout.status !== "processed") {
                return res.status(400).json({ success: false, message: "Failed to withdraw amount." });
            }
            //TODO: might need to update the final status of the payout in the database using webhook or something
            await prisma.$transaction([
                prisma.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        balance: { decrement: withdrawAmount },
                        totalWithdrawals: { increment: withdrawAmount },
                    },
                }),



                prisma.withdrawal.create({
                    data: {
                        amount: withdrawAmount,
                        bankDetailsId: bankDetails.id,
                        walletId: wallet.id,
                        modeOfWithdrawal: withdrawalMethod,
                        status: payout.status,
                        razorpayPayoutId: payout.id,
                    },
                }),
            ]);


            return res.status(200).json({
                success: true,
                message: "Amount withdrawn successfully. "
            })
        } else if (withdrawalMethod === "upi") {
            const upiDetails = await prisma.uPI.findFirst({
                where: {
                    userId: userExists.id,
                    upiId: withdrawFrom
                }
            })

            if (!upiDetails) {
                return res.status(400).json({ success: false, message: "UPI not found." });
            }

            const payoutData = {
                account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
                fund_account_id: upiDetails.razorpayFundAccountID,
                amount: withdrawAmount * 100,
                currency: 'INR',
                mode: 'UPI',
                purpose: 'payout',
                notes: {
                    user_id: userExists.id,
                    description: 'Withdrawal request',
                },
            }

            const payout = await createPayout(payoutData);

            if (!payout || payout.status !== "processed") {
                return res.status(400).json({ success: false, message: "Failed to withdraw amount." });
            }

            await prisma.$transaction([
                prisma.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        balance: { decrement: withdrawAmount },
                        totalWithdrawals: { increment: withdrawAmount },
                    },
                }),

                prisma.withdrawal.create({
                    data: {
                        amount: withdrawAmount,
                        upiId: upiDetails.id,
                        walletId: wallet.id,
                        modeOfWithdrawal: withdrawalMethod,
                        status: payout.status,
                        razorpayPayoutId: payout.id,
                    },
                }),
            ]);

            return res.status(200).json({
                success: true,
                message: "Amount withdrawn successfully."
            })
        }

        return res.status(400).json({ success: false, message: "Invalid withdrawal method." });


    } catch (error) {
        console.error("Error in withdrawing amount.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function getTransactions(req, res) {
    try {
        const user = req.user;
        const { page } = req.query

        const pageSize = 10;

        if (!page) {
            return res.status(400).json({ success: false, message: "Page number is needed" })
        }


        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            },

        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: userExists.id
            }
        })

        if (!wallet) {
            return res.status(400).json({ success: false, message: "Wallet not found." });
        }


        const totalTransactions = await prisma.transaction.count({
            where: {
                walletId: wallet.id
            }
        })
        const totalPages = Math.ceil(totalTransactions / pageSize)




        if (page > totalPages && totalPages !== 0) {
            return res.status(400).json({ success: false, message: "Invalid page number" })
        }



        const transactions = await prisma.transaction.findMany({
            where: {
                walletId: wallet.id
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        })


        return res.status(200).json({
            success: true,
            payload: {
                transactions: transactions.length === 0 ? [] : transactions,
                totalPages
            },
            message: "Fetched transactions successfully."
        })

    } catch (error) {
        console.error("Error in getting transactions.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function getWithdrawals(req, res) {
    try {

        const user = req.user;


        const { page } = req.query

        const pageSize = 10;

        if (!page) {
            return res.status(400).json({ success: false, message: "Page number is needed" })
        }

        const userExist = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExist) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: userExist.id
            }
        })

        if (!wallet) {
            return res.status(400).json({ success: false, message: "Wallet not found." });
        }

        const totalWithdrawals = await prisma.withdrawal.count({
            where: {
                walletId: wallet.id
            }
        })

        const totalPages = Math.ceil(totalWithdrawals / pageSize)

        if (page > totalPages && totalPages !== 0) {
            return res.status(400).json({ success: false, message: "Invalid page number" })
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: {
                walletId: wallet.id
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        })

        if (!withdrawals) {
            return res.status(400).json({ success: false, message: "Unable to fetch withdrawals" });
        }

        return res.status(200).json({
            success: true,
            payload: {
                withdrawals: withdrawals.length === 0 ? [] : withdrawals,
                totalPages
            },
            message: "Fetched withdrawals successfully."
        })


    } catch (error) {
        console.error("Error in getting withdrawals.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}


export async function addBankOrUpi(req, res) {
    let contactId = null;
    try {
        const { accountNumber, ifscCode, accountHolderName, upiId, type } = req.body;

        const user = req.user;

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const existingBankAccounts = await prisma.bankDetails.count({
            where: {
                userId: user.id,
                primary: false
            }
        })

        const existingUpis = await prisma.uPI.count({
            where: {
                userId: user.id
            }
        })

        if ((existingBankAccounts + existingUpis) >= 4) {
            return res.status(400).json({ success: false, message: "You can add only maximum 4 bank accounts or UPIs" });
        }

        const primaryAccount = await prisma.bankDetails.findFirst({
            where: {
                userId: user.id,
                primary: true,
            },
        })

        if (!primaryAccount) {
            return res.status(400).json({ success: false, message: "Please add a primary account first" });
        }

        const razorpayContactData = {
            name: userExists.name,
            email: userExists.email,
            contact: userExists.phone,
            type: 'customer'
        }

        const contactResponse = await createContact(razorpayContactData)

        if (!contactResponse) {
            return res.status(400).json({ success: false, message: "Failed to create contact." });
        }

        contactId = contactResponse.id;
        console.log("Contact ID", contactId);


        if (type === "bank") {


            if (!accountHolderName || !accountNumber || !ifscCode) {
                return res.status(400).json({ success: false, message: "Missing required fields." });
            }

            const bankExists = await prisma.bankDetails.findFirst({
                where: {
                    accountNumber: accountNumber
                }
            })

            if (bankExists) {
                return res.status(400).json({ success: false, message: "Account number already exists." });
            }





            const bankFundAccountData = {
                contact_id: contactId,
                account_type: 'bank_account',
                bank_account: { name: userExists.name, ifsc: ifscCode, account_number: accountNumber },
            };

            const fundAccountResponseForBankAccount = await createFundAccount(bankFundAccountData);

            if (!fundAccountResponseForBankAccount) {
                return res.status(400).json({ success: false, message: "Invalid Details. Check them properly" });
            }

            const fundAccountIdForBankAccount = fundAccountResponseForBankAccount.id;


            const bankDetails = await prisma.bankDetails.create({
                data: {
                    accountNumber,
                    accountHolderName,
                    ifscCode,
                    userId: user.id,
                    primary: false,
                    razorpayContactID: contactId,
                    razorpayFundAccountID: fundAccountIdForBankAccount

                }
            })

            if (!bankDetails) {
                return res.status(400).json({ success: false, message: "Failed to add bank details." });
            }

            return res.status(200).json({
                success: true,
                message: "Bank details added successfully."
            })
        }
        else if (type === "upi") {
            if (!upiId) {
                return res.status(400).json({ success: false, message: "Missing required fields." });
            }

            const upiExists = await prisma.uPI.findFirst({
                where: {
                    upiId: upiId
                }
            }
            )

            if (upiExists) {
                return res.status(400).json({ success: false, message: "UPI ID already exists." });
            }



            const upiFundAccountData = {
                "account_type": "vpa",
                "contact_id": contactId,
                "vpa": {
                    "address": upiId
                }
            }

            const fundAccountResponseForUpi = await createFundAccount(upiFundAccountData);

            if (!fundAccountResponseForUpi) {
                return res.status(400).json({ success: false, message: "Invalid Details. Check them properly" });
            }

            const fundAccountIdForUpi = fundAccountResponseForUpi.id;

            const upiDetails = await prisma.uPI.create({
                data: {
                    upiId,
                    userId: user.id,
                    razorpayFundAccountID: fundAccountIdForUpi,
                    razorpayContactID: contactId,
                    bankDetailsId: primaryAccount.id
                }
            })

            if (!upiDetails) {
                return res.status(400).json({ success: false, message: "Failed to add UPI ID." });
            }



            return res.status(200).json({
                success: true,
                message: "UPI ID added successfully."
            })
        }
    } catch (error) {

        if (contactId !== null) {
            try {
                await axios.patch(`https://api.razorpay.com/v1/contacts/${contactId}`, {
                    active: false
                }, {
                    auth: {
                        username: process.env.RAZORPAY_KEY_ID,
                        password: process.env.RAZORPAY_SECRET
                    }
                })
            } catch (error) {
                console.error("Error in deactivating contact.", error);
            }
        }

        console.error("Error in adding bank or upi details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function getBankAndUpis(req, res) {
    try {
        const user = req.user;

        const userExist = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExist) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const bankAccountNumbers = await prisma.bankDetails.findMany({
            where: {
                userId: userExist.id
            },
            select: {
                accountNumber: true
            }
        })

        const upiIds = await prisma.uPI.findMany({
            where: {
                userId: userExist.id
            },
            select: {
                upiId: true
            }
        })

        if (!bankAccountNumbers || !upiIds) {
            return res.status(400).json({ success: false, message: "Unable to fetch bank and upi details." });
        }
        const responseData = {
            bankAccountNumbers: bankAccountNumbers.map(item => item.accountNumber),
            upiIds: upiIds.map(item => item.upiId)
        };

        return res.status(200).json({
            success: true,
            payload: {
                bankAccountNumbers: responseData.bankAccountNumbers,
                upiIds: responseData.upiIds
            },
            message: "Fetched bank and upi details successfully."
        })


    } catch (error) {
        console.error("Error in fetching bank and upi details.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const mpinOtpMap = {}

export async function setMPIN(req, res) {
    try {
        const user = req.user

        const { mpin } = req.body;

        if (!mpin) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        if (mpin.length !== 4) {
            return res.status(400).json({ success: false, message: "MPIN should be 4 digits." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: userExists.id
            }
        })

        if (!wallet) {
            return res.status(400).json({ success: false, message: "Wallet not found." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        mpinOtpMap[user.id] = { mpin, otp };

        //send otp to user using twilio, yet to implement

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        })
    } catch (error) {
        console.error("Error in setting MPIN.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export async function verifyMpinOtp(req, res) {
    try {
        const user = req.user;

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const wallet = await prisma.wallet.findFirst({
            where: {
                userId: userExists.id
            }
        })

        if (!wallet) {
            return res.status(400).json({ success: false, message: "Wallet not found." });
        }

        const mpinOtp = mpinOtpMap[user.id];

        if (!mpinOtp) {
            return res.status(400).json({ success: false, message: "OTP not found." });
        }

        // if (mpinOtp.otp !== otp) {
        //     return res.status(400).json({ success: false, message: "Invalid OTP." });
        // }

        if (otp !== '000000') {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        await prisma.wallet.update({
            where: {
                id: wallet.id
            },
            data: {
                mpin: mpinOtp.mpin
            }
        })

        return res.status(200).json({
            success: true,
            message: "MPIN set successfully."
        })

    } catch (error) {
        console.error("Error in verifying MPIN OTP.", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}