/**
 * @deprecated This script is deprecated. Use create-contacts.js or manage-lists.js instead.
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
  await page.waitForNavigation({ url: `${baseUrl}/companies` });

  var numList = Array(count)
    .fill()
    .map((_, i) => i);

  var costCodeNums = Array(costCodeCount)
    .fill()
    .map((_, i) => i);


  //
  // Add suppliers
  //
  await page.goto(`${baseUrl}/companies/${companyId}/contactslist/suppliers`);
  await page.waitForTimeout(1000);

  for (let i of numList) {
    const code = faker.random.uuid();
    const desc = faker.company.companyName();
    await page.click("css=.supplier-add-button");
    await page.fill("#code", code);
    await page.fill("#desc", desc);
    await page.click('//*[@id="form_addCode"]/div[2]/button[1]');
  }

  //
  // Add contacts
  //
  await page.goto(`${baseUrl}/companies/${companyId}/contactslist/customers`);
  await page.waitForTimeout(1000);

  for (let i of numList) {
    const code = faker.random.uuid();
    const desc = faker.company.companyName();
    await page.click("css=.supplier-add-button");
    await page.fill("#code", code);
    await page.fill("#desc", desc);
    await page.click('//*[@id="form_addCode"]/div[2]/button[1]');
  }

  //
  // Add Nominal codes
  //
  await page.goto(`${baseUrl}/companies/${companyId}/lists/categories`);
  await page.waitForTimeout(1000);

  await page.click('//*[@id="grid-component"]/div[1]/div/div[2]/form/button');
  await page.click('//*[@id="modalApplyItems"]/div/div/div[3]/button[1]');
  await page.waitForTimeout(1000);

  //
  // Add Tax codes
  //
  await page.goto(`${baseUrl}/companies/${companyId}/lists/taxcodes`);
  await page.waitForTimeout(1000);

  await page.click('//*[@id="grid-component"]/div[1]/div/div[2]/form/button');
  await page.click('//*[@id="modalApplyItems"]/div/div/div[3]/button[1]');
  await page.waitForTimeout(1000);

  //
  // Add Cost codes
  //
  if (withCostCodes) {
    for (let c of costCodeNums) {
      await page.goto(`${baseUrl}/companies/${companyId}/lists/costcodes${c+1}`);
      await page.waitForTimeout(1000);
      const costCodeLabel = faker.random.word();
      await page.fill("#costCodeName", costCodeLabel);
      await page.click(
        '//*[@id="grid-component"]/div[1]/div/div[3]/form/button'
      );
      await page.waitForTimeout(500);

      for (let i of numList) {
        const code = faker.random.uuid();
        const desc = faker.random.word();

        await page.click(
          '//*[@id="grid-component"]/div[1]/div/div[1]/button[1]'
        );
        await page.fill("#code", code);
        await page.fill("#desc", desc);
        await page.click('//*[@id="form_addCode"]/div[2]/button[1]');
      }
    }
  }

  await browser.close();
})();
