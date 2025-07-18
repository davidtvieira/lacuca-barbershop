import Joi from 'joi';

export function validateAuthorizationHeader(data: any) {
  const schema = Joi.object({
    authorization: Joi.string().required().min(50),
  }).unknown();
  return schema.validate(data);
}
