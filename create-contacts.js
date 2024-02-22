/**
 * The script populates the nominal / tax code / suppliers
 *
 * To Run: node create-contacts email@example.com 43 true
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
const count = 3;

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

  //
  // Add suppliers
  //
  await page.goto(`${baseUrl}/companies/${companyId}/contacts/suppliers`);

  for (let i of numList) {
    const code = faker.random.uuid();
    const desc = faker.company.companyName();

    await page.frameLocator('#koIframe').getByRole('button', { name: 'Add Suppliers' }).click();
    await page.frameLocator('#koIframe').locator("#code").fill(code);
    await page.frameLocator('#koIframe').locator("#desc").fill(desc);
    await page.frameLocator('#koIframe').locator('#form_addCode').getByText('Add Supplier').click();
  }

  //
  // Add contacts
  //
  await page.goto(`${baseUrl}/companies/${companyId}/contacts/customers`);

  for (let i of numList) {
    const code = faker.random.uuid();
    const desc = faker.company.companyName();
    await page.frameLocator('#koIframe').getByRole('button', { name: 'Add Customers' }).click();
    await page.frameLocator('#koIframe').locator("#code").fill(code);
    await page.frameLocator('#koIframe').locator("#desc").fill(desc);
    await page.frameLocator('#koIframe').locator('#form_addCode').getByText('Add Customer').click();
  }

  await page.waitForTimeout(1000);

  await browser.close();
})();
