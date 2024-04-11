import { RichRequest } from "../types/request-type";
import { NextFunction, Response } from "express";
import { selectSubMenu } from "../utils/menu-utils";
import { waitForPage } from "../utils/wait-utils";

export const posts = async (request: RichRequest, _: Response, next: NextFunction) => {
  console.log("[browser] loading posts page");
  
  const dashboard = request.pages.get("dashboard");

  await selectSubMenu(dashboard, 2, 3);
  await dashboard.close();

  await waitForPage(async () => {
    const page = (await request.browser.pages()).at(1);
    request.pages.set("dashboard", undefined);
    request.pages.set("posts", page);

    console.log("[browser] loading posts page completed");
    next();
  });
};
