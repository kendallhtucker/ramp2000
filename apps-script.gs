/**
 * Ramp2000 PS1 Giveaway — Google Apps Script Web App
 *
 * This script receives form submissions from ps1.html and appends them
 * to the Google Sheet. Anyone with the Web App URL can POST (no auth),
 * but they can only WRITE — they can't read the sheet.
 *
 * Setup instructions: see deployment notes below.
 */

var SPREADSHEET_ID = '1D31tG0y8E7JyYIeI4aHMdVVpkNkX79DV7sdcRbVAjyE';
var SHEET_NAME = 'Entries';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.company || '',
      data.role || '',
      data.size || '',
      data.source || '',
      data.userAgent || '',
      data.referrer || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET handler so you can sanity-check the URL in a browser
function doGet() {
  return ContentService
    .createTextOutput('Ramp2000 PS1 Giveaway endpoint is alive.')
    .setMimeType(ContentService.MimeType.TEXT);
}
