import express from 'express';
import { isUserAuthenticated } from '../../middlewares/authentication.middleware';
import { createResponse } from '../../../config/responses';
import { authenticationRoute } from './authentication.route';
import { barbersRoute } from './barbers.route';
import { usersRoute } from './users.route';

const router = express.Router();

router.get('/status', (req, res) => createResponse(res, { status: 'OK' }));

router.use('/auth', authenticationRoute);
router.use('/barbers', isUserAuthenticated, barbersRoute);
router.use('/users', isUserAuthenticated, usersRoute);

export { router };
