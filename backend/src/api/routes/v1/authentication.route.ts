import * as express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { createResponse } from '../../../config/responses';
import { asyncHandler } from '../../handlers/async.handler';
import { createAccount } from '../../services/firebase';
import { validateUser } from '../../validations/user.validation';

const authenticationRoute = express.Router();

authenticationRoute.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = validateUser(req.body);
    if (error) return createResponse(res, error.message, 400);

    const { uid, error: errorCreatingAccount } = await createAccount(
      value.email,
      value.password,
      value.firstName,
      value.lastName,
      value.phoneNumber
    );
    if (errorCreatingAccount) return createResponse(res, errorCreatingAccount, 400);

    return createResponse(res, uid);
  })
);

export { authenticationRoute };
