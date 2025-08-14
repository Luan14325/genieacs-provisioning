import fs from "node:fs/promises";
import path from "node:path";
import fetch from "node-fetch";

const ACS = process.env.ACS_BASE || "http://localhost:7557";

async function upsertPreset(file) {
  const name = path.basename(file, ".json");
  const body = JSON.parse(await fs.readFile(file, "utf8"));
  const res = await fetch(`${ACS}/presets/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upsert ${name}: ${res.status} ${text}`);
  }
  console.log(`Upserted preset ${name}`);
}

(async () => {
  const dir = path.join(process.cwd(), "presets");
  const files = (await fs.readdir(dir))
    .filter(f => f.endsWith(".json"))
    .map(f => path.join(dir, f));
  for (const f of files) await upsertPreset(f);
  console.log("All presets seeded");
})();
