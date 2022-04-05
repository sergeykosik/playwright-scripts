/**
 * Signs up the autoentry user.
 * After successful run the New user email displayed.
 * 
 * To Run: node signup
 */

const { chromium } = require('playwright');
const faker = require('faker');
const config = require('./config');

const baseUrl = config.baseUrl;
const pass = config.psw;
const stepperNextBtn = '//*[@id="brochure-wrapper"]/div[1]/div[3]/div[2]/button';
const stepperFinishBtn = '//*[@id="brochure-wrapper"]/div[1]/div[3]/div[2]/button[1]';
const manualCheckboxLabel = '//*[@id="brochure-wrapper"]/div[1]/div[3]/ae-blockable-div/div/div/ae-integrations-step/div/div[3]/div[2]/div[1]/label';


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
  await page.waitForSelector(stepperNextBtn);
  await page.click(stepperNextBtn);

  // Step 2
  await page.waitForSelector(manualCheckboxLabel);
  await page.check(manualCheckboxLabel);
  await page.waitForSelector(stepperFinishBtn);
  await page.click(stepperFinishBtn);

  // waiting for navbar "Help Center" button
  await page.waitForSelector('//*[@id="navbarCollapse"]/ul[2]/li[1]/a');

  console.log(`New user: ${email}`);

  await browser.close();
})();
