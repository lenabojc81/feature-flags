# feature-flags (Render)

Endpoints:
- GET /flags   -> returns JSON flags
- GET /health  -> { ok: true }

ENV (optional):
- FLAGS_JSON: e.g. {"showStats":false,"showBadges":true}

Local:
- npm i
- npm start (or docker build/run)
