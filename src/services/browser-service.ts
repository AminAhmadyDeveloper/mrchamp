import { NextFunction, Request, Response } from "express";
import puppeteer, { Page } from "puppeteer";
import { PageNames, RichRequest } from "../types/request-type";

export const browser = async (request: RichRequest, _: Response, next: NextFunction) => {
  console.log(`[browser] opening browser`);

  const browser = await puppeteer.launch({ headless: true, product: "chrome", timeout: 0 });
  const pages = new Map<PageNames, Page>();

  request.browser = browser;
  request.pages = pages;

  console.log(`[browser] opened browser`);

  next();
};
