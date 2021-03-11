const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded

// parse application/json
var jsonParser = bodyParser.json();

app.post("/scrap", jsonParser, async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(
      "https://i.360.cn/login/?src=pcw_home&destUrl=https://www.360.cn/"
    );
    await page.$eval(
      "input[name=userName]",
      el => (el.value = request.body.username)
    );
    await page.$eval(
      "input[name=password]",
      el => (el.value = request.body.password)
    );
    await page.click('input[type="submit"]');

    const cookies = await page.cookies();
    response.json(cookies);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
});

app.post("/prova", jsonParser, (req, res) => {
  res.json(req.body.password);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
