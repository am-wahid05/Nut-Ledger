# Nut Ledger website

A responsive static marketing website for Nut Ledger. The website is separate from the Flutter application and has no runtime package dependencies.

## Run locally

Install a current Node.js release, then run this in Windows PowerShell:

```powershell
npm.cmd run dev
```

Open <http://127.0.0.1:4173>. The local Node server serves the website. Demo requests are only sent if the public Supabase settings and the Supabase backend have both been configured; the form otherwise explains that it is not connected.

## Build for production

```powershell
npm.cmd run build
```

This copies the static pages and public assets to `dist/`. Deploy the contents of `dist/` to a static web host configured to serve `index.html` at the site root. The Supabase function is deployed separately from the `supabase/` directory.

## Connect the Request a Demo form with Supabase

The browser sends the form asynchronously to a Supabase Edge Function and stays on the demo page. The function validates the fields, applies a per-network-address limit, saves the request, then sends an administrator notification through Resend. It returns a success response only when saving and notification both succeed. If the notification provider is temporarily unavailable, the saved request is retained and the same submission can be retried without creating a duplicate.

The `demo_requests` table has a database-generated `created_at` timestamp and a `status` of `new`, `contacted` or `closed`. Row Level Security is enabled, and anonymous/authenticated website visitors have no table read or write permissions. Only the Edge Function's server-side service-role credential can access the table. Do not put that credential or any email-provider secret in website files.

### 1. Create and link a Supabase project

Create a project in the Supabase dashboard, install the Supabase CLI, then run these commands from the website project folder in PowerShell:

```powershell
supabase login
supabase link --project-ref YOUR_SUPABASE_PROJECT_REF
```

Find the project reference in the Supabase dashboard URL or project settings. Do not send project secrets in chat or commit them to the website.

### 2. Create the database objects

Apply the included migration:

```powershell
supabase db push
```

The migration at `supabase/migrations/202606160001_demo_requests.sql` creates the request table, private rate-limit storage and a service-role-only rate-limit function. Review the SQL before applying it to a production project.

### 3. Configure administrator email delivery

Create a Resend account, verify a sender domain there, and choose a sender address on that verified domain. The configured recipient defaults to `amwahid005@gmail.com`; you can explicitly set it below. Since Nut Ledger does not yet have a website domain, email delivery is not ready until a sender domain is verified with the email provider.

Set the Edge Function secrets from PowerShell. Replace each example value locally; never put these values in `assets/site-config.js`, HTML, or source control:

```powershell
supabase secrets set `
  ADMIN_NOTIFICATION_EMAIL="amwahid005@gmail.com" `
  RESEND_API_KEY="YOUR_RESEND_API_KEY" `
  RESEND_FROM_EMAIL="Nut Ledger <demo@YOUR_VERIFIED_SENDER_DOMAIN>" `
  RATE_LIMIT_SECRET="GENERATE_A_LONG_RANDOM_SECRET" `
  ALLOWED_ORIGINS="http://127.0.0.1:4173,http://localhost:4173"
```

Use a long, unique random value for `RATE_LIMIT_SECRET` (a password manager can generate one). Add the exact HTTPS origin of the production website to `ALLOWED_ORIGINS` after choosing a domain, separated by a comma. Do not use `*`. Local origins are included above for development.

### 4. Deploy the Edge Function

From the project folder, deploy the function:

```powershell
supabase functions deploy demo-request
```

`supabase/config.toml` disables JWT verification only for this public form endpoint, because demo visitors do not sign in. The function still checks the configured website origin, validates the request, rejects honeypot submissions, rate-limits requests, and uses its server-side service-role key for database access. CORS is not treated as the security boundary.

### 5. Connect the website to the public project settings

In the Supabase project settings, copy the Project URL and the **publishable** key (or legacy anon key). Put those public values in `assets/site-config.js`:

```js
supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
supabasePublishableKey: "YOUR_PUBLIC_PUBLISHABLE_KEY"
```

These are public browser settings, not passwords. Never use a `service_role` key here. Rebuild and deploy the website after changing the settings:

```powershell
npm.cmd run build
```

### 6. Test before launch

With the local server running, submit a test request using details you control. Check that the page shows an in-page confirmation and resets only after the save and email notification both succeed. Check the `demo_requests` table in the Supabase dashboard and confirm the administrator email arrives. Also test a malformed request, a honeypot-filled request and the rate limit; do not test with real supplier information. The function permits five requests per network address in a 15-minute window.

If a request is saved but the email provider fails, the page says so and retains the form. Retrying the same unchanged form reuses its submission ID. Fix the provider configuration and retry, or contact Nut Ledger to follow up on the already-saved request. An email sender domain and live Supabase project are required for end-to-end verification.

## Pages

- `index.html` — Home
- `features.html` — Features
- `how-it-works.html` — How It Works
- `security.html` — Security
- `pricing.html` — Pricing
- `faq.html` — FAQ
- `demo.html` — Request a Demo
- `about.html` — About Nut Ledger
- `privacy.html` — Privacy Policy (draft for legal review)
- `terms.html` — Terms of Service (draft for legal review)
- `cookies.html` — Cookie Policy (draft for legal review)
- `contact.html` — Contact

Shared navigation, footer and asynchronous demo form are in `assets/site.js`; the visual system is in `assets/styles.css`. The wordmark is deliberately text-based and replaceable. The homepage uses an editorial buying-desk hero, real Secretary workspace capture and a Receive/Record/Review workflow strip; its compact mobile navigation and numbered footer are styled as part of the same visual identity. The site uses system fonts and an olive, warm-neutral and harvest-earth palette; subtle scroll and hover motion respects reduced-motion preferences. The marketing site does not currently use cookies, local storage or analytics.

## Screenshot map

The supplied screenshots are published as provided under `assets/screenshots/`; no visual masks or redactions have been added. The owner has confirmed that the example data shown in these screenshots is not real customer or supplier data.

| Screenshot | Product experience | Website use |
|---|---|---|
| `secretary-dashboard.png` | Secretary | Home hero, roles, cloud synchronization, receiving overview |
| `user-management.png` | Admin | Home Admin-vs-Secretary panel; team roles |
| `individual-receiving.png` | Receiving workspace | Home receiving feature; individual bag entry |
| `bulk-receiving.png` | Receiving workspace | Home and Features bulk receiving; workflow |
| `individual-receiving-profile-creation.png` | Receiving workspace | Features supplier creation during receiving |
| `supplier-management.png` | Admin | Home and Features searchable supplier records |
| `supplier-profile.png` | Admin | Home and Features supplier history/statements |
| `secretary-print-page.png` | Secretary | Home receipts; Features; workflow printing |
| `analytics-1.png` | Admin | Home analytics overview; Features reports/analytics and Excel/Spreadsheet tools |
| `analytics-2.png` | Admin | Features product and supplier analytics; workflow |
| `analytics-3.png` | Admin | Features locations and trends |
| `company-settings.png` | Admin | Features company management; workflow setup |
| `sign-in-screen.png` | Sign-in | Features account access/security |

**Screenshot limitation:** No Admin dashboard screenshot was supplied. The Home hero uses the actual Secretary dashboard and labels it as such. The Admin-vs-Secretary panel uses the supplied Admin user-management view, not a fabricated Admin dashboard. Supply a sanitized Admin dashboard image if you want that exact screen featured.

Screenshots and captions show the original interface. The homepage uses the actual Secretary dashboard rather than suggesting that it is an Admin dashboard. Review the supplied captures before publishing if any example information changes or has not been approved for public display.

## Replace before launch

1. Purchase/configure a real domain, then replace `YOUR_DOMAIN_HERE` in `assets/site-config.js` and `sitemap.xml`. `site-config.js` only generates canonical and Open Graph URLs after the value is replaced with the real HTTPS origin; do not add secrets.
2. Complete the Supabase and Resend setup above. The form is not live until the function is deployed, public project settings are configured, allowed origins are correct, and a verified sender address is set.
3. Review and finalize the Privacy Policy, Terms of Service and Cookie Policy with qualified counsel for applicable Ghanaian requirements. Confirm actual data flows, hosting/transfer locations, subprocessors, retention and deletion practices, subscription grace-period details, and off-season pause rules.
4. Supply the Admin dashboard capture if desired. Current screenshot files are the supplied, unaltered captures.
5. Configure any analytics only after selecting a provider and updating the disclosures and consent behavior. No analytics or marketing tracker is currently installed.

## Product facts used

- Business plan: GH₵250/month after a 30-day free trial.
- Secretary bundle: three secretaries for GH₵75/month.
- SMS: GH₵0.05 per message; credits are separate.
- Subscription grace-period, access-restriction, data-retention, and off-season statements are limited to the product behavior provided by Nut Ledger.
- No customer testimonials, statistics, certifications, integrations or unsupported security guarantees are claimed.
