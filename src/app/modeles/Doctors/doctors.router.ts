import express from 'express';
import { doctorsControllers } from './doctors.controller';
const router = express.Router();

// for taks parpous i made only fetch doctos and  nedded all functions like create, update,delete etc.

router.get('/', doctorsControllers.getAllDoctors);
router.get('/:id', doctorsControllers.getSingleDoctors);

export const doctorsRouter = router;
