import { ElementHandle, Page } from "puppeteer";

export const openInNewTab = async (page: Page, target: ElementHandle<Element>) => {
  await page.keyboard.down("Control");
  await target?.click();
  await page.keyboard.up("Control");
};
