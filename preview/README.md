# Ստեփան և Աննա — Wedding RSVP Website

A static wedding invitation website designed for GitHub Pages, with an optional Google Apps Script backend that saves RSVP responses to Google Sheets.

## Files

- `index.html` — website markup
- `styles.css` — design and responsive layout
- `script.js` — RSVP interaction + Apps Script submission
- `apps-script.gs` — Google Apps Script backend
- `assets/hero.jpg` — add your own cover photo with this exact filename

## 1. Preview on your computer

Open `index.html` in your browser.

For the best local preview, if you have VS Code, install the **Live Server** extension and choose **Open with Live Server**.

## 2. Add your cover photo

Put your chosen wedding photo inside the `assets` folder and rename it:

`hero.jpg`

The site still works without a photo; it will use a burgundy background.

## 3. Connect RSVP to Google Sheets

### Create the sheet

1. Create a new Google Sheet.
2. Copy the ID from its URL. Example:
   `https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit`

### Create Apps Script

1. In the Google Sheet, go to **Extensions → Apps Script**.
2. Delete the default code.
3. Paste the contents of `apps-script.gs`.
4. Replace:
   `PASTE_GOOGLE_SHEET_ID_HERE`
   with your Sheet ID.
5. Click **Deploy → New deployment**.
6. Select **Web app**.
7. Set **Execute as** to **Me**.
8. Set access to **Anyone**.
9. Deploy and authorize.
10. Copy the Web App URL ending in `/exec`.

### Connect the website

Open `script.js` and replace:

`PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE`

with your deployed Apps Script `/exec` URL.

## 4. Upload to GitHub

### Easiest way: GitHub website

1. Go to github.com and sign in.
2. Click **New repository**.
3. Repository name suggestion: `stepan-anna-wedding`.
4. Choose **Public** if you want to use GitHub Pages for free.
5. Click **Create repository**.
6. Click **uploading an existing file**.
7. Drag these items into GitHub:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets` folder with your photo
8. You do **not** need to upload `apps-script.gs` publicly if you prefer to keep backend code out of the site repository.
9. Click **Commit changes**.

## 5. Publish with GitHub Pages

1. In the repository, open **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**.
5. GitHub will show your published site URL after deployment.

It will usually look like:

`https://YOUR-USERNAME.github.io/stepan-anna-wedding/`

## 6. Upload with Git command line instead

From inside the project folder:

```bash
git init
git add .
git commit -m "Create wedding invitation website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/stepan-anna-wedding.git
git push -u origin main
```

If GitHub asks for authentication, use GitHub's browser/device login flow or a personal access token rather than your GitHub password.

## Customizing the design

The primary burgundy color is defined at the top of `styles.css`:

```css
--burgundy: #6b1732;
```

Change this one value to change most of the site's accent color.

## GHEA Mariam

The website currently uses `Noto Serif Armenian`, which loads reliably in a browser. If you own a web-licensed copy of GHEA Mariam, it can be added later as a local `@font-face`. Do not upload a font file publicly unless its license permits web distribution.
