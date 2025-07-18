import mongoose, { Schema } from 'mongoose';
import { IScheduleAppointment } from '../interfaces/scheduleAppointment';

const ScheduleAppointment: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    barberUID: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, id: false, toJSON: { virtuals: true } }
);

ScheduleAppointment.virtual('barber', {
  ref: 'User',
  localField: 'barberUID',
  foreignField: 'uid',
  justOne: true,
});

ScheduleAppointment.virtual('client', {
  ref: 'User',
  localField: 'uid',
  foreignField: 'uid',
  justOne: true,
});

export default mongoose.model<IScheduleAppointment>('ScheduleAppointment', ScheduleAppointment);
