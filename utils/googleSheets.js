const { google } = require('googleapis');

const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY || '';
const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const sheetName = process.env.GOOGLE_SHEET_NAME || 'Signups';

async function logSignupToGoogleSheets(event, member, status) {
  if (!clientEmail || !privateKey || !spreadsheetId) {
    return;
  }

  try {
    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
      [
        member.email,
        member.first_name || '',
        member.last_name || '',
        event.title,
        event.start_time ? new Date(event.start_time).toISOString() : '',
        event.location || '',
        status,
        event.description || '',
        new Date().toISOString(),
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:I`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    console.log(`Successfully logged signup for ${member.email} to Google Sheet.`);
  } catch (err) {
    console.error('Error logging signup to Google Sheets:', err.message || err);
  }
}

module.exports = {
  logSignupToGoogleSheets,
};
