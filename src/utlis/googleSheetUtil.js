const {google } = require('googleapis');
const keys = require('../constants/keys.json');


const client = new google.auth.JWT(
  keys.client_email, 
  null, 
  keys.private_key, 
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
  if(err) {
    // console.info('error');
  } else {
    // console.info('connected !');
  };
});


async function addNewRecord(record) {
  const gsApi = google.sheets({version: 'v4', auth: client})
  const insertOpt = {
    spreadsheetId: process.env.NODE_ENV === 'test' ? process.env.SHEET_TOKEN_TEST : process.env.SHEET_TOKEN,
    range: 'A2',
    valueInputOption: 'USER_ENTERED',
    resource: {values: record}
  };

  let res = await gsApi.spreadsheets.values.append(insertOpt);

  return res.statusText;
}


module.exports = { addNewRecord };