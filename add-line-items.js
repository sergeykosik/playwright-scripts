/**
 * The script adds line items for the provided invoice id
 *
 * To Run: node add-line-items <user-email> <itemCount> <invoiceId> <workflowId>
 * 
 * e.g.: add-line-items email@example.com 50 41 9
 *
 */

const faker = require("faker");
const config = require("./config");
const { httpReq } = require("./helpers");

const args = process.argv.slice(2);

const baseUrl = config.baseUrl;
const pass = config.psw;
const email = args[0];
const itemCount = +args[1];
const invoiceId = args[2];
const workflowId = args[3];

var numList = Array(itemCount)
  .fill()
  .map((_, i) => i);

let lineItems = [];

for (let i of numList) {
  const guid = faker.random.uuid().replace(/-/g, "");
  const units = faker.random.number(10);
  const price = faker.random.number(100);
  const net = units * price;
  const desc = faker.commerce.productName();

  lineItems.push(addLineItem(guid, desc, units, price, net));
}

const data = {
  Code: "Supplier3",
  InvoiceId: invoiceId,
  IsShowArchived: null,
  IsShowErrors: true,
  LineItemDetails: lineItems,
  WorkflowId: workflowId,
};

httpReq(email, pass, 'PUT',`${baseUrl}/invoices/codeswithrefresh?format=json`, data, (res) => {
    console.log('updated invoice');
});


//////////////////////////////////////////////////////////////

function addLineItem(guid, details, units, price, net) {
    return {
        Guid: guid,
        IsRemembered: false,
        Units: {
            Value: units, 
            OcrValue: null
        },
        Price: {
            Value: price, 
            OcrValue: null
        },
        TotalCalculated: net,
        Total: {
            Value: null, 
            OcrValue: null
        },
        NetCalculated: {
            Value: net, 
            OcrValue: null
        },
        Net: {
            Value: null, 
            OcrValue: null
        },
        NominalCode: '',
        BillableCustomer: '',
        IsBillable: true, 
        IsProductCode: false,
        IsTaxCodeSuggested: false,
        Tax: {
            Value: 0, 
            OcrValue: null
        },
        Rate: null, 
        TaxCalculatedFromRateChosen: 0,
        TaxRateChosen: 0,
        TaxCode: 'T0', 
        CostCode: { 'CostCodeValue1': '', 'CostCodeValue2': '', CostCodeValue3: ''},
        Details: details, 
        IsCarriage: false, 
        RateCalculated: 0, 
        TaxDifference: 0
    };
}
