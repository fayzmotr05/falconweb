# Google Sheets Contact Form Setup

This guide will help you connect the contact form to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Falcon Team Contacts" (or any name you prefer)
4. In the first row, add these headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Company`
   - F1: `Message`
   - G1: `Source`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Paste the following code:

```javascript
// Google Apps Script for Falcon Team Contact Form

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Create a new row with the form data
    const row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.message || '',
      data.source || 'Website'
    ];

    // Append the row to the sheet
    sheet.appendRow(row);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Falcon Team Contact Form API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify setup
function testScript() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        message: 'This is a test message',
        source: 'Test'
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click **Save** (Ctrl+S or Cmd+S)
5. Name the project "Falcon Contact Form"

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Falcon Team Contact Form v1"
   - **Execute as**: "Me (your email)"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts
   - If you see "Google hasn't verified this app", click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
6. **COPY THE WEB APP URL** - You'll need this for the website!

The URL will look like:
```
https://script.google.com/macros/s/AKfycbx...../exec
```

## Step 4: Update the Website

1. Open `src/components/sections/CTASection/index.tsx`
2. Find line 18:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your actual Web App URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec'
   ```

## Step 5: Test the Form

1. Deploy your website changes
2. Fill out the contact form
3. Check your Google Sheet - a new row should appear!

## Troubleshooting

### Form submits but no data appears
- Make sure you deployed the script as a Web App
- Verify "Who has access" is set to "Anyone"
- Check that you copied the correct URL (ends with `/exec`)

### "Authorization required" error
- Go back to Apps Script and re-authorize the app
- Make sure you're logged into the correct Google account

### CORS errors in browser console
- The form uses `mode: 'no-cors'` which is intentional
- The data should still be saved even if you see CORS warnings

### Data appearing in wrong columns
- Check that your spreadsheet headers match the order in the script
- The order should be: Timestamp, Name, Email, Phone, Company, Message, Source

## Security Notes

- The Web App URL is public - anyone with the URL can submit data
- Consider adding rate limiting if spam becomes an issue
- Never share your Apps Script edit URL (only share the deployed `/exec` URL)

## Optional: Email Notifications

Add this function to the Apps Script to receive email notifications:

```javascript
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com';
  const subject = 'New Contact Form Submission - Falcon Team';
  const body = `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Message: ${data.message}

Submitted at: ${data.timestamp}
  `;

  MailApp.sendEmail(recipient, subject, body);
}
```

Then add this line inside the `doPost` function, after `sheet.appendRow(row);`:
```javascript
sendEmailNotification(data);
```
