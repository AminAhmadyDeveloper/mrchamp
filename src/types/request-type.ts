import { Request } from "express";
import { Browser, Page } from "puppeteer";

export type PageNames = "dashboard" | "posts" | "edit";
export type Recourses = "coins" | "gems" | "vip";

export interface RichRequest<GBody = any> extends Request {
  browser: Browser;
  pages: Map<PageNames, Page | undefined>;
  body: GBody;
}
