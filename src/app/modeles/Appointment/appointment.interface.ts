import { Schema } from 'mongoose';

export type TypeAppointment = {
  doctorId: {
    type: Schema.Types.ObjectId;
    ref: 'Doctor';
  };
  userId: {
    type: Schema.Types.ObjectId;
    ref: 'User';
  };
  paymentId: string;
};
