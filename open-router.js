const { chromium } = require('playwright');
const config = require('./config');
const { logIn } = require("./helpers");

const baseUrl = config.baseUrl;
const pass = config.psw;

const args = process.argv.slice(2);

const email = `sergey.kosik+${args[0]}@example.com`;

(async () => {

  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(`http://192.168.0.1/common_page/login.html`);

  await page.waitForSelector('text=Welcome Back');
  // await page.waitForTimeout(1000);

  await page.focus('#loginPassword');
  await page.type('#loginPassword', pass);
  await page.click('[name="id_common_login"]');

  await page.waitForSelector('#home_main_page');

  await page.click('text=Advanced settings');
  await page.waitForTimeout(3000);
  // await page.waitForSelector('text=Security');
  await page.click('#c_mu08');
  
  await page.click('text=Security');
  await page.waitForTimeout(3000);
  // await page.waitForSelector('text=MAC filtering');
  await page.click('#c_mu13');

  await page.waitForSelector('text=MAC filter list');

  await page.click('#ienable9');
  
  await page.waitForTimeout(2000);

  await browser.close();
  
})();
