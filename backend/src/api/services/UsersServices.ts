import { endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import endOfDay from 'date-fns/endOfDay';
import { ApplicationError } from '../../config/ApplicationErrorsClass';
import { IScheduleAppointment } from '../interfaces/scheduleAppointment';
import { IUser } from '../interfaces/user.interface';
import scheduleAppointmentModel from '../schemas/scheduleAppointment';
import userModel from '../schemas/user.schema';

type GetUserInformationRequest = {
  requestingUser: IUser;
  requestedUUID: string;
};

type UpdateUserInformationRequest = {
  user: IUser;
  firstName: string;
  lastName: string;
  phoneNumber: number;
};

export class UsersServices {
  async getUserInformation({
    requestingUser,
    requestedUUID,
  }: GetUserInformationRequest): Promise<IUser | ApplicationError> {
    let projection = 'firstName lastName weeklySchedule isBarber -_id';

    if (requestingUser.isBarber || requestingUser.isAdmin) projection += ' phoneNumber';

    const userInformation = await userModel.findOne({ uid: requestedUUID }, projection);
    if (!userInformation) return new ApplicationError('Utilizador não encontrado.', 404);

    if (
      requestingUser.uid != requestedUUID &&
      !userInformation.isBarber &&
      !requestingUser.isBarber &&
      !requestingUser.isAdmin
    )
      return new ApplicationError('Permissões insuficientes.', 401);

    return userInformation;
  }

  async updateUserInformation({
    user,
    firstName,
    lastName,
    phoneNumber,
  }: UpdateUserInformationRequest): Promise<boolean | ApplicationError> {
    if (user.phoneNumber !== phoneNumber) {
      const phoneNumberAlreadyUsed = await userModel.findOne({ phoneNumber: phoneNumber });
      if (phoneNumberAlreadyUsed)
        return new ApplicationError('O número de telemóvel fornecido já se encontra associado a outra conta.', 400);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    await user.save();

    return true;
  }

  async getUserActiveScheduledAppointments(user: IUser): Promise<IScheduleAppointment[]> {
    const userScheduledAppointments = await scheduleAppointmentModel
      .find({ uid: user.uid, date: { $gte: new Date() } }, 'uid barberUID date -_id')
      .populate('barber', 'firstName lastName -uid -_id');
    return userScheduledAppointments;
  }

  async getUserScheduledAppointments(user: IUser, date: Date): Promise<IScheduleAppointment[]> {
    const fromStartOfMonth = startOfMonth(date);
    const toEndOfMonth = endOfMonth(date);

    const userScheduledAppointments = await scheduleAppointmentModel
      .find({ uid: user.uid, date: { $gte: fromStartOfMonth, $lte: toEndOfMonth } }, 'uid barberUID date -_id')
      .populate('barber', 'firstName lastName -uid -_id');
    return userScheduledAppointments;
  }
}
