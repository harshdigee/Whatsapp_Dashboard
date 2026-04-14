# Who sees “Access Denied”?

## Where it happens (frontend only)

| String | File |
|--------|------|
| `Access Denied` | `src/pages/AccessDenied.jsx` |
| `not authorized` (subtitle) | `src/pages/AccessDenied.jsx` |
| Route to that screen | `src/App.jsx` when `useAuth()` returns `isAllowed === false` |

There is **no** check for HTTP **403** from `/api/chats` (or any API) for this screen. The dashboard shell is gated **only** by the client hook `src/hooks/useAuth.js`.

## How access is decided

### 1) Client-side allowlist (what the app actually reads)

- **Variable name:** `VITE_ALLOWED_EMAILS` (Vite / this repo — **not** `NEXT_PUBLIC_*`, not `ALLOWED_EMAILS` alone).
- **Format:** comma-separated emails, e.g. `abharshcd@gmail.com,other@example.com`
- **Parsing:** `src/lib/allowedEmails.js` — splits on commas/semicolons/newlines, **trim + lowercase** on each entry and on `session.user.email` before compare.
- **When it is applied:** At **build time**, Vite replaces `import.meta.env.VITE_ALLOWED_EMAILS` in the bundle. The browser never reads Railway or server `.env` at runtime for this value.

### 2) Railway `ALLOWED_EMAILS`

- Used only if **your Node backend** reads it (this frontend repo does **not** use it for the Access Denied page).
- **Does not** automatically sync with the React app. You must keep the **same** email list in **Vercel** as `VITE_ALLOWED_EMAILS` if you want the same people allowed in the UI.

### 3) API responses (403 / 401)

- **401:** handled in `src/services/api.js` (sign out + redirect `/`).
- **403:** not used today to show Access Denied; you would need a dedicated flow (e.g. `GET /api/me`) to switch to “backend-only” gating.

## Why you still see Access Denied after “adding emails everywhere”

Typical causes:

1. **Wrong variable on Vercel** — must be exactly **`VITE_ALLOWED_EMAILS`**. Names like `ALLOWED_EMAILS` or `NEXT_PUBLIC_ALLOWED_EMAILS` are **ignored** by this Vite app.
2. **Vercel env not applied to the build** — after changing env vars, trigger a **new deployment** (Rebuild). Old bundles still have the old (or empty) value.
3. **Preview vs Production** — set `VITE_ALLOWED_EMAILS` for **Preview** too if you test on `*.vercel.app` preview URLs.
4. **Railway-only** — variables on Railway **never** reach the React bundle; they only affect the server.

## Checklist (Vercel)

1. Project → Settings → Environment Variables  
2. Add **`VITE_ALLOWED_EMAILS`** = same comma-separated list as Railway (if you mirror policy).  
3. Apply to **Production** (and **Preview** if needed).  
4. **Redeploy** the latest commit.

## Single source of truth (optional direction)

- **Today:** client allowlist (`VITE_ALLOWED_EMAILS`) + (optionally) server checks on API — two lists to keep in sync manually.  
- **Future:** trust backend only — e.g. call an authenticated endpoint that returns 200/403 and drive `isAllowed` from that (requires backend support).
