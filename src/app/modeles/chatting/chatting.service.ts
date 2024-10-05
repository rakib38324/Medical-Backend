import { TChatting } from './chatting.interface';
import { Chatting } from './chatting.model';

const createChatFromDB = async (payload: TChatting) => {
  const chat = await Chatting.create(payload);
  return chat;
};

export const ChatServices = {
  createChatFromDB,
};
