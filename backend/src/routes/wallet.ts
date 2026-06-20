import express, { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// Get or create wallet
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const wallet = await WalletService.getWallet(req.userId!);
    res.json(wallet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance
router.get('/balance', async (req: AuthRequest, res: Response) => {
  try {
    const balance = await WalletService.getBalance(req.userId!);
    res.json(balance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
