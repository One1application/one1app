
import Razorpay from "razorpay";
import axios from 'axios'

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

export const fetchPaymentDetails = async (paymentId) => {
    try {
        if (!paymentId) {
            throw new Error("Payment ID is required.");
        }
        const paymentResponse = await razorpay.payments.fetch(paymentId);
        return paymentResponse;
    } catch (error) {
        console.error("Error in fetching payment details.", error);
        throw error;
    }

}


export const createPayout = async (payoutData) => {
    let payoutResponse;
    try {
        payoutResponse = await axios.post('https://api.razorpay.com/v1/payouts', payoutData, {
            auth: { username: process.env.RAZORPAY_KEY_ID, password: process.env.RAZORPAY_KEY_SECRET },
        });
        return payoutResponse.data;
    } catch (err) {
        console.error("Error in creating payout.", err);
        throw err;
    }
}

export const createContact = async (contactData) => {
    try {
        const contactResponse = await axios.post('https://api.razorpay.com/v1/contacts', contactData, {
            auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_SECRET
            }
        })

        return contactResponse.data;
    } catch (error) {
        if(error.code === "ERR_BAD_REQUEST") {
            console.error("Issue with provided data");
            return null
        }
        console.error("Error in creating contact.", error);
        return null;
    }
}

export const createFundAccount = async (fundAccountData) => {
    try {
        const fundAccountResponse = await axios.post('https://api.razorpay.com/v1/fund_accounts', fundAccountData, {
            auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_SECRET
            }
        })
        console.log(fundAccountResponse.data);
        
        return fundAccountResponse.data;
    } catch (error) {
        if(error.code === "ERR_BAD_REQUEST") {
            console.error("Issue with provided data");
            return null
        }
        console.error("Error in creating fund account.", error);
        return null;
        
    }
}