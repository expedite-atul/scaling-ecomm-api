import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { router } from './routes/routes';
import { errorController as globalErrorHandler } from './controllers/errorController';
export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

/**
 * morgan logger as a 3rd party middleware
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logging only while
}

const limiter = rateLimit({
  max: 10,
  windowMs: 36000, //100 request from a single ip
  message: `please try after sometime you exceeded rate limit`
});
/**
 * custom middle ware
 */
app.use('/api', limiter);

app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  next(); // to continue the req res cycle
});

/**
 * custom router middleware
 */
app.use('/api/v1/ecommerce', router);

app.all('*', (req, res, next) => {
  next(new Error(`can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);
