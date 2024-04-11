import { Page } from "puppeteer";
import { openInNewTab } from "./click-utils";

export const selectMenu = async (page: Page, menuNumber: number) => {
  const selector = `body > div:nth-child(3) > div > div.content > div.menu > div:nth-child(${menuNumber})`;
  const menu = await page.waitForSelector(selector, { timeout: 0 });
  await menu?.click();
  return menu;
};

export const selectSubMenu = async (page: Page, menuNumber: number, subMenuNumber: number) => {
  const menu = await selectMenu(page, menuNumber);
  const selector = `#pnl > li:nth-child(${subMenuNumber}) > a`;
  const subMenu = await menu.waitForSelector(selector, { timeout: 0 });
  await openInNewTab(page, subMenu);
  return subMenu;
};

export const selectAction = async (page: Page, actionNumber: number) => {
  const action = await page?.waitForSelector("#tr_2 > td:nth-child(4) > div > a");
  await action?.click();

  const target = await page?.waitForSelector(`#tr_2 > td:nth-child(4) > div > ul > li:nth-child(${actionNumber}) > a`);
  await openInNewTab(page, target);
};
