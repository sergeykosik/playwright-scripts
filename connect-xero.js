const { chromium } = require('playwright');
const config = require('./config');
const { logIn } = require("./helpers");

const baseUrl = config.baseUrl;
const pass = config.psw;

const args = process.argv.slice(2);

const email = `sergey.kosik+${args[0]}@ocrex.com`;

(async () => {

  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  logIn(page, baseUrl, email, pass);
  
  await page.waitForNavigation({ url: `${baseUrl}/companies`});

  await page.click('//*[@id="container"]/ae-company-list/p-table/div/div[2]/div/div[2]/table/tbody/tr/td[2]/a');
  await page.click('//*[@id="container"]/ae-company-folders/div/div[2]/div[1]/div[1]/a');

  await page.waitForSelector('css=.uppy-u-reset.uppy-Dashboard-browse');

  await browser.close();
  
})();