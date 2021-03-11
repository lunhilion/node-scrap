const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded

// parse application/json
var jsonParser = bodyParser.json();

app.post("/scrap", jsonParser, async (request, response) => {
  try {
    const username = await request.body.username;
    const password = await request.body.password;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    });
    
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(
      "https://i.360.cn/login/?src=pcw_home&destUrl=https://www.360.cn/"
    );
    await page.$eval("input[name=userName]", (el, value) => el.value = value, username);
    await page.$eval("input[name=password]", (el, value) => el.value = value, password);
    await page.click('input[type="submit"]');
    await page.waitForNavigation();
    
    const elemText = await page.$eval("#userinfo > div > p > a:nth-child(2)", elem => elem.innerText)

    const cookies = await page.cookies();
    response.json(elemText);
    await browser.close();
  } catch (error) {
    response.json(error);
  }
});

app.post("/prova", jsonParser, (req, res) => {
  res.json(req.body.password);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
