import { Schema } from 'mongoose';

export type TDoctor = {
  name: string;
  specialist: string;
  like: string;
  experience: number;
  img: string;
  amount: number;
  appointments?: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Appointment';
    },
  ];
};
