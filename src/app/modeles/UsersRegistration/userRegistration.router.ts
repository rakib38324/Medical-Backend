import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
const router = express.Router();

router.post(
  '/user-registration',
  ValidateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUsers,
);

router.get('/', userControllers.getAllUsers);
router.get('/:id', userControllers.getSingleUser);

router.patch(
  '/update-user/:id',
  ValidateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUsers,
);

export const userRouter = router;
