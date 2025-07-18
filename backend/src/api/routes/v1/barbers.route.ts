import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { createResponse } from '../../../config/responses';
import { asyncHandler } from '../../handlers/async.handler';
import { IScheduleUnavailability } from '../../interfaces/scheduleUnavailability.interface';
import { IUser, IWeeklySchedule } from '../../interfaces/user.interface';
import userModel from '../../schemas/user.schema';
import scheduleUnavailabilityModel from '../../schemas/scheduleUnavailability.schema';
import scheduleAppointmentModel from '../../schemas/scheduleAppointment';
import {
  validateAppointment,
  validateGetAppointmentRequestForBarber,
  validateSchedule,
  validateScheduleUnavailability,
} from '../../validations/schedule.validation';
import { endOfDay, endOfMonth, getDate, getDay, getHours, set, startOfDay, startOfMonth } from 'date-fns';
import { validateUserUID } from '../../validations/user.validation';

const barbersRoute = express.Router();

barbersRoute.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const barbers = await userModel.find({ isBarber: true }, 'firstName lastName uid -_id');
    return createResponse(res, barbers);
  })
);

barbersRoute.put(
  '/schedule/weekly',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateSchedule(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;
    if (!user.isBarber) return createResponse(res, 'Este recurso só pode ser utilizado por barbeiros.', 401);

    const schedule: IWeeklySchedule[] = value;
    user.weeklySchedule = schedule;
    await user.save();

    return createResponse(res, 'O seu horário foi atualizado com sucesso.');
  })
);

barbersRoute.post(
  '/schedule/unavailable',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateScheduleUnavailability(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;
    if (!user.isBarber) return createResponse(res, 'Este recurso só pode ser utilizado por barbeiros.', 401);

    const scheduleUnavailability: IScheduleUnavailability = value;

    const fromStartOfDay = startOfDay(scheduleUnavailability.from);
    const toEndOfDay = endOfDay(scheduleUnavailability.to);

    const duplicateScheduleUnavailability = await scheduleUnavailabilityModel.findOne({
      uid: user.uid,
      $or: [
        {
          $and: [{ from: { $gte: fromStartOfDay } }, { from: { $lte: toEndOfDay } }],
        },
        { from: { $lte: fromStartOfDay }, to: { $gte: fromStartOfDay } },
      ],
    });
    if (duplicateScheduleUnavailability)
      return createResponse(res, 'Existe um conflito entre as datas fornecidas e um registo anterior.', 409);

    await new scheduleUnavailabilityModel({
      uid: user.uid,
      from: fromStartOfDay,
      to: toEndOfDay,
    }).save();

    return createResponse(res, 'O seu período de indisponibilidade foi adicionado com sucesso.');
  })
);

barbersRoute.delete(
  '/schedule/unavailable',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateScheduleUnavailability(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;
    if (!user.isBarber) return createResponse(res, 'Este recurso só pode ser utilizado por barbeiros.', 401);

    const scheduleUnavailability: IScheduleUnavailability = value;

    const fromStartOfDay = startOfDay(scheduleUnavailability.from);
    const toEndOfDay = endOfDay(scheduleUnavailability.to);

    const unavailabilityFound = await scheduleUnavailabilityModel.findOne({
      uid: user.uid,
      from: fromStartOfDay,
      to: toEndOfDay,
    });
    if (!unavailabilityFound)
      return createResponse(res, 'Não existe um período de indisponibilidade associado às datas fornecidas.', 404);

    await unavailabilityFound.delete();

    return createResponse(res, 'O seu período de indisponibilidade foi eliminado com sucesso.');
  })
);

barbersRoute.get(
  '/schedule/unavailable/:uid',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateUserUID(req.params);
    if (error) return createResponse(res, error.message, 400);

    const requestedBarberFound: IUser = await userModel.findOne({ uid: value.uid, isBarber: true }, 'uid');
    if (!requestedBarberFound)
      return createResponse(res, 'O identificador fornecido não está associado a um barbeiro.', 400);

    const unavailablePeriods = await scheduleUnavailabilityModel.find(
      { uid: requestedBarberFound.uid },
      'from to -_id'
    );

    return createResponse(res, unavailablePeriods);
  })
);

barbersRoute.put(
  '/schedule/appointment',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateAppointment(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;

    const requestedBarberFound: IUser = await userModel.findOne(
      { uid: value.uid, isBarber: true },
      'uid weeklySchedule firstName'
    );
    if (!requestedBarberFound)
      return createResponse(res, 'O identificador fornecido não está associado a um barbeiro.', 400);

    const dayOfWeek = getDay(value.date);
    const dayOfWeekSchedule = requestedBarberFound.weeklySchedule[dayOfWeek];

    if (!dayOfWeekSchedule.available)
      return createResponse(res, 'De momento o barbeiro não está a aceitar novos agendamentos para esta data.', 400);

    const hoursFromDate = getHours(value.date);
    if (
      !(
        hoursFromDate >= dayOfWeekSchedule.from &&
        hoursFromDate <= dayOfWeekSchedule.to &&
        !dayOfWeekSchedule.breaks.includes(hoursFromDate)
      )
    )
      return createResponse(res, 'Existe um conflito entre a data fornecida e o horário do barbeiro.', 400);

    const fromStartOfDay = startOfDay(value.date);
    const toEndOfDay = endOfDay(value.date);
    const unavailablePeriodsConflit = await scheduleUnavailabilityModel.findOne({
      uid: requestedBarberFound.uid,
      $or: [
        {
          $and: [{ from: { $gte: fromStartOfDay } }, { from: { $lte: toEndOfDay } }],
        },
        { from: { $lte: fromStartOfDay }, to: { $gte: fromStartOfDay } },
      ],
    });

    if (unavailablePeriodsConflit)
      return createResponse(res, 'De momento o barbeiro não está a aceitar novos agendamentos para esta data.', 400);

    const formattedAppointmentDate = set(value.date, { minutes: 0, seconds: 0, milliseconds: 0 });
    const appointmentFound = await scheduleAppointmentModel.findOne({
      barberUID: requestedBarberFound.uid,
      date: formattedAppointmentDate,
    });
    if (appointmentFound)
      return createResponse(res, 'Já existe um agendamento associado ao barbeiro na mesma data.', 409);

    // intentionally let barbers schedule with themselves so they can create appointments for clients
    // description property is only used by barbers
    await new scheduleAppointmentModel({
      barberUID: requestedBarberFound.uid,
      uid: user.uid,
      date: formattedAppointmentDate,
      description: user.isBarber ? value.description : undefined,
    }).save();

    return createResponse(res, `Agendamento com ${requestedBarberFound.firstName} efetuado com sucesso.`);
  })
);

barbersRoute.delete(
  '/schedule/appointment',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateAppointment(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;

    const requestedBarberFound: IUser = await userModel.findOne({ uid: value.uid, isBarber: true }, 'uid');
    if (!requestedBarberFound)
      return createResponse(res, 'O identificador fornecido não está associado a um barbeiro.', 400);

    const formattedAppointmentDate = set(value.date, { minutes: 0, seconds: 0, milliseconds: 0 });
    const scheduledAppointmentFound = await scheduleAppointmentModel.findOne({
      uid: user.uid,
      barberUID: requestedBarberFound.uid,
      date: formattedAppointmentDate,
    });
    if (!scheduledAppointmentFound) return createResponse(res, 'Não existe nenhum agendamento para essa data.', 404);

    await scheduledAppointmentFound.delete();

    return createResponse(res, 'Agendamento cancelado com sucesso.');
  })
);

barbersRoute.delete(
  '/schedule/appointment/force',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateAppointment(req.body);
    if (error) return createResponse(res, error.message, 400);

    const user: IUser = res.locals.user;
    if (!user.isBarber) return createResponse(res, 'Este recurso só pode ser utilizado por barbeiros.', 401);

    const formattedAppointmentDate = set(value.date, { minutes: 0, seconds: 0, milliseconds: 0 });
    const scheduledAppointmentFound = await scheduleAppointmentModel.findOne({
      uid: value.uid,
      barberUID: user.uid,
      date: formattedAppointmentDate,
    });
    if (!scheduledAppointmentFound) return createResponse(res, 'Não existe nenhum agendamento para essa data.', 404);

    await scheduledAppointmentFound.delete();

    return createResponse(res, 'Agendamento cancelado com sucesso (forçado).');
  })
);

barbersRoute.get(
  '/appointments/:uid/:date',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateGetAppointmentRequestForBarber(req.params);
    if (error) return createResponse(res, error.message, 400);

    const requestedBarberFound: IUser = await userModel.findOne({ uid: value.uid, isBarber: true }, 'uid');
    if (!requestedBarberFound)
      return createResponse(res, 'O identificador fornecido não está associado a um barbeiro.', 400);

    const user: IUser = res.locals.user;
    let projection = 'barberUID date -_id';
    let populateProjection = '';

    if (user.isBarber) {
      projection += ' uid description';
      populateProjection = 'firstName lastName phoneNumber -uid -_id';
    }

    const fromStartOfMonth = startOfMonth(value.date);
    const toEndOfMonth = endOfMonth(value.date);

    const scheduledAppointments = await scheduleAppointmentModel
      .find({ barberUID: requestedBarberFound.uid, date: { $gte: fromStartOfMonth, $lte: toEndOfMonth } }, projection)
      .populate('client', populateProjection);

    return createResponse(res, scheduledAppointments);
  })
);

export { barbersRoute };
