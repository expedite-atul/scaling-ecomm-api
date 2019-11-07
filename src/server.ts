import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { MONGODB_URI } from './utils/secrets';
dotenv.config();

import { app } from './app';
mongoose.Promise = bluebird;

mongoose.connect(MONGODB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(
    () => {
      console.log(`MongoDB Connected`);
    },
  ).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    process.exit();
  });
mongoose.set('debug', true);
const port = process.env.PORT || 3000;

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

app.listen(port, () =>
  console.log(
    `server is running on --> http://localhost:${port}/api/v1/ecommerce`
  )
);
