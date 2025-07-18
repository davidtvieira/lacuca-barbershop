import { addMonths, endOfDay, subDays } from 'date-fns';
import Joi from 'joi';

export function validateSchedule(data: any) {
  const schema = Joi.array()
    .items(
      Joi.object({
        from: Joi.number().min(1).max(24).required(),
        to: Joi.number().min(1).max(24).required(),
        breaks: Joi.array().items(Joi.number().required()).required().max(24),
        available: Joi.boolean().required(),
      }).required()
    )
    .required()
    .length(7);
  return schema.validate(data);
}

export function validateScheduleUnavailability(data: any) {
  const minDate = endOfDay(subDays(new Date(), 1));

  const schema = Joi.object({
    from: Joi.date().iso().greater(minDate).required().messages({
      'date.greater': 'A data introduzida já não é válida.',
      'date.format': 'A data introduzida é inválida.',
    }),
    to: Joi.date()
      .iso()
      .greater(Joi.ref('from', { adjust: (from) => subDays(from, 1) }))
      .required()
      .messages({
        'date.greater': 'A data introduzida já não é válida.',
        'date.format': 'A data introduzida é inválida.',
      }),
  }).required();

  return schema.validate(data);
}

export function validateAppointment(data: any) {
  const schema = Joi.object({
    date: Joi.date().iso().greater(new Date()).less(addMonths(new Date(), 5)).required().messages({
      'date.greater': 'A data introduzida já não é válida.',
      'date.less': 'A data introduzida é inválida.',
      'date.format': 'A data introduzida é inválida.',
    }),
    uid: Joi.string().required().min(10).max(40),
    description: Joi.string().max(150),
  }).required();
  return schema.validate(data);
}

export function validateGetAppointmentRequestForSelf(data: any) {
  const schema = Joi.object({
    date: Joi.date().iso().greater(new Date('2022-01-31')).less(addMonths(new Date(), 5)).required().messages({
      'date.greater': 'A data introduzida é inválida.',
      'date.less': 'A data introduzida é inválida.',
      'date.format': 'A data introduzida é inválida.',
    }),
  }).required();
  return schema.validate(data);
}

export function validateGetAppointmentRequestForBarber(data: any) {
  const schema = Joi.object({
    date: Joi.date().iso().greater(new Date('2022-01-31')).less(addMonths(new Date(), 5)).required().messages({
      'date.greater': 'A data introduzida é inválida.',
      'date.less': 'A data introduzida é inválida.',
      'date.format': 'A data introduzida é inválida.',
    }),
    uid: Joi.string().required().min(10).max(40),
  }).required();
  return schema.validate(data);
}
