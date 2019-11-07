import { NextFunction, Response, Request } from "express";

/**
 * errorController utility function
 * @param err error response
 * @param req request payload
 * @param res 
 * @param next 
 */
export const errorController = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
  next();
};
