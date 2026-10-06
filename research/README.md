# Compliance evidence

Recorded responses from LINE's official Flex validation endpoints, used as the
conformance baseline for the error-path mapping and validator comparison.

| File | What it is |
|---|---|
| `unauthenticated-checks.json` | `GET /api/v1/session`, `GET /api/v1/fx/samples`, `POST /api/v1/fx/render` all return 401 without a LINE session (public endpoint behavior). |
| `validation-observations.json` | Real `POST /api/v1/fx/render` responses: 200 for valid payloads, 400 bodies with exact property paths for invalid ones. Feeds `reusable/offline-data.mjs` (`errorPathMapper`). |
| `flex-guard-comparison.json` | The same payloads checked through the community flex-guard linter, showing where community validation agrees with / diverges from the official endpoint. |
| `github/snapshots.json` | Pinned commits + licenses for the vendored `third-party/` snapshots. |
| `preview.png` | `samples/restaurant.json` rendered with the vendored flex2html. |
