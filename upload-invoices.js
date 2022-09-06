const { chromium } = require('playwright');
const { logIn } = require("./helpers");
const config = require('./config');

/**
 * Uploads two sample files into the first company's purchases folder.
 * 
 * To Run: node upload-invoices email@example.com
 * 
 */

const baseUrl = config.baseUrl;
const pass = config.psw;

const args = process.argv.slice(2);
// console.log('args', args);

const email = args[0];

/* process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  }); */

(async () => {

  const browser = await chromium.launch({
    headless: false,
    // slowMo: 50
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  logIn(page, baseUrl, email, pass);
  
  await page.waitForNavigation({ url: `${baseUrl}/companies`});

  await page.click('//*[@id="container"]/ae-company-list/p-table/div/div[2]/div/div[2]/table/tbody/tr/td[2]/a');
  await page.click('//*[@id="container"]/ae-company-folders/div/div[2]/div[1]/div[1]/a');

  await page.waitForSelector('css=.uppy-u-reset.uppy-Dashboard-browse');

  await page.setInputFiles('css=.uppy-Dashboard-input', ['invoices/invoice1.pdf','invoices/invoice2.pdf']);

  await page.waitForSelector('css=.uppy-StatusBar.is-complete');

  await page.screenshot({ path: 'screenshots/uploaded.png', fullPage: true });

  await browser.close();
})();
