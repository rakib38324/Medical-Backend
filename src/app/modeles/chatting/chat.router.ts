import express from 'express';
import { chatControllers } from './chat.controller';
const router = express.Router();

// for taks parpous i made only fetch doctos and  nedded all functions like create, update,delete etc.

router.post('/create-chat', chatControllers.createChat);
router.post('/get-previous-chat', chatControllers.createChat);

export const chatrouter = router;
