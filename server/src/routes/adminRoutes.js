import express from 'express';
import {
  adminSelfIdentification,
  createAdmin,
  createUser,
  deleteAdmin,
  deleteUser,
  getAdmins,
  getCreatorDetails,
  getCreatoreWithDrawls,
  getCreatorReport,
  getDashboardData,
  getPayments,
  getProducts,
  getUsers,
  toggleCreatorKycStatus,
  toggleProductVerification,
  updateAdmin,
  updateCreatorPersonalDetails,
  updateUser,
  updateWithDrawlsStatus,
} from '../controllers/adminController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
export const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get('/details', adminSelfIdentification);
adminRouter.post('/users', createUser);
adminRouter.get('/users', getUsers);
adminRouter.put('/users/:id', updateUser);
adminRouter.delete('/users/:id', deleteUser);

adminRouter.get('/payments', getPayments);
adminRouter.get('/products', getProducts);
adminRouter.put('/products/verify', toggleProductVerification);
adminRouter.get('/dashboard', getDashboardData);

adminRouter.get('/creator/report', getCreatorReport);
adminRouter.get('/creator/:id', getCreatorDetails);
adminRouter.patch('/creator/:id/kyc', toggleCreatorKycStatus);
adminRouter.patch('/creator/:id/personal', updateCreatorPersonalDetails);
adminRouter.get('/creator/:creatorId/withdrawls', getCreatoreWithDrawls);
adminRouter.patch('/withdrawal/:withdrawalId/status', updateWithDrawlsStatus);

adminRouter.post('/admins', createAdmin);
adminRouter.get('/admins', getAdmins);
adminRouter.put('/admins/:id', updateAdmin);
adminRouter.delete('/admins/:id', deleteAdmin);
