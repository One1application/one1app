// import twilio from 'twilio';
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
import prisma from '../db/dbClient.js';
import bcrypt from 'bcrypt'
import axios from 'axios'

export  async function sendOtp(phoneNumber){
    const otp=Math.floor(100000 + Math.random() * 899999).toString();
    
    const message=`Dear User,Your Verification Code is ${otp}.Please do not share this with anyone.Team Contiks One Hub Technology Pvt Ltd (One1app) Website:-one1app.com`;
    const encodeUrlMessage=encodeURIComponent(message);
   try{
      const response=await axios.get(`https://site.ping4sms.com/api/smsapi?key=d260450575c2f60afe93097661a4b45f&route=2&sender=COHTPL&number=${phoneNumber}&sms=${encodeUrlMessage}&templateid=1707174408869151211`) 
      console.log("otp sent successfully",response.data);

      const hash=await bcrypt.hash(otp,10);
      const expiresAt=new Date(Date.now()+5*60*1000) 
      const newOtp= await prisma.Otp.upsert({
      where: {
         phoneNumber: phoneNumber, 
       },
       update: {
         phoneCodeHash: hash,  
         expiresAt: expiresAt,
       },
       create: {
         phoneNumber,           
         phoneCodeHash: hash,
         expiresAt,
       },
      });
      console.log("response is",newOtp);
      
    
      // Send OTP via SMS
      console.log(`Sending OTP ${otp} to ${phoneNumber}`);
      // await sendSms(phoneNumber, `Your OTP is: ${otp}`); // <-- integrate actual SMS here
    
      
    
   }
   catch(error){
    console.log("otp not send",error);
    
   }
   return otp; // for testing only — in prod, you usually don't return it
}
//     try{
//         await client.messages.create({
//             body: `Your OTP is ${otp}`,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: phone
//         });
//         return otp;
//     }catch(err){
//         console.log(err);
//         return null;
//     }
// }