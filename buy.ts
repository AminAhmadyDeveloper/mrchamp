import "dotenv/config";

// Import puppeteer
import puppeteer from "puppeteer";
import express from "express";
import ncp from "copy-paste";

const buy = async (
  postNumber: string,
  added: string,
  type: "gems" | "coins"
) => {
  console.log("adding " + added + " " + type + " " + "to user " + postNumber);
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true,
    product: "chrome",
  });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto("https://www.rozblog.com/");

  // Query for an element handle.
  const userName = await page.waitForSelector("#username");
  await userName?.click();
  await userName?.type(process.env.USER_NAME);

  const password = await page.waitForSelector("#password");
  await password?.click();
  await password?.type(process.env.PASSWORD);

  const login = await page.waitForSelector(".button.btn-type-1.login");
  await login?.click();

  const listOfBlogs = await page.waitForSelector("#pnl > li:nth-child(5) > a");
  await page.keyboard.down("Control");
  await listOfBlogs?.click();
  await page.keyboard.up("Control");

  await page.close();

  const settingPageHandle = async () => {
    const settings = (await browser.pages()).at(2);

    const selectBox = await settings?.waitForSelector("#editor");
    await selectBox.select("6");

    const selectButton = await settings?.waitForSelector(
      "body > form > div > div:nth-child(1) > div.col_75 > input"
    );
    await selectButton.click();

    settings?.close();
  };

  const editPageHandle = async () => {
    const edit = (await browser.pages()).at(1);

    const area = await edit?.waitForSelector("#mtex");
    await area?.click();

    await edit?.keyboard.down("Control");
    await edit?.keyboard.press("A");
    await edit?.keyboard.up("Control");

    await edit?.keyboard.down("Control");
    await edit?.keyboard.press("C");
    await edit?.keyboard.up("Control");

    const ready = ncp.paste();
    const recept = await success(ready, added, type);
    const load = async (recept: string) => {
      const text = document.querySelector("#mtex");
      text.innerHTML = recept;
    };
    await edit.evaluate(load, recept);

    const buttonSubmit = await edit?.waitForSelector(
      "#npform > div > div.tab-content > div:nth-child(6) > div > input.btn.primary"
    );
    await buttonSubmit?.click();

    setTimeout(async () => {
      const linkToSettings = await edit.waitForSelector("#post_form > div > a");
      await linkToSettings.click();

      const selectBox = await edit?.waitForSelector("#editor");
      await selectBox.select("7");

      const selectButton = await edit?.waitForSelector(
        "body > form > div > div:nth-child(1) > div.col_75 > input"
      );
      await selectButton.click();

      setTimeout(async () => {
        console.log(
          "done adding " + added + " " + type + " " + "to user " + postNumber
        );
        await edit.close();
        await browser.close();
      }, 1000);
    }, 1000);
  };

  const postsPageHandle = async () => {
    const posts = (await browser.pages()).at(1);
    const input = await posts?.waitForSelector(
      "body > div.comments > form > input.rb_input.input_200"
    );
    await input?.click();
    await input?.type(postNumber);

    const select = await posts?.waitForSelector(
      "body > div.comments > form > select"
    );
    await select?.click();
    await posts?.keyboard.down("ArrowDown");
    await posts?.keyboard.down("ArrowDown");
    await posts?.keyboard.down("Enter");

    const search = await posts?.waitForSelector(
      "body > div.comments > form > input.btn.primary"
    );
    await search?.click();

    const action = await posts?.waitForSelector(
      "#tr_2 > td:nth-child(4) > div > a"
    );
    await action?.click();
    const edit = await posts?.waitForSelector(
      "#tr_2 > td:nth-child(4) > div > ul > li:nth-child(1) > a"
    );
    await posts?.keyboard.down("Control");
    await edit?.click();
    await posts?.keyboard.up("Control");

    await posts?.close();

    setTimeout(editPageHandle, 1500);
  };

  const champPageHandle = async () => {
    const champ = (await browser.pages()).at(1);
    await champ?.goto(`${champ?.url()}/?change_accont=765746`);

    setTimeout(async () => {
      const settings = await champ?.waitForSelector(
        "#tbi > center > table > tbody > tr > td:nth-child(1) > a"
      );
      await champ?.keyboard.down("Control");
      await settings?.click();
      await champ?.keyboard.up("Control");
      setTimeout(settingPageHandle, 1500);
      setTimeout(async () => {
        const postsSection = await champ?.waitForSelector(
          "body > div:nth-child(3) > div > div.content > div.menu > div:nth-child(2)"
        );
        await postsSection?.click();

        const allPosts = await postsSection?.waitForSelector(
          "#pnl > li:nth-child(3) > a"
        );

        await champ?.keyboard.down("Control");
        await allPosts?.click();
        await champ?.keyboard.up("Control");

        await champ?.close();
        setTimeout(postsPageHandle, 3500);
      }, 3500);
    }, 1500);
  };

  setTimeout(champPageHandle, 1500);
};

async function success(value: string, added: string, type: "gems" | "coins") {
  let newBody = value;

  if (value) {
    if (type === "coins") {
      const coins = value
        .split(
          '<img src="https://rozup.ir/view/3461274/1855154.png" width="17" height="17" alt="">'
        )[1]
        ?.split("سکه در بانک هستید")[0];
      newBody = value.replace(
        `${coins.trim()} سکه`,
        `${Number(added) + Number(coins.trim())} سکه`
      );
      return newBody;
    }

    if (type === "gems") {
      const gems = value
        .split(
          '<img src="https://rozup.ir/view/3461273/4085915.png" width="17" height="17" alt="">'
        )[1]
        ?.split("عدد یاقوت در جعبه خود دارید")[0];
      newBody = value.replace(
        `${gems.trim()} عدد یاقوت`,
        `${Number(added) + Number(gems.trim())} عدد یاقوت`
      );
      return newBody;
    }
  }
}

const app = express();

app.post("/buy", async (req, res) => {
  const { post, amount, type } = req.query;
  await buy(post as string, amount as string, type as "gems" | "coins");
  res.status(201).json({
    message: "خرید انجام شد!",
  });
});

app.listen(process.env.PORT, () => console.log("listening"));
