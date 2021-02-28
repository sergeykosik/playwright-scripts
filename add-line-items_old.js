/**
 * The script populates the nominal / tax code / suppliers
 *
 * To Run: node add-line-items <user-email> <itemCount> <relative url>
 * 
 * e.g.: add-line-items email@example.com 10 '/companies/13/purchases/inbox/116?pageIndex=3&pageSize=50&showArchived=false&workflowId=49&totalcount=119'
 *
 */

const { chromium } = require("playwright");
const faker = require("faker");
const config = require("./config");
const { logIn, getLineItemElmId } = require("./helpers");

const args = process.argv.slice(2);

const baseUrl = config.baseUrl;
const pass = config.psw;
const email = args[0];
const itemCount = +args[1];
const url = args[2];

const addBtnId = '//*[@id="lineitems"]/tfoot/tr/td/button';
const wait = 400; // in ms - if network is slow might need to encrease.

(async () => {
  const browser = await chromium.launch({
    headless: false    
  });
  const context = await browser.newContext({
    viewport: {
        width: 1884, // document.documentElement.clientWidth,
        height: 958// document.documentElement.clientHeight
      }
  });
  const page = await context.newPage();

  logIn(page, baseUrl, email, pass);
  await page.waitForNavigation({ url: `${baseUrl}/companies` });

  var numList = Array(itemCount)
    .fill()
    .map((_, i) => i);


  //
  // Add Line Items
  //
  await page.goto(`${baseUrl}${url}`);
  await page.waitForTimeout(1000);

  // await page.click("#addNewLineItemBtn");

  const tableHeaderCols = await page.evaluate(async () => {
    const theadRow = document.getElementById('lineitems').getElementsByTagName('thead')[0].rows[0];
    const tableHeader = {};
    for (let i = 0, col; col = theadRow.cells[i]; i++) {
        tableHeader[col.innerText] = i;
    }
    return tableHeader;
  });

  console.log('tableHeaderCols', tableHeaderCols);

  for (let i of numList) {

    await page.click(addBtnId);
    await page.waitForTimeout(wait);

    let unitsId = getLineItemElmId(tableHeaderCols, 'Units', i);
    let priceId = getLineItemElmId(tableHeaderCols, 'Price', i);
    let descId = getLineItemElmId(tableHeaderCols, 'Description', i);
    
    const units = faker.random.number(10) + '';
    const price = faker.random.number(100) + '';
    const desc = faker.commerce.productName();

    await page.fill(`#${unitsId}`, units);
    await page.focus(`#${priceId}`);
    await page.waitForTimeout(wait);
    
    await page.fill(`#${priceId}`, price);
    await page.focus(`#${descId}`);
    await page.waitForTimeout(wait);

    await page.fill(`#${descId}`, desc);
    await page.focus(`#${unitsId}`);
    await page.waitForTimeout(wait);
  }

  await page.focus(addBtnId);
  await page.click(addBtnId);
  await page.waitForTimeout(wait);

  await browser.close();
})();
