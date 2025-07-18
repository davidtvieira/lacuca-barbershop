import mongoose, { Schema } from 'mongoose';
import { IScheduleUnavailability } from '../interfaces/scheduleUnavailability.interface';

const ScheduleUnavailability: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IScheduleUnavailability>('ScheduleUnavailability', ScheduleUnavailability);
