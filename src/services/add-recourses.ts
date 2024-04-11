import { NextFunction, Response } from "express";
import { NotFound } from "http-errors";
import { decode } from "he";
import { Recourses, RichRequest } from "../types/request-type";
import { waitForPage } from "../utils/wait-utils";

type RequestBody = { amount: number; post: string; type: Recourses };

export const addRecourses = async (request: RichRequest<RequestBody>, _: Response, next: NextFunction) => {
  const { amount, type, post } = request.body;

  const regexPattern = `<span id="${type}">(\\d+)<\\/span>`;
  const regex = new RegExp(regexPattern);

  console.log(`[browser] adding ${amount} ${type} to ${post}`);

  const edit = request.pages.get("edit");

  const area = await edit?.waitForSelector("#mtex", { timeout: 0 });
  await area?.click();

  const getText = async () => document.querySelector("#mtex").innerHTML;
  const htmlString = await edit.evaluate(getText);
  const decodedHtml = decode(htmlString);

  const match = decodedHtml.match(regex);

  if (match && match[1]) {
    const coins = parseInt(match[1]);

    console.log(`[browser] number of ${type}: ${coins}`);

    const newAmount = coins + amount;

    const old = `<span id="${type}">${coins}</span>`;
    const replacement = `<span id="${type}">${newAmount}</span>`;

    const modifiedHtmlString = decodedHtml.replace(old, replacement);

    await waitForPage(async () => {
      const modify = async (modifiedHtmlString: string) => {
        const text = document.querySelector("#mtex");
        text.innerHTML = modifiedHtmlString;
      };
      await edit.evaluate(modify, modifiedHtmlString);

      const buttonSubmit = await edit?.waitForSelector(
        "#npform > div > div.tab-content > div:nth-child(6) > div > input.btn.primary"
      );
      await buttonSubmit?.click();
    });
  } else {
    next(NotFound(`${type} balance not found`));
  }

  console.log(`[browser] adding ${amount} ${type} completed to ${post}`);

  next();
};
