# Changelog

## [1.2.0] - 2026-10-06

- npm-ready packaging: `package.json` with subpath exports (`line-flex-lab`, `/component-metadata`, `/validator`, `/lint`), test/example scripts, keywords
- Docs repositioned around the conformance baseline: LINE's public Flex Message spec, LINE's published OpenAPI schema, the official showcase samples, and recorded official-endpoint responses in `research/`
- Added `research/README.md` (compliance evidence index) and `research/preview.png`
- Commercial-use guidance for MIT licensing

## [1.1.1] - 2026-10-06

- Rewrote `reusable/offline-data.mjs` and `reusable/component-metadata.mjs` as independent implementations (no LINE client expression in the repo); same public API and behavior, all 18 tests including the 12 sample round-trips unchanged

## [1.1.0] - 2026-10-06

- Scope: repo contains only original project code plus permissively licensed third-party snapshots; docs updated to match

## [1.0.0] - 2026-10-06

- Initial public release
- 12 official showcase sample templates
- Reusable zero-dependency ESM modules: `offline-data`, `component-metadata`, `validator-client`, `lint-offline`
- Test suite: 18 offline tests
- Research evidence: LINE server auth/samples/render API behavior, error payload mapping, community validator comparison
- Third-party source snapshots (flex2html, line-flex-renderer-npm, flex-guard, line-openapi) with original licenses
