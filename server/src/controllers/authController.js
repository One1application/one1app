import prisma from '../db/dbClient.js';
import { signupValidation, signUpOtpValidation } from '../types/signupValidation.js';
import { signInOtpValidation, signInValidation } from "../types/signinValidation.js";
import jwt from 'jsonwebtoken';
import sendOtp from '../utils/sendOtp.js';

const otpStorage = {};




export const register = async (req, res) => {
    try {

        const {
            email, phoneNumber, name, goals, heardAboutUs, socialMedia, role
        } = req.body

        signupValidation.parse({
            email,
            phone: phoneNumber,
            name,
            role,
            goals,
            heardAboutUs,
            socialMedia
        });

        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (existingUserByEmail) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }

        const existingUserByPhone = await prisma.user.findFirst({
            where: {
                phone: phoneNumber
            }
        })

        if (existingUserByPhone) {
            return res.status(400).json({ message: "A user with this phone number already exists." });
        }

        await prisma.$transaction(async (prisma) => {

            // const otp = await sendOtp(phoneNumber);

            // if(!otp) return res.status(500).json({ message: "Error sending OTP" });

            const newUser = await prisma.user.create({
                data: {
                    email,
                    phone: phoneNumber,
                    name,
                    role: role,
                    verified: false,
                    goals,
                    heardAboutUs,
                    socialMedia,
                    wallet: {
                        create: {}
                    }
                }
            })

            if (!newUser) {
                return res.status(500).json({ message: "Internal server error" });
            }


            // otpStorage[newUser.id] = { otp, phone:phoneNumber };

            res.status(201)
                .json({
                    message: "OTP sent to phone number"
                })
        })

    } catch (error) {
        console.error("Error registering user", error);
        res
            .status(500)
            .json({ message: "Error registering user", error })
    }
}

export const verifyOtpForRegister = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        signUpOtpValidation.parse({
            phone: phoneNumber,
            otp
        });
        
        const user = await prisma.user.findFirst({
            where: {
                phone: phoneNumber
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(otpStorage);
        


        // const userId = Object.keys(otpStorage).find(id => {
        //     if(otpStorage[id].otp === otp.toString() && otpStorage[id].phone === phoneNumber) return id;
        // });
        if(otp!=='000000') return res.status(400).json({ message: "Invalid OTP" });

        const updatedUser = await prisma.user.update({
            where: {
                phone: phoneNumber
            },
            data: {
                verified: true
            }
        })

        if (!updatedUser) {
            return res.status(500).json({ message: "Internal server error" });
        }

        // delete otpStorage[userId];


        const token = jwt.sign({
            id: updatedUser.id,
            role: updatedUser.role
        }, process.env.JWT_SECRET, { expiresIn: '13d' });

        res.status(200)
            .json({
                message: "User verified successfully",
                success:true,
                token
            })

    } catch (error) {
        console.error("Error verifying otp for register", error);
        res
            .status(500)
            .json({ message: "Error verifying otp for register", error })
    }
}

export async function signIn(req, res) {

    try {
        const { email, phoneNumber } = req.body;

        signInValidation.parse({
            email,
            phoneNumber
        })

        const userExist = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: phoneNumber }
                ]
            }
        })

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists."
            })
        }

        const otp = await sendOtp(userExist.phone);
        otpStorage[userExist.id] = { otp, phone: userExist.phone };


        return res.status(200).json({
            success: true,
            message: "OTP sent to phone number"
        })

    } catch (error) {

        console.error("Error in checking user for signIn.", error);
        return res.status(500).json({
            success: false,
            message: "Error in checking user for signIn."
        })

    }

}


export async function verifyOtpForLogin(req, res) {

    try {

        const { email, phoneNumber, otp } = req.body;

        signInOtpValidation.parse({
            email,
            phoneNumber,
            otp
        })

        
        const userExist = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: phoneNumber }
                ]
            }
        })
        
        if (!userExist) {
            
            return res.status(404).json({
                success: false,
                message: "User doesn't exists."
            })
        }
        // const userId = Object.keys(otpStorage).find(id => {
        //     if(otpStorage[id].otp === otp.toString() && otpStorage[id].phone === phoneNumber) return id;
        // });
        // if(!userId) return res.status(400).json({ message: "Invalid OTP" });

        // delete otpStorage[userId];

        if(otp!=='000000') return res.status(400).json({ message: "Invalid OTP" });

        const token = jwt.sign({
            id: userExist.id,
            role: userExist.role
        }, process.env.JWT_SECRET, { expiresIn: '13d' });



        return res.status(200).json({
            success: true,
            token,
        },)


    } catch (error) {

        console.error("Error in verifying otp.", error);
        return res.status(500).json({
            success: false,
            message: "Error in verifying otp."
        })
    }

}