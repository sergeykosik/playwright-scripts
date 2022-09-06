function auth(username, password, redirectUrl) {
  return `$.ajax({url:'/authenticate/credentials',data:{'UserName':'${username}','Password':'${password}'},type:'POST',success:()=>{}});`
}

async function logIn(page, baseUrl, email, pass) {
  await page.goto(`${baseUrl}/login2`);
  await page.fill('#inputEmail', email);
  await page.click('css=.button.button-submit.w-button');
  await page.fill('#inputPassword', pass);
  await page.click('//*[@id="email-container"]/div/form/div[3]/input');
}

function getLineItemElmId(cols, label, idx) {
  return `LI-${idx}-${cols[label]}-1`;
}

module.exports = {
  auth,
  logIn,
  getLineItemElmId
};
