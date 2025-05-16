import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyPayment,addBusinessInfo, getBusinessInfo, addKycDetails,getKycDetails, addBankDetails, getBankDetails, getWalletDetails, getTransactions, getWithdrawals, withdrawAmount, addBankOrUpi, getBankAndUpis, setMPIN, verifyMpinOtp, updateBankDetails, updateBusinessInfo, deleteBusinessInfo, updateKycDetails, deleteKycDetails, updateBankOrUpi, deleteBankOrUpi} from '../controllers/walletController.js';
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
walletRoutes.post('/update-business-info',updateBusinessInfo)
walletRoutes.delete('/delete-business-info',deleteBusinessInfo)
walletRoutes.get('/get-business-info',getBusinessInfo)

walletRoutes.post('/add-verfication-details',addKycDetails)
walletRoutes.post('/update-verfication-details', updateKycDetails)
walletRoutes.delete('/delete-verfication-details',deleteKycDetails)
walletRoutes.get('/get-verification-details',getKycDetails);

walletRoutes.post('/add-bank-details',addBankDetails);
walletRoutes.post('/update-bank-details/:bankDetailsId', updateBankDetails);
walletRoutes.get('/get-bank-details',getBankDetails);

walletRoutes.get('/get-transactions',getTransactions)
walletRoutes.get('/get-withdrawals',getWithdrawals)

walletRoutes.post('/withdraw',withdrawAmount)


walletRoutes.post('/add-bank-or-upi',addBankOrUpi)
walletRoutes.post('/update-bank-or-upi',updateBankOrUpi)
walletRoutes.delete('/delete-bank-or-upi',deleteBankOrUpi)
walletRoutes.get('/get-bank-or-upi',getBankAndUpis)

walletRoutes.post('/set-mpin',setMPIN)
walletRoutes.post('/verify-mpin',verifyMpinOtp)