# Security & Production Checklist (CINEMA KH)

This prototype is designed for review, **not** for public launch as-is. The
items below are the gaps that must be closed before the site is exposed publicly.

---

## 1. Critical — fix before any public deploy

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | `/admin` is publicly reachable with no auth | `app/admin/page.tsx` | Add server-side role check (see below) or remove the route from production builds until admin exists. |
| 2 | Sign-in is a localStorage demo, not authentication | `components/session-provider.tsx` | Replace with Supabase Auth + Google OAuth, httpOnly cookies, server session refresh. |
| 3 | Playback gate is client-side only | `components/watch-gate.tsx` | Enforce on the server and issue short-lived video tokens per request. A hidden player is not access control. |
| 4 | Watchlist / progress / ratings live in localStorage | `components/session-provider.tsx` | Move to Supabase tables with RLS scoped to the owning account + profile. |
| 5 | Movie requests are not persisted or rate-limited | `app/request/page.tsx` | Server action + DB insert + per-account/IP rate limit. |

### Minimum admin guard (until the real one exists)

Create `middleware.ts` (or a server-side check inside a layout) that rejects
requests without an admin session:

```ts
// middleware.ts — illustrative only; needs a real session source
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login?next=/admin", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
```

Middleware alone is a redirect. **Authorization must also be re-checked in every
server action and query** — never trust a client-submitted role or user id.

---

## 2. Data & authorization rules

- Every table gets RLS enabled; default deny.
- Profile-owned rows (`watch_progress`, `watch_history`, `watchlists`, `ratings`,
  `comments`, `movie_requests`, `notification_preferences`) filtered by
  `auth.uid() = owner_id` and the active profile.
- Admin verbs guarded by a `user_roles` lookup performed **server-side**
  (Postgres function or service-role server action), never from JWT claims alone
  unless the claim is signed and rotated correctly.
- All admin mutations append to `admin_audit_logs` (actor, action, target, before/after).
- Validate every input server-side (length, enum membership, UUID shape).
- Rate limit: auth callbacks, requests, comments, ratings, reports, search.

## 3. Secrets

Never in the repo, never in `NEXT_PUBLIC_*`:

- `SUPABASE_SERVICE_ROLE_KEY`
- Google OAuth client secret
- Cloudflare Stream API token / signing key
- Any ad-network credentials

Use Cloudflare **Secrets** (Workers → Settings → Variables and Secrets) or
`wrangler secret put`.

## 4. Video/streaming

- No permanent public source URLs. Use signed tokens with short TTL.
- Do not proxy or re-host content without a licence.
- Health checks: a 200 HTTP status does not prove playability — prefer provider
  playback APIs.
- Download/offline: only with an authorised SDK that supports expiry and device
  limits. Otherwise mark the feature as deferred (it is currently deferred).

## 5. Advertising (AdSense or other)

Currently `public/ads.txt` is intentionally empty and `AdSlot` loads **no**
script. Before enabling:

- Do not add ad code until the network has approved the site.
- Do not place ads above or inside the player, or adjacent to Play / Next Episode.
- Reserve ad heights (already done in `components/ad-slot.tsx`) to avoid CLS.
- Never fabricate impressions, clicks, or revenue in the database or dashboard.
- Import only provider-reported, clearly-labelled estimates.
- Implement consent (GDPR/CCPA where applicable) before serve.
- Replace `public/ads.txt` with the exact line(s) from the provider dashboard.

## 6. Privacy & legal

- Privacy policy and Terms are placeholders — have them reviewed for your jurisdiction.
- Define retention + deletion for accounts, progress, comments, and logs.
- Provide a working account/data deletion path before launch.
- Parental controls / child profiles must be enforced server-side, not just hidden in UI.

## 7. Operational

- `observability.enabled` is on in `wrangler.jsonc`; review logs after each deploy.
- Back up Supabase (PITR or scheduled dumps) and **test a restore**.
- Use `npx wrangler rollback` for fast revert; keep deploys small.
- Uptime + error alerting before public launch.

## 8. Content rights

Every title needs an internal rights note (the sample data includes
`rightsNote`). Publish only content CINEMA KH is authorised to distribute or
embed. Do not scrape or re-host third-party streams.
