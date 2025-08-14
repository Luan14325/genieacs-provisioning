
# GenieACS Provisioning Starter

This repo gives you a clean starting point to store your GenieACS **provisions**, **presets**, and **virtual parameters** in one place and run basic checks in GitHub Actions. You can add proper integration tests later.

## Folder layout
```
provisions/            # .js files (GenieACS Provision scripts)
presets/               # .json files (Preset definitions)
virtual-parameters/    # .js files (Virtual Parameters)
.github/workflows/     # GitHub Actions (CI) workflows
test/                  # Simple sanity tests (Node.js)
docker-compose.yml     # Local Docker stack (ACS + deps)
.env.example           # Example environment file
package.json           # Dev/test tooling
```

## Quick start (no coding experience required)

1. **Create a GitHub repo** (Public or Private).
2. **Download this starter pack** as a ZIP from ChatGPT.
3. Extract it and **upload the files/folders** into your repo (GitHub → *Add file* → *Upload files*).
4. Go to **Actions** tab in GitHub and enable workflows if prompted.
5. Replace the placeholder files with your real ones:
   - Put your Provision scripts into `provisions/`
   - Put your Presets JSON into `presets/`
   - Put your Virtual Parameters into `virtual-parameters/`

> Tip: keep commit messages short and clear, e.g. `feat: add bootstrap provision`.

## Local run (optional)

If you want to run the stack locally with Docker:
1. Install Docker Desktop.
2. Copy `.env.example` to `.env` and edit values if needed (especially `GENIEACS_IMAGE`).
3. In a terminal, run:
   ```bash
   docker compose up -d
   ```
4. Open the UI at http://localhost:3000 (default). CWMP listens on 7547.

> Pin `GENIEACS_IMAGE` to *your exact* GenieACS version once you tell your team which one you run in production.

## Tests in CI

This starter ships with a **very simple** test that just checks the repo structure is correct. As a next step, you can add `genieacs-sim` based tests to simulate devices and assert your upgrade state machine.

Run locally:
```bash
npm install
npm test
```

---

### Notes for your project rules

- Use `declare(path, null, { value: ... })` for all value writes to ensure persistence.
- Single target RouterOS **6.49** for all architectures.
- `Upgrade` VP states: `ready → required → done/failed` (no auto-retry on failed).
- Legacy preset preconditions are OK (e.g., `Device.Config.State = "assigned"`).

You'll replace this README with your own details as you evolve.
