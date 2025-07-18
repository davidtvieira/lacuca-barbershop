import { Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber: number;
  isBarber: boolean;
  isAdmin: boolean;
  weeklySchedule: IWeeklySchedule[];
}

export interface IWeeklySchedule {
  from: number;
  to: number;
  breaks: number[];
  available: boolean;
}

export enum WeekDay {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}
