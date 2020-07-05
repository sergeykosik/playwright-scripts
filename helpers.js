function auth(username, password, redirectUrl) {
  return `fetch({url:'/authenticate/credentials?format=json',data:{'UserName':'${username}','Password':'${password}','RememberMe': false},type:'POST',success: function(){window.location = '${redirectUrl}';}});`;
}

async function logIn(page, baseUrl, email, pass) {
  await page.goto(`${baseUrl}/login2`);
  await page.fill('#inputEmail', email);
  await page.click('css=.button.button-submit.w-button');
  await page.fill('#inputPassword', pass);
  await page.click('//*[@id="email-container"]/div/form/div[3]/input');
}

module.exports = {
  auth,
  logIn
};
