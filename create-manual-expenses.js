const { chromium } = require('playwright');
const { logIn } = require("./helpers");
const config = require('./config');
const faker = require('faker');

/**
 * Creates manual expenses provided companany id.
 * 
 * To Run: node create-manual-expenses email@example.com 12
 * 
 */

const baseUrl = config.baseUrl;
const pass = config.psw;

const args = process.argv.slice(2);

const email = args[0];
const companyId = +args[1];
const numOfExpenses = 10;

(async () => {

  const browser = await chromium.launch({
    headless: false,
    // slowMo: 50
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  logIn(page, baseUrl, email, pass);
  await page.waitForURL(`${baseUrl}/companies`);

  for(let i = 0; i < numOfExpenses; i++) {

    await page.goto(`${baseUrl}/expenses/${companyId}/createmanual`);

    await page.frameLocator('#koIframe').getByLabel('Vendor').fill(`Supplier ${faker.random.number(10)}`);
    await page.frameLocator('#koIframe').getByLabel('Description').fill(`Some Description ${faker.random.alphaNumeric(5)}`);
    await page.frameLocator('#koIframe').getByLabel('Total').fill(faker.random.number(100) + '');
    await page.frameLocator('#koIframe').getByRole('button', { name: ' Save' }).click();

    await page.waitForTimeout(300);

  }

  await browser.close();
})();
