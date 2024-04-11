import { RichRequest } from "../types/request-type";
import { NextFunction, Response } from "express";
import { selectAction } from "../utils/menu-utils";
import { waitForPage } from "../utils/wait-utils";

export enum SearchType {
  TITLE = "1",
  TAGS = "2",
  NUMBER = "1",
}

export const edit = (searchType: SearchType) => {
  return async (request: RichRequest<{ post: string }>, _: Response, next: NextFunction) => {
    const { post } = request.body;

    console.log("[browser] loading edit page");

    const posts = request.pages.get("posts");

    const searchInput = await posts?.waitForSelector("body > div.comments > form > input.rb_input.input_200");
    await searchInput?.click();
    await searchInput?.type(post);

    const searchSelect = await posts?.waitForSelector("body > div.comments > form > select");
    await searchSelect?.click();
    if (searchType === SearchType.NUMBER) {
      await posts?.keyboard.down("ArrowDown");
      await posts?.keyboard.down("ArrowDown");
      await posts?.keyboard.down("Enter");
    } else if (searchType === SearchType.TAGS) {
      await posts?.keyboard.down("ArrowDown");
      await posts?.keyboard.down("Enter");
    }

    const searchButton = await posts?.waitForSelector("body > div.comments > form > input.btn.primary");
    await searchButton?.click();

    await selectAction(posts, 1);

    posts.close();

    await waitForPage(async () => {
      const edit = (await request.browser.pages()).at(1);
      request.pages.set("posts", undefined);
      request.pages.set("edit", edit);

      console.log("[browser] loading edit page completed");
      next();
    });
  };
};
