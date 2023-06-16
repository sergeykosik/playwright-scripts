const http = require("http");
const { performance } = require("perf_hooks");
const { generateBasicAuth } = require("./helpers");
const config = require('./config');

const startNum = 57;
const numOfIterations = 5;

const basicAuthHeader = generateBasicAuth(config.adminEmail, config.adminPass);

function performPostRequest(num) {
  return new Promise((resolve, reject) => {
    const postData = buildPostData(num);
    const options = {
      hostname: "localhost-docurec.com",
      port: 80,
      path: "/generatetestdata/users",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: basicAuthHeader,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        resolve(responseBody);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

function buildPostData(emailToken) {
    const firstName = 'Sergey';
    const lastName = 'Kosik';
    const email = `sergey.kosik+${emailToken}@ocrex.com`;
    const pass = config.psw;
    const countries = 'IE,GB,US,CA,AU,IT,AT,BR,CL,CN,HR,CY,DK,EG,EE,FR,GE,DE,HK,HU,IN,IQ,IL,JP,LV,LT,LU,MX,MN,NZ,NO,PK,RO,QA,SA,SG,SK,ZA,ES,SE,AF,AL,DZ,AS';
    const postData = `FirstName=${firstName}&LastName=${lastName}&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(pass)}&Countries=${encodeURIComponent(countries)}&MultipleOrganisations=true`;
    return postData;
}

async function performSequentialRequests() {
  const start = performance.now();

  for (let i = startNum; i < startNum + numOfIterations; i++) {
    try {
      console.log(`Iteration ${i} started...`);
      const response = await performPostRequest(i);
      console.log(response);
    } catch (error) {
      console.error(error);
      break;
    }
  }

  const end = performance.now();
  const totalTime = end - start;
  const totalTimeInMinutes = totalTime / 60000; // Convert ms to minutes
  console.log(`Total Requests: ${numOfIterations} | Total time: ${totalTimeInMinutes} minutes`);
}

performSequentialRequests();
