import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { ChatServices } from './chatting.service';

const createChat = catchAsync(async (req, res) => {
  const result = await ChatServices.createChatFromDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat created',
    data: result,
  });
});

export const chatControllers = {
  createChat,
};
