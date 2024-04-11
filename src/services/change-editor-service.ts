import { NextFunction, Response } from "express";
import { PageNames, Recourses, RichRequest } from "../types/request-type";
import { waitForPage } from "../utils/wait-utils";
import { openInNewTab } from "../utils/click-utils";

type RequestBody = { amount: number; type: Recourses };

export const changeEditor = (editor: "6" | "7", key: PageNames) => {
  return async (request: RichRequest<RequestBody>, _: Response, next: NextFunction) => {
    console.log(`[browser] changing editor to ${editor}`);

    const dashboard = request.pages.get(key);

    await dashboard.goto("https://www.rozblog.com/usercp.php");

    await waitForPage(async () => {
      const settingLink = await dashboard.waitForSelector("#tbi > center > table > tbody > tr > td:nth-child(1) > a");
      await openInNewTab(dashboard, settingLink);

      await dashboard.close();

      await waitForPage(async () => {
        const settings = (await request.browser.pages()).at(1);

        const selectBox = await settings?.waitForSelector("#editor", { timeout: 0 });
        await selectBox.select(editor);

        const selectButton = await settings?.waitForSelector(
          "body > form > div > div:nth-child(1) > div.col_75 > input"
        );
        await selectButton.click();

        console.log(`[browser] changing editor to ${editor} completed`);

        await settings?.goto("https://www.rozblog.com/usercp.php");

        request.pages.set("dashboard", settings);

        next();
      });
    });
  };
};
