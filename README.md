# GenieACS Provisioning Starter

This repo holds provisioning code, presets, and utilities for GenieACS 1.2.13.

## Folder layout
```
provisions/            # .js Provision scripts
presets/               # .json preset definitions
virtual-parameters/    # .js Virtual Parameters
.tools/seed-presets.js etc
.github/workflows/     # GitHub Actions CI
Docker compose etc
```

## Local run
1. `docker compose up -d`
2. `npm run seed:presets`
3. `node tools/run-sim.js`
4. View logs in the terminal or open the ACS UI at http://localhost:3000

## Tests in CI
The GitHub Actions workflow builds the stack, seeds presets, runs the simulator, and uploads simulator and ACS logs as artifacts.

## Notes
- Use `declare(path, null, { value: ... })` for all writes.
- Read values for GUI caching with `declare(path, { value: 1 }).value?.[0]`.
- Upgrade state machine: `ready → required → done/failed` with targets 6.49 (v6) and 7.15 (v7).
- Presets are stored as JSON and seeded via `tools/seed-presets.js`.
