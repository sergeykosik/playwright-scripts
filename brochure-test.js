const { chromium } = require('playwright');
const config = require('./config');

const baseUrl = 'https://autoentry-karl.webflow.io';

const args = process.argv.slice(2);
const token = args[0] || '12323';

const email = `sergey.kosik+${token}@example.com`;
const signupBtn = '//*[@id="registration-form"]/div[3]/div/input';

(async () => {

  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}`);

  // click on Accounts & Bookkeeper link (in header)
  await page.click('//html/body/div[4]/div/nav/div/a[2]');


  // click on Try for Free button
  await page.click('css=.cc-btn.cc-dismiss');
  await page.click('//html/body/div[5]/section[1]/div/div/div[2]/div[2]/div[1]/div/a');

  
  // Fill the sign up form
  page.on('request', request => console.log('>>', request.url()));


  await page.fill('#firstname', 'Sergey');
  await page.fill('#lastname', 'Kosik');
  await page.fill('#email', email);
  await page.fill('#firm', 'Sergey Company Test 234');
  await page.selectOption('select#location', 'Ireland');
  await page.click(signupBtn);

  // check request:
  // https://data.autoentry.com/userleads/add

  await page.waitForNavigation({ url: `${baseUrl}/try-for-free/call-or-trial`});

  // Click on Start a trial
  await page.click('//*[@id="start-trial"]');

  // Check navigation to 
  // https://data.autoentry.com/signup?Lead=39f71446-0cf8-ce2f-a489-642185be03c2
  // await browser.close();
  
})();
