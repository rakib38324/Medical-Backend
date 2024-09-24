import express from 'express';
import { doctorsControllers } from './doctors.controller';
import Auth from '../../middlewares/Auth';
const router = express.Router();

// for taks parpous i made only fetch doctos and  nedded all functions like create, update,delete etc.

router.get('/', Auth(), doctorsControllers.getAllDoctors);

export const doctorsRouter = router;
