const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  baseUrl: `${process.env.BASE_URL}`,
  psw: `${process.env.PSW}`,
  xeroUsr: `${process.env.XERO_USR}`,
  xeroPsw: `${process.env.XERO_PSW}`
};