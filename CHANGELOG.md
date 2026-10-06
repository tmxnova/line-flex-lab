# Changelog

## [1.1.1] - 2026-10-06

- Rewrote `reusable/offline-data.mjs` and `reusable/component-metadata.mjs` as independent implementations (no LINE client expression in the repo); same public API and behavior, all 18 tests including the 12 sample round-trips unchanged

## [1.1.0] - 2026-10-06

- Compliance: removed LINE's Flex Simulator client bundles and page assets (copyrighted, not licensed for redistribution); repo now contains only MIT-licensed code and permissively licensed third-party snapshots
- Docs updated to the redistributed scope

## [1.0.0] - 2026-10-06

- Initial public release
- 12 official showcase sample templates
- Reusable zero-dependency ESM modules: `offline-data`, `component-metadata`, `validator-client`, `lint-offline`
- Test suite: 18 offline tests
- Research evidence: LINE server auth/samples/render API behavior, error payload mapping, community validator comparison
- Third-party source snapshots (flex2html, line-flex-renderer-npm, flex-guard, line-openapi) with original licenses
