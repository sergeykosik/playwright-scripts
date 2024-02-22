function auth(username, password, redirectUrl) {
  return `$.ajax({url:'/authenticate/credentials',data:{'UserName':'${username}','Password':'${password}'},type:'POST',success:()=>{}});`;
}

async function logIn(page, baseUrl, email, pass) {
  await page.goto(`${baseUrl}/login2`);
  await page.fill("#inputEmail", email);
  await page.click("#loginPage_next_button");
  await page.fill("#inputPassword", pass);
  await page.click('#loginPage_logIn_button');
}

function getLineItemElmId(cols, label, idx) {
  return `LI-${idx}-${cols[label]}-1`;
}

function generateBasicAuth(username, password) {
  // Combine username and password with a colon (:)
  const credentials = username + ":" + password;

  // Base64 encode the credentials
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  // Create the Basic Authentication header
  const basicAuthHeader = 'Basic ' + encodedCredentials;

  return basicAuthHeader;
}

module.exports = {
  auth,
  logIn,
  getLineItemElmId,
  generateBasicAuth
};
