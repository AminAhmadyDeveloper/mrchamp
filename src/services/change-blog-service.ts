import { RichRequest } from "../types/request-type";
import { NextFunction, Response } from "express";
import { waitForPage } from "../utils/wait-utils";
import { selectSubMenu } from "../utils/menu-utils";

export const blog = (blogId: number) => async (request: RichRequest, _: Response, next: NextFunction) => {
  console.log("[browser] changing blog");

  const dashboard = request.pages.get("dashboard");
  await selectSubMenu(dashboard, 1, 5);
  await dashboard.close();

  await waitForPage(async () => {
    const blog = (await request.browser.pages()).at(1);
    const url = blog?.url();

    await blog?.goto(`${url}/?change_accont=${blogId}`);

    request.pages.set("dashboard", blog);

    console.log("[browser] changing blog completed");

    next();
  });
};
