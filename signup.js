const { chromium } = require('playwright');
const faker = require('faker/locale/de');
const config = require('./config');

/**
 * Signs up the autoentry user.
 * After successful run the New user email displayed.
 * 
 * To Run: node signup
 */

const baseUrl = config.baseUrl;
const pass = config.psw;
const stepperNextBtn = '//*[@id="wrapper"]/div/div[1]/div[2]/div/div[3]/div/button';

(async () => {

  const browser = await chromium.launch({
    headless: false,
    // slowMo: 50
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}/signup`);

  const unique = faker.internet.password(5, false, /[0-9A-Z]/);
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const companyName = `${firstName} Company ${unique}`;
  const email = `sergey.kosik+${unique}@ocrex.com`;
  // console.log('faker', unique, firstName, lastName, companyName, email);

  await page.fill('#inputFirstName', firstName);
  await page.fill('#inputLastName', lastName);
  await page.fill('#inputCompany', companyName);
  await page.click('css=.button.button-submit.w-button');

  await page.fill('#inputEmail', email);
  await page.fill('#inputPassword', pass);
  await page.click('//html/body/ae-root/ae-public-layout/div[2]/div/div[1]/div/div/div/div/div[2]/div/ae-signup/div[2]/form[2]/div[5]/input');

  // Step 1
  await page.waitForSelector('"Welcome to AutoEntry!"');
  await page.waitForSelector(stepperNextBtn);
  await page.click(stepperNextBtn);

  // Step 2
  // wait for back btn in the company details step
  await page.waitForSelector('//*[@id="wrapper"]/div/div[1]/div[2]/div/div[1]/div/button');
  await page.click(stepperNextBtn);

  // Step 3
  await page.click('css=.btn.btn-link.skip-link');

  await page.waitForNavigation({ url: `${baseUrl}/companies`});

  console.log(`New user: ${email}`);

  await browser.close();
})();
