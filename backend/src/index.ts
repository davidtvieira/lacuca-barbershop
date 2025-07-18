require('dotenv').config();
const db = require('./config/mongoose');
import app from './config/express';

async function main() {
  await db.connect();

  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT} (${process.env.NODE_ENV} environment)`)
    );
  }
}

main();

export default app;
