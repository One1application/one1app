import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyPayment,addBusinessInfo, getBusinessInfo, addKycDetails,getKycDetails, addBankDetails, getBankDetails, getWalletDetails, getTransactions, getWithdrawals, withdrawAmount, addBankOrUpi, getBankAndUpis, setMPIN, verifyMpinOtp } from '../controllers/walletController.js';
import path from 'path';

export const walletRoutes = express.Router();

walletRoutes.use(authMiddleware);



walletRoutes.post("/verify-payment",
    verifyPayment
);

walletRoutes.get("/testpayment", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'payment.html'));
})

walletRoutes.get("/balance",getWalletDetails)


walletRoutes.post('/add-business-info',addBusinessInfo)
walletRoutes.get('/get-business-info',getBusinessInfo)

walletRoutes.post('/add-verfication-details',addKycDetails)
walletRoutes.get('/get-verification-details',getKycDetails);

walletRoutes.post('/add-bank-details',addBankDetails);
walletRoutes.get('/get-bank-details',getBankDetails);

walletRoutes.get('/get-transactions',getTransactions)
walletRoutes.get('/get-withdrawals',getWithdrawals)

walletRoutes.post('/withdraw',withdrawAmount)


walletRoutes.post('/add-bank-or-upi',addBankOrUpi)
walletRoutes.get('/get-bank-or-upi',getBankAndUpis)

walletRoutes.post('/set-mpin',setMPIN)
walletRoutes.post('/verify-mpin',verifyMpinOtp)