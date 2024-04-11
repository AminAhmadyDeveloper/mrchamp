import { PASSWORD, URL, USER_NAME } from "../constants/env-constants";
import { RichRequest } from "../types/request-type";
import { NextFunction, Response } from "express";

export const login = async (request: RichRequest, _: Response, next: NextFunction) => {
  console.log("[browser] signing in");

  const page = await request.browser.newPage();
  await page.goto(URL, { timeout: 0 });

  const userNameInput = await page.waitForSelector("#username", { timeout: 0 });
  await userNameInput?.click();
  await userNameInput?.type(USER_NAME);

  const passwordInput = await page.waitForSelector("#password", { timeout: 0 });
  await passwordInput?.click();
  await passwordInput?.type(PASSWORD);

  const loginButton = await page.waitForSelector(".button.btn-type-1.login", { timeout: 0 });
  await loginButton?.click();

  request.pages.set("dashboard", page);

  console.log("[browser] signing in completed");

  next();
};
