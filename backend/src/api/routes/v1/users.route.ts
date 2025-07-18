import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { asyncHandler } from '../../handlers/async.handler';
import { UsersController } from '../../controllers/UsersController';

const usersRoute = express.Router();
const usersController = new UsersController();

usersRoute.get(
  '/profile/:uid',
  asyncHandler(async (req: Request, res: Response) => {
    usersController.getByUUID(req, res);
  })
);

usersRoute.put(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    usersController.updateUserInformation(req, res);
  })
);

usersRoute.get(
  '/appointments',
  asyncHandler(async (req: Request, res: Response) => {
    usersController.getActiveScheduledAppointments(req, res);
  })
);

usersRoute.get(
  '/appointments/:date',
  asyncHandler(async (req: Request, res: Response) => {
    usersController.getScheduledAppointments(req, res);
  })
);

export { usersRoute };
