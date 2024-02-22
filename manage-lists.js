/**
 * The script populates the nominal / tax code / suppliers
 *
 * To Run: node manage-lists email@example.com 43 true
 *
 * to omit the cost codes generation, then don't pass 'true'
 */

const { chromium } = require("playwright");
const faker = require("faker");
const config = require("./config");
const { logIn } = require("./helpers");

const args = process.argv.slice(2);

const baseUrl = config.baseUrl;
const pass = config.psw;
const email = args[0];
const companyId = args[1];
const withCostCodes = args.length > 2 ? args[2] === "true" : false;
const count = 3;
const costCodeCount = 2;

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  logIn(page, baseUrl, email, pass);
  await page.waitForURL(`${baseUrl}/companies`);

  var numList = Array(count)
    .fill()
    .map((_, i) => i);
    
  var costCodeNums = Array(costCodeCount)
    .fill()
    .map((_, i) => i);

  //
  // Add Nominal codes
  //
  await page.goto(`${baseUrl}/lists/${companyId}/categories`);

  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Yes, Apply' }).click();
  await page.waitForTimeout(1000);

  //
  // Add Tax codes
  //
  await page.goto(`${baseUrl}/lists/${companyId}/taxcodes`);

  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Yes, Apply' }).click();
  await page.waitForTimeout(1000);

  //
  // Add Mileage rates
  //
  await page.goto(`${baseUrl}/lists/${companyId}/mileagerates`);

  for (let i of numList) {
    const name = `Rate-${faker.random.word()}`;
    const amount = ((i+1) * 0.1) + '';

    await page.locator('#addButton').click();
    await page.locator("#RateName").click();
    await page.locator("#RateName").fill(name);
    await page.locator("#Rate").click();
    await page.locator("#Rate").fill(amount);
    await page.locator("#Rate").press('Tab');
    await page.getByRole('button', { name: 'Add a Mileage Rate' }).click();
    await page.waitForTimeout(1000);

    if (i === 0) {
        await page.getByLabel('Close').click();
        await page.waitForTimeout(1000);   
    }
  }

  //
  // Add Cost codes
  //
  if (withCostCodes) {
    for (let c of costCodeNums) {
      await page.goto(`${baseUrl}/lists/${companyId}/costcodes${c+1}`);
      await page.waitForTimeout(1000);
      const costCodeLabel = faker.random.word();
      await page.locator('#manage-list-action-bar').getByRole('textbox').click();
      await page.locator('#manage-list-action-bar').getByRole('textbox').fill(costCodeLabel);
      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(500);

      for (let i of numList) {
        const code = faker.random.uuid();
        const desc = faker.random.word();

        await page.getByRole('button', { name: 'Add a Tracking Category' }).click();
        await page.fill("#Code", code);
        await page.fill("#Description", desc);
        await page.getByRole('button', { name: 'Add a Tracking Category' }).click();
        await page.waitForTimeout(1000);
      }
    }
  }

  await browser.close();
})();
