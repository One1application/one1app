// Replace empty file with health-check route
import express from 'express';
const router = express.Router();

// Simple health-check
router.get('/health-check', (req, res) => {
  res.status(200).json({ message: 'Bot Server Up' });
});

export default router;