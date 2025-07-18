import { NextFunction, Request, Response } from 'express';
import { createResponse } from '../../config/responses';
import userSchema from '../schemas/user.schema';
import { getUserFromIdToken } from '../services/firebase';
import { validateAuthorizationHeader } from '../validations/authorizationHeader.validation';

export async function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { error, value } = validateAuthorizationHeader(req.headers);
  if (error) return createResponse(res, error.message, 400);

  const { user, error: errorGettingUser } = await getUserFromIdToken(value.authorization);
  if (errorGettingUser) return createResponse(res, errorGettingUser, 401);

  if (!user.email_verified) return createResponse(res, 'Antes de prosseguir deve verificar o seu email.', 403);

  const userRecord = await userSchema.findOne({ uid: user.uid });
  if (!userRecord) return createResponse(res, 'Existe um problema com a sua conta. Por favor contacte o suporte.', 401);

  res.locals.user = userRecord;

  next();
}
