import { IUser } from '../interfaces/user.interface';
import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    isBarber: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    weeklySchedule: [
      {
        _id: false,
        from: {
          type: Number,
          default: 9,
        },
        to: {
          type: Number,
          default: 18,
        },
        breaks: [
          {
            type: Number,
            required: true,
          },
        ],
        available: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, id: false }
);

export default mongoose.model<IUser>('User', UserSchema);
