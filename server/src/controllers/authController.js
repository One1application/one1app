import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/dbClient.js";
import {
  signInOtpValidation,
  signInValidation,
} from "../types/signinValidation.js";
import {
  signUpOtpValidation,
  signupValidation,
} from "../types/signupValidation.js";
import { sendOtp } from "../utils/sendOtp.js";

export const register = async (req, res) => {
  try {
    let { email, phoneNumber, name, goals, heardAboutUs, socialMedia, role } =
      req.body;
    if (role === "User") {
      if (!heardAboutUs) heardAboutUs = "";
      if (!goals) goals = [];
      if (!socialMedia) socialMedia = "";
    }

    signupValidation.parse({
      email,
      phone: phoneNumber,
      name,
      role,
      goals,
      heardAboutUs,
      socialMedia,
    });

    const existingUserByEmail = await prisma.User.findFirst({
      where: {
        email: email,
        verified: true,
      },
    });
    console.log("existingUserByEmail", existingUserByEmail);
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }
    console.log("existingUserByEmail", existingUserByEmail);
    const existingUserByPhone = await prisma.User.findFirst({
      where: {
        phone: phoneNumber,
        verified: true,
      },
    });

    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists." });
    }

    const newUser = await prisma.User.upsert({
      where: {
        email: email,
        phone: phoneNumber,
      },
      update: {
        email,
        phone: phoneNumber,
        name,
        role: role,
        verified: false,
        goals,
        heardAboutUs,
        socialMedia,
      },
      create: {
        email,
        phone: phoneNumber,
        name,
        role: role,
        verified: false,
        goals,
        heardAboutUs,
        socialMedia,
        wallet: {
          create: {},
        },
      },
    });

    if (!newUser) {
      return res.status(500).json({ message: "Internal server error" });
    }

    await sendOtp(phoneNumber);
    res.status(201).json({
      message: "OTP sent to phone number",
    });
    // })
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Internal server Error." });
  }
};

export const verifyOtpForRegister = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    signUpOtpValidation.parse({
      phone: phoneNumber,
      otp,
    });

    const otpStored = await prisma.Otp.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!otpStored) {
      return res.status(404).json({ message: "No otp found" });
    }
    const otpValid = await bcrypt.compare(otp, otpStored.phoneCodeHash);
    if (!otpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpValid) {
      console.log("otp validate", otpValid);
    }

    const updatedUser = await prisma.User.update({
      where: {
        phone: phoneNumber,
      },
      data: {
        verified: true,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(
      {
        id: updatedUser.id,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "13d" }
    );

    res.status(200).json({
      message: "User verified successfully",
      success: true,
      token,
    });

    const deletedOtp = await prisma.Otp.delete({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    console.log("Deleted OTP:", deletedOtp);
  } catch (error) {
    console.error("Error verifying otp for register", error);

    res.status(500).json({ message: "Internal Server Error." });
  }
};

export async function signIn(req, res) {
  try {
    const { email, phoneNumber } = req.body;

    signInValidation.parse({
      email,
      phoneNumber,
    });

    const userExist = await prisma.User.findFirst({
      where: {
        OR: [{ email }, { phone: phoneNumber }],
      },
    });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exists.",
      });
    }

    await sendOtp(phoneNumber);
    return res.status(200).json({
      success: true,
      message: "OTP sent to phone number",
    });
  } catch (error) {
    console.error("Error in checking user for signIn.", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function verifyOtpForLogin(req, res) {
  try {
    const { email, phoneNumber, otp } = req.body;

    signInOtpValidation.parse({
      email,
      phoneNumber,
      otp,
    });

    const otpStored = await prisma.Otp.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!otpStored) {
      return res.status(404).json({ message: "No otp found" });
    }
    const otpValid = await bcrypt.compare(otp, otpStored.phoneCodeHash);
    if (!otpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpValid) {
      console.log("otp validate");
    }
    // const userId = Object.keys(otpStorage).find(id => {
    //     if(otpStorage[id].otp === otp.toString() && otpStorage[id].phone === phoneNumber) return id;
    // });
    // if(!userId) return res.status(400).json({ message: "Invalid OTP" });

    // delete otpStorage[userId];

    const updatedUser = await prisma.User.update({
      where: {
        phone: phoneNumber,
        email: email,
      },
      data: {
        verified: true,
      },
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(
      {
        id: updatedUser.id,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "13d" }
    );

    const deletedOtp = await prisma.Otp.delete({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    console.log("Deleted OTP:", deletedOtp);

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error in verifying otp.", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}
