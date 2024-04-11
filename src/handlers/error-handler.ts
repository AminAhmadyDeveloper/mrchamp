import { NextFunction, Request, Response } from "express";
import { HttpError, NotFound } from "http-errors";

export const errorHandler = (
  error: HttpError,
  _: Request,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  if (!error) {
    return next(NotFound);
  }

  response.status(error.status).json(error);
};
