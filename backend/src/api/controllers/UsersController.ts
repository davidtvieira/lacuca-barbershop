import { Request, Response } from 'express';
import { createResponse } from '../../config/responses';
import { validateUserEdit, validateUserUID } from '../validations/user.validation';
import { UsersServices } from '../services/UsersServices';
import { ApplicationError } from '../../config/ApplicationErrorsClass';
import { validateGetAppointmentRequestForSelf } from '../validations/schedule.validation';

const userServices = new UsersServices();

export class UsersController {
  async getByUUID(req: Request, res: Response) {
    const { error, value } = validateUserUID(req.params);
    if (error) return createResponse(res, error.message, 400);

    const result = await userServices.getUserInformation({
      requestingUser: res.locals.user,
      requestedUUID: value.uid,
    });
    if (result instanceof ApplicationError) {
      return createResponse(res, result.errorMessage, result.errorHttpCode);
    }

    return createResponse(res, result);
  }

  async updateUserInformation(req: Request, res: Response) {
    const { error, value } = validateUserEdit(req.body);
    if (error) return createResponse(res, error.message, 400);

    const result = await userServices.updateUserInformation({
      user: res.locals.user,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
    });
    if (result instanceof ApplicationError) {
      return createResponse(res, result.errorMessage, result.errorHttpCode);
    }

    return createResponse(res, 'Informações atualizadas com sucesso.');
  }

  async getActiveScheduledAppointments(req: Request, res: Response) {
    const result = await userServices.getUserActiveScheduledAppointments(res.locals.user);
    return createResponse(res, result);
  }

  async getScheduledAppointments(req: Request, res: Response) {
    const { error, value } = validateGetAppointmentRequestForSelf(req.params);
    if (error) return createResponse(res, error.message, 400);

    const result = await userServices.getUserScheduledAppointments(res.locals.user, value.date);
    return createResponse(res, result);
  }
}
