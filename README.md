# line-flex-lab

An offline toolkit for building, previewing, validating, and studying **LINE Flex messages** — no LINE account, no npm, no network required.

Captured and verified: 2026-10. All original assets are SHA-256 pinned in [`manifest.json`](manifest.json).

[ไทย: อ่านเพิ่มเติมใน `README-TH.txt`](README-TH.txt)

## What you get

| Piece | What it is |
|---|---|
| `offline-lab.html` | Single self-contained file: Flex JSON editor, live preview, 12 official showcase samples, image assets, undo/redo, import/export. Works from `file://`, tested fully offline. |
| `samples/` | 12 official showcase templates: restaurant, hotel, shopping, ticket, todoapp, transit, realestate, menu, localsearch, receipt, social, apparel. |
| `reusable/` | Zero-dependency ESM modules (Node >= 22.18 or browser): the simulator's own Flex↔tree codec and error-path mapper (`offline-data.mjs`), per-node component rules (`component-metadata.mjs`), an adapter to the real online server validator (`validator-client.mjs`), and offline linting via vendored [flex-guard](https://github.com/loncoeng/flex-guard) (`lint-offline.mjs`). |
| `tests/` | 18 offline tests: `node --test tests/offline-data.test.mjs` — all passing. |
| `research/` | Real LINE server evidence: auth flow, samples API, render API responses, 400 error payloads, cross-checks against community validators, offline browser checks. |
| `extracted/` | Line-referenced excerpts of the original simulator bundles: JSON apply, Axios auth, server render, error→node mapping. |
| `readable/` | The original simulator JS bundles, formatted for reading. |
| `third-party/` | Source snapshots of [flex2html](https://github.com/PamornT/flex2html), [line-flex-renderer-npm](https://github.com/kanketsu-jp/line-flex-renderer-npm), [flex-guard](https://github.com/loncoeng/flex-guard), and LINE's own OpenAPI schema ([line/line-openapi](https://github.com/line/line-openapi)). Each keeps its original license. |

## Quick start

Open the lab — no install:

```
double-click offline-lab.html        # Chrome / Safari / Edge, works from file://
```

Try the code from a terminal:

```sh
node reusable/example.mjs                          # Flex->tree->Flex roundtrip demo
node reusable/lint-offline.mjs samples/restaurant.json
node --test tests/offline-data.test.mjs            # 18 tests
python3 build-offline-lab.py                       # rebuild offline-lab.html
```

## How the real simulator works

Reverse-engineered from live calls (full evidence in `research/`):

```
page -> GET  /api/v1/session          # account/session check
     -> GET  /api/v1/fx/samples       # sample list
     -> GET  /api/v1/fx/samples/{id}  # sample JSON
     -> POST /api/v1/fx/render        # Flex JSON
          200: HTML + renderer stylesheet link
          400: { message, details: [{ property, message }] }
```

Axios is configured `withCredentials=true`, `xsrfHeaderName='X-CSRF-Token'`; HTTP 401 redirects to LINE Business login. Every endpoint returns 401 without a session. The server-side renderer/validator source is **not** present in the client bundles — so this pack ships client-side truth plus server *behavior* evidence, not server source.

A worked example (from live 400s): `hero = {type:'image', size:'BAD'}` → `400 /hero/size: invalid property`, while `box` with `size:'full'` → `400 /hero/size: unknown field`. The error path points at the offending node; the message text differs by failure kind. Full table in `research/validation-observations.json`.

## Scope and limitations

- The offline preview renders via the community [flex2html](https://github.com/PamornT/flex2html) renderer. It is not LINE's renderer, so visual parity is not guaranteed for every property.
- `parseJsonOffline()` / `lint-offline.mjs` check JSON syntax and community-known rules; they do not replace LINE's server validator. Some invalid payloads are accepted by community libraries but rejected by LINE (see `research/flex-guard-comparison.json`).
- The original bundles are post-build JavaScript, not LINE's source repository; unmodified and hash-pinned.
- `reusable/offline-data.mjs` is the original algorithm re-exported; the import bubble is not a lossless codec for every optional field.
- No cookies, tokens, or account data are included.

## License

MIT for this project's code (see [`LICENSE`](LICENSE)). Third-party snapshots in `third-party/` retain their own licenses; bundling LINE's public assets for study does not change their terms.
