import { Router } from 'express';
import { getPredictions, getLatestPrediction } from '../controllers/predictionController.js';

const router = Router();

router.get('/latest', getLatestPrediction);
router.get('/', getPredictions);

export default router;
