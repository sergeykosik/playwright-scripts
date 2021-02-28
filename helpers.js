const request = require('request');

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

function httpReq(username, password, method, url, content, callback) {
    const options = {
      method: method,
      url : url,
      headers : {
          'Authorization' : 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(content)    
    };

    return request(options, function (error, response) {
      if (error) throw new Error(error);

      if(callback) callback(response.body);
    });
}

module.exports = {
  auth,
  logIn,
  getLineItemElmId,
  httpReq
};
