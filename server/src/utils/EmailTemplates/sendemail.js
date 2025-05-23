import transporter from "../../config/nodemailer.js";
import { emailTemplates } from "./emailtemplates.js";

export const sendWelcome_Email = async(email,username) =>{
    try {
         const mailOptions = {
    from: `"One1App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome - One1App",
    html: emailTemplates.welcome(username),
  };
  
  await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("something went wrong" || error?.message)
    }
     
}
export const verification_otp_Email = async(email,otp) =>{
    try {
         const mailOptions = {
    from: `"One1App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verfify your email - One1App",
    html: emailTemplates.verification_otp(otp),
  };
  
  await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("something went wrong" || error?.message)
    }
     
}