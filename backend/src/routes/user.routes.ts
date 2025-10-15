import { Router, Request, Response } from 'express';
import { getPublicKey } from '../services/crypto.service';

const router = Router();

router.get('/public-key', (_req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey();

    res.status(200).json({
      success: true,
      data: {
        publicKey,
        algorithm: 'ECDSA',
        curve: 'secp384r1',
        hash: 'SHA-384',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve public key',
    });
  }
});

export default router;