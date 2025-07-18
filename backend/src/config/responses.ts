import { Response } from 'express';

const createResponse = (res: Response, message: any, code: number = 200) => {
  if (code >= 200 && code <= 299) {
    return res.status(code).send({ success: true, message: message });
  } else {
    return res.status(code).send({ success: false, message: message });
  }
};

export { createResponse };
