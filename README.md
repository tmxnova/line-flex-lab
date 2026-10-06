# line-flex-lab

An open-source toolkit for building and validating **LINE Flex messages** — official showcase samples, a zero-dependency Flex codec module, LINE's own OpenAPI schema, community validators, and reverse-engineered server behavior. No LINE account or network required.

Reverse-engineered from the official Flex Simulator. Verified 2026-10.

[ไทย: อ่านเพิ่มเติมใน `README-TH.txt`](README-TH.txt)

## What you get

| Piece | What it is |
|---|---|
| `samples/` | 12 official showcase templates: restaurant, hotel, shopping, ticket, todoapp, transit, realestate, menu, localsearch, receipt, social, apparel. |
| `reusable/` | Zero-dependency ESM modules (Node >= 18 or browser): an independent implementation of the simulator's editor tree model — `FlexToTree`, `TreeToFlex`, `errorPathMapper`, `createComponent` (`offline-data.mjs`), per-node component rules (`component-metadata.mjs`), an adapter to the real online server validator plus `parseJsonOffline()` (`validator-client.mjs`), and offline linting via vendored [flex-guard](https://github.com/loncoeng/flex-guard) (`lint-offline.mjs`). |
| `tests/` | 18 offline tests: `node --test tests/offline-data.test.mjs` — all passing. |
| `third-party/` | Source snapshots of [flex2html](https://github.com/PamornT/flex2html), [line-flex-renderer-npm](https://github.com/kanketsu-jp/line-flex-renderer-npm), [flex-guard](https://github.com/loncoeng/flex-guard), and LINE's own OpenAPI schema ([line/line-openapi](https://github.com/line/line-openapi)). Each keeps its original license. |
| `research/` | Real LINE server evidence: unauthenticated API checks, render API 400 error payloads with exact property paths, and a comparison of community validators against observed server rejections. |

## Quick start

```sh
node reusable/example.mjs                          # Flex -> tree -> Flex roundtrip demo
node reusable/lint-offline.mjs samples/restaurant.json
node --test tests/offline-data.test.mjs            # 18 tests
```

`reusable/validator-client.mjs` can also call the live simulator server (needs an online LINE session in a browser of the right origin):

```js
import { validateAndRender } from './reusable/validator-client.mjs';
const res = await validateAndRender(myFlexJson);   // { ok, html?, errors? }
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

Axios is configured `withCredentials=true`, `xsrfHeaderName='X-CSRF-Token'`; HTTP 401 redirects to LINE Business login. Every endpoint returns 401 without a session. The server-side renderer/validator source is **not** present in the client — this repo ships client-side truth plus server *behavior* evidence, not server source.

Worked example (from live 400s, `research/validation-observations.json`): `hero = {type:'image', size:'BAD'}` → `400 /hero/size: invalid property`, while a `box` with `size:'full'` → `400 /hero/size: unknown field`. The error path points at the offending node; the message text differs by failure kind — useful for building editor UX that matches LINE's own.

## Scope and limitations

- Community validators (incl. `lint-offline.mjs`) do not replace LINE's server validator: some payloads they accept are rejected by LINE (see `research/flex-guard-comparison.json`). For final checks, POST to the real endpoint via `validator-client.mjs`.
- The tree model in `offline-data.mjs` intentionally mirrors the simulator's editor limitations: bubble round-trips preserve size/direction/blocks/styles but drop `bubble.action` and other bubble fields the editor does not model (verified in `tests/`). Keep your own copy of the input when those fields matter.
- This repo intentionally does **not** include LINE's Flex Simulator client bundles or page assets: they are copyrighted and not licensed for redistribution. Use the official simulator for live visual preview: https://developers.line.biz/flex-simulator/

## License

MIT for this project's code (see [`LICENSE`](LICENSE)). Third-party snapshots in `third-party/` retain their own licenses.
