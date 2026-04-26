# Deployment security checklist (static browser app)

This app is a static frontend that uses **screen capture APIs** (`getDisplayMedia`, `MediaRecorder`). Most security is enforced at the **hosting** and **browser** level.

## Required
- **HTTPS only**: screen capture requires a secure context.
- **HSTS**: enable `Strict-Transport-Security` for the primary domain.
- **No caching of HTML** (recommended): serve `index.html` with `Cache-Control: no-store` so users get updates promptly (static assets can be cached long-term with hashes).

## Recommended headers
These are safe defaults for a static app; you may need to relax them if you add new third-party services.

- **Content-Security-Policy (CSP)** (start strict, then loosen only as needed)
  - Prefer: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'`
  - If you load Semantic UI CSS from a CDN, you must allow that host in `style-src`.
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `no-referrer` (or `strict-origin-when-cross-origin` if you need analytics)
- **Permissions-Policy**: restrict APIs not used by the app. Example starting point:
  - `camera=(), geolocation=(), microphone=(self), fullscreen=(self)`
  - Note: `display-capture` is not consistently supported as a Permissions-Policy directive across browsers, but it can be added when supported.
- **Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy**
  - Only enable these if you intentionally need cross-origin isolation; they can break third-party embeds/assets.

## Outbound links
- Use `target="_blank"` with `rel="noopener noreferrer"` for external links to prevent `window.opener` attacks.

## Dev server note (npm audit)
`webpack-dev-server` vulnerabilities generally affect **development** scenarios (serving source over the dev server). Production builds should be deployed as static assets and are not exposed via the dev server.

