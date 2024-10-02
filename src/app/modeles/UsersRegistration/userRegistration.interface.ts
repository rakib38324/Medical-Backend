/* eslint-disable no-unused-vars */
import { Model, Schema } from 'mongoose';

export type TUser = {
  [x: string]: any;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  passwordChangedAt?: Date;
  appointments?: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Appointment';
    },
  ];
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isUserExistsByUserName(username: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hasPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
