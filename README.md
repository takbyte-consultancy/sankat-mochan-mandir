# Sankat Mochan Mandir, Mirzapur — Website

A static website for Shri Sankat Mochan Hanuman Mandir, Mirzapur. It has no build step and no database. All forms send their details on WhatsApp.

```
index.html              ← the page
assets/css/style.css    ← all styles (colours at the top, in :root)
assets/js/data.js       ← EDIT THIS: timings, sevaks, events, gallery, UPI, contact
assets/js/main.js       ← behaviour + the WhatsApp number (top of file)
assets/images/          ← photos (currently placeholders)
.htaccess               ← HTTPS, compression, caching for Hostinger
```

Open `index.html` in a browser to preview it locally. It works without a server.

---

## Before going live: replace the placeholders

Search the project for **`[REPLACE]`**. In VS Code, press Ctrl+Shift+F. Every placeholder text is marked with it.

1. **WhatsApp number**: at the top of `assets/js/main.js`:
   ```js
   const WHATSAPP_NUMBER = "919876543210"; // 91 + 10-digit number, digits only
   ```
2. **Content in `assets/js/data.js`**: timings, Mahant note, events, gallery captions, UPI ID, address, phone, email, map, Sansthan URL.
3. **Text in `index.html`**: hero welcome line, About history, how to reach, guidelines, Trust description.
4. **Domain in `index.html`**: replace `https://www.example.com/` in the `<head>` (canonical, og:image, og:url and the JSON-LD block).
5. **Images**: overwrite the files in `assets/images/`, keeping the **same file names**:

| File | What | Shape |
|---|---|---|
| `hero-deity.jpg` | Deity image from the temple poster | portrait 3:4, ~900×1200 |
| `mahant.jpg`, `sevak-1…4.jpg` | Temple family photos | portrait 3:4, ~600×800 |
| `event-1…3.jpg` | Event images | landscape 4:3, ~800×600 |
| `gallery-1…9.jpg` | Gallery photos | any shape, ~1200px wide |
| `donation-qr.png` | UPI QR code | square |
| `og-image.jpg` | Preview image when the link is shared | 1200×630 |
| `favicon.svg`, `apple-touch-icon.png` | Browser tab icon | square |

Keep photos under ~250 KB each. <https://squoosh.app> compresses them for free.

---

## Everyday updates (only `assets/js/data.js`)

**Change timings**: edit the `time` text in `timings` / `aartis`.

**Add an event**: copy one block inside `events: [ … ]`, paste it below, and change it:
```js
{
  title: "Sharad Purnima",
  titleHi: "शरद पूर्णिमा",
  date: "2026-10-25",                 // YYYY-MM-DD
  image: "assets/images/event-4.jpg", // upload this image too
  description: "Short description of the event."
},
```
Past events hide themselves automatically. The gold seal and the WhatsApp message are filled in from the date.

**Add gallery photos**: upload the image to `assets/images/`, then add a line:
```js
{ src: "assets/images/gallery-10.jpg", category: "festivals", caption: "Diwali 2026" },
```
`category` must be one of `shringar`, `festivals`, `temple`, `events` (these match the filter buttons).

**Donation amounts / purposes**: edit `donation.amounts` and `donation.purposes`.

After editing, commit and push to GitHub. Hostinger deploys the change automatically (see below).

> If a returning visitor still sees the old version, change `?v=1` to `?v=2` on the three `assets/...` links at the bottom and top of `index.html`.

---

## Deploy on Hostinger from GitHub

### 1. Put the code on GitHub
1. Create a new repository on GitHub, e.g. `sankat-mochan-mandir`. It can be private.
2. Upload these files to the **root** of the repo, so `index.html` is at the top level:
   ```bash
   git init
   git add .
   git commit -m "Sankat Mochan Mandir website"
   git branch -M main
   git remote add origin https://github.com/<you>/sankat-mochan-mandir.git
   git push -u origin main
   ```

### 2. Connect it in hPanel
1. hPanel → **Websites** → your domain → **Manage** → **Advanced** → **GIT**.
2. **Private repo only**: under *Private Git Repository*, click **Generate SSH key** and copy it. On GitHub, go to repo → **Settings → Deploy keys → Add deploy key**, paste it, and save. In Hostinger, use the SSH URL: `git@github.com:<you>/sankat-mochan-mandir.git`.
   **Public repo**: use the HTTPS URL `https://github.com/<you>/sankat-mochan-mandir.git`.
3. Under *Create a New Repository*: set **Repository** to the URL above, **Branch** to `main`, and leave **Directory** empty. An empty Directory deploys into `public_html`.
   ⚠️ `public_html` must be **empty** first. Delete the default `default.php` / `index.php` in File Manager.
4. Click **Create**, then **Deploy**. The site is now live on your domain.

### 3. Turn on auto-deployment
1. In the same GIT page, find your repo in the list and click **Auto Deployment**. Copy the **Webhook URL**.
2. On GitHub, go to repo → **Settings → Webhooks → Add webhook**:
   - Payload URL: the webhook URL
   - Content type: `application/json`
   - Event: *Just the push event*
3. Save. From now on, every `git push` to `main` updates the live site within a minute.

### 4. SSL
hPanel → **Security → SSL**: install the free SSL for the domain. `.htaccess` then redirects all visitors to `https://`.

---

## Notes
- Libraries load from CDNs: Google Fonts, GSAP + ScrollTrigger (cdnjs) and GLightbox (jsDelivr). If one fails to load, the site still works, with simpler animations and plain image links.
- Animations stop for visitors who turn on "reduce motion" in their device settings.
- Forms need no backend. They open WhatsApp (app on mobile, WhatsApp Web on desktop) with the message pre-filled, and the visitor presses Send.

Developed by [Tarkbyte](https://tarkbyte.com).
