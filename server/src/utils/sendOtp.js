// i just addded it but it is not used anywhere yet

import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function sendOtp(phone){
    const otp =  Math.floor(100000 + Math.random() * 900000).toString();
    try{
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
            
        });
        return otp;
    }catch(err){
        console.log(err);
        return null;
    }
}