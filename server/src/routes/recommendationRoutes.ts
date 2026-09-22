import { Router } from 'express';
import { analyzeRecommendation, saveRecommendation } from '../controllers/recommendationController.js';

const router = Router();

router.post('/analyze', analyzeRecommendation);
router.post('/', saveRecommendation);

export default router;
