import { Router } from 'express';
import { submitKyc, getKycStatus } from './kyc.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { kycSchema } from './kyc.schema';

const router = Router();

router.post('/submit', authMiddleware, validate(kycSchema), submitKyc);
router.get('/status', authMiddleware, getKycStatus);

export default router;
