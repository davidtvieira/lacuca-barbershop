import Joi from 'joi';

export function validateUser(data: any) {
  const schema = Joi.object({
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().min(6).max(60),
    firstName: Joi.string().required().min(2).max(40).trim(),
    lastName: Joi.string().required().min(2).max(40).trim(),
    phoneNumber: Joi.number().positive().min(900000000).max(999999999).required(),
  });
  return schema.validate(data);
}

export function validateUserEdit(data: any) {
  const schema = Joi.object({
    firstName: Joi.string().required().min(2).max(40).trim(),
    lastName: Joi.string().required().min(2).max(40).trim(),
    phoneNumber: Joi.number().positive().min(900000000).max(999999999).required(),
  });
  return schema.validate(data);
}

export function validateUserUID(data: any) {
  const schema = Joi.object({
    uid: Joi.string().required().min(10).max(40),
  });
  return schema.validate(data);
}
