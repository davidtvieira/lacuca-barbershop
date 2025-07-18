import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { router as routes } from '../api/routes/v1';

const app = express();

//@ts-ignore
app.use(helmet());

app.use(cors());

//@ts-ignore
app.use(morgan(process.env.LOGS_ENV));

//@ts-ignore
app.use(express.urlencoded({ extended: true }));
//@ts-ignore
app.use(express.json());

app.use(mongoSanitize());

app.use('/v1', routes);

app.get('*', function (req: Request, res: Response) {
  res.status(404).send({ success: false, message: 'Rota inválida.' });
});

app.post('*', function (req: Request, res: Response) {
  res.status(404).send({ success: false, message: 'Rota inválida.' });
});

app.put('*', function (req: Request, res: Response) {
  res.status(404).send({ success: false, message: 'Rota inválida.' });
});

app.delete('*', function (req: Request, res: Response) {
  res.status(404).send({ success: false, message: 'Rota inválida.' });
});

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  if (process.env.LOGS_ENV === 'dev') {
    console.log('[DEV] ERROR:\n', error);
  }

  if (error instanceof SyntaxError) {
    return res.status(400).send({ success: false, message: 'Os dados fornecidos são inválidos.' });
  } else if (error instanceof TypeError) {
    return res.status(400).send({ success: false, message: 'Os dados fornecidos são de um tipo inválido.' });
  }

  return res.status(500).send({
    success: false,
    message: 'Algo correu mal. Por favor contacte o suporte e indique os passos que tomou até chegar aqui.',
  });
});

export default app;
