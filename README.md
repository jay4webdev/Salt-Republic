# Salt Republic — Private Yacht Charter (Maldives)

A production-quality booking platform for Salt Republic: a cinematic marketing
site (Home · Book Now · Thank You) plus a protected admin dashboard with full
CRUD, authentication, PostgreSQL persistence, email notifications and a Google
Sheets integration.

## Run

```bash
npm install
npx drizzle-kit push        # create database tables
node scripts/seed.mjs       # realistic demo data (idempotent)
node scripts/make-pdfs.mjs  # placeholder package PDFs (optional)
npm run dev
```

### Demo access

- Admin dashboard: **/login**
- Email: `admin@saltrepublic.mv`
- Password: `saltrepublic`

## Public website

- Home — cinematic hero, trip types slider, Malé Atoll, group trips ("Coming
  Soon"), full Finch 65 specification & gallery, onboard activities/equipment,
  food menu modal (ESC / backdrop / zoom), testimonials, WhatsApp community
  capture, final CTA.
- Book — validated **booking request** form (not instant confirmation).
  Enforces 17 day / 10 overnight guest limits and blocks past dates.
- Thank You — booking summary (Booking ID `SR-YYYY-0000`) plus two PDF package
  downloads. **No pricing exists anywhere on the website** — only the official
  package PDFs.

## Admin dashboard (`/dashboard`, authenticated)

Overview · Bookings (status workflow, notes, delete) · Trip Types CRUD ·
Activities & Equipment CRUD · Testimonials (approve/publish) · WhatsApp
Community (CSV export, delete) · Yacht Profile (specifications) · Settings.

## Enquiry delivery — email + Google Sheets

Every booking request is delivered to **saltrepublic.mv@gmail.com** and appended
to **Google Sheets** as one row, and is always stored in the dashboard so an
enquiry can never be lost. Set your team address under
**Dashboard → Settings → Enquiry Recipient**.

Delivery is switched on by environment variables. The app auto-detects which
provider you have configured, and the Settings page shows live connection
status with **Send test email** / **Send test row** buttons.

### Option 1 — Gmail (fastest, no code)

1. On the Google account, enable 2-Step Verification, then create an
   **App Password** (Google Account → Security → App passwords).
2. Add to `.env`:

```bash
GMAIL_USER=saltrepublic.mv@gmail.com
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
SMTP_FROM="Salt Republic <saltrepublic.mv@gmail.com>"
```

### Option 2 — Any SMTP provider (Zoho, Hostinger, Brevo, Mailgun…)

```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM="Salt Republic <saltrepublic.mv@gmail.com>"
```

### Option 3 — Resend API (best for high volume)

```bash
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM="Salt Republic <bookings@yourdomain.com>"
```

### Google Sheets — Apps Script webhook (recommended)

1. Create a Google Sheet, then **Extensions → Apps Script**.
2. Paste the script below and **Deploy → New deployment → Web app**, execute as
   *Me*, access *Anyone*.
3. Add the deployment URL to `.env`:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

```js
function doPost(e) {
  const row = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Booking ID", "Submission Date/Time", "Name", "WhatsApp Number",
      "Total Guests", "Trip Type", "Destination", "Trip Date", "Pickup Time",
      "Drop-off Time", "Pickup Location", "Drop-off Location",
      "Food Preference", "Onboard Activities", "Other Special Requests",
      "Booking Status",
    ]);
  }
  sheet.appendRow(Object.values(row));
  return ContentService.createTextOutput("ok");
}
```

### Google Sheets — service account (alternative)

Share the sheet with the service-account email, then set:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=1AbC...
GOOGLE_SHEETS_CLIENT_EMAIL=salt-republic@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SHEET_NAME=Bookings
```

### Never lose an enquiry

If a provider is missing or temporarily failing, the notification is written to
the `outbox` table and shown under **Settings → Delivery queue** with the exact
reason and a **Retry now** button. Booking detail pages also offer
**Re-send enquiry**, plus one-click *WhatsApp the guest* and *Copy enquiry
details* actions. Submissions themselves never fail because of an integration
problem.

### Google Apps Script starter

```js
function doPost(e) {
  const row = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Booking ID","Submission Date/Time","Name","WhatsApp Number","Total Guests",
      "Trip Type","Destination","Trip Date","Pickup Time","Drop-off Time",
      "Pickup Location","Drop-off Location","Food Preference","Onboard Activities",
      "Other Special Requests","Booking Status",
    ]);
  }
  sheet.appendRow(Object.values(row));
  return ContentService.createTextOutput("ok");
}
```

## Replacing placeholders with official Salt Republic assets

The imagery in `/public/images` is cinematic placeholder photography — replace
with the supplied Finch 65 photography (keep filenames, or update paths from the
dashboard). Official assets to swap in:

- `public/images/food-menu.jpg` — official food menu image (shown in the modal)
- `public/packages/salt-republic-mvr-package.pdf` — official MVR package
- `public/packages/salt-republic-usd-package.pdf` — official USD package

Genuine guest testimonials are added/approved in the dashboard; the seeded
placeholder testimonials are drafts and never appear on the public site.
