import express from 'express';
import Auth from '../../middlewares/Auth';
import { ourclinicControllers } from './ourClinic.controller';
const router = express.Router();

// for taks parpous i made only fetch clinic and nedded all functions like create, update,delete etc.

router.get('/', Auth(), ourclinicControllers.getAllOurClinic);

export const ourClinicRouter = router;
