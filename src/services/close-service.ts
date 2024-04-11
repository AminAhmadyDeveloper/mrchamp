import { NextFunction, Response } from "express";
import { RichRequest } from "../types/request-type";

export const close = async (request: RichRequest, response: Response) => {
  const browser = request.browser;
  const pages = request.pages;

  for (const [key, value] of pages) {
    if (value) {
      console.log(`[browser] closing page ${key}`);
      if (value && !value.isClosed()) value.close();
      console.log(`[browser] closing page ${key}`);
    }
  }

  if (browser) browser.close();

  response.status(201).json({
    message: "successful",
  });

  console.log(`[browser] closed browser`);
};
