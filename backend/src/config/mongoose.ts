const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connection.on('error', (err: any) => {
  console.log(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (process.env.NODE_ENV === 'dev') {
  mongoose.set('debug', true);
}

exports.connect = () => {
  mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log('MongoDB connected...'));
  return mongoose.connection;
};
