# Smoke tests (manual)

These checks are intended to be run locally after changes that affect recording, routing, or build tooling.

## Pre-reqs
- Serve the app over **HTTPS** (screen capture APIs require a secure context).
- Use a Chromium-based browser (Chrome/Edge) for primary validation.

## Recording flows
- **Screen-only recording**
  - Navigate to `/record`.
  - Start recording with microphone disabled.
  - Choose a window/tab/screen to share.
  - Verify the UI transitions into “recording”.
  - Stop using the in-app stop button.
  - Expect navigation to `/replay`.
  - Verify the replayed video has non-zero duration and matches expected content.

- **Screen + microphone recording**
  - Navigate to `/record`.
  - Enable microphone recording.
  - Start recording and grant microphone permission.
  - Speak while recording.
  - Stop using the in-app stop button.
  - On `/replay`, confirm microphone audio is present (audible voice) and video duration is correct.

- **Stop via “share ended”**
  - Start a recording.
  - End sharing from the browser’s built-in “Stop sharing” UI (not the app).
  - Verify the app stops recording cleanly and routes to `/replay`.
  - Verify the replayed video is not truncated.

## Repeatability / cleanup
- **Record twice in a row**
  - Start → Stop → Replay, then go back to `/record`.
  - Start → Stop again.
  - Confirm the second replay works and the tab does not become sluggish (indirect check for unreleased resources).

## Routing/build sanity
- **Hard refresh on a deep route**
  - Open `/replay` directly (or refresh while on it).
  - Confirm the app loads and routes correctly.

