import { model, Schema } from 'mongoose';
import { TChatting } from './chatting.interface';

const ChattingSchemma = new Schema<TChatting>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Chatting = model<TChatting>('Chatting', ChattingSchemma);
