const ACS = process.env.ACS_BASE || "http://localhost:7557";

async function main() {
  const res = await fetch(`${ACS}/devices`);
  if (!res.ok) throw new Error(`NBI query failed: ${res.status}`);
  const devices = await res.json();
  for (const d of devices) {
    const id = d._id;
    const up = d["VirtualParameters.Upgrade"]?.value;
    console.log(`${id}: Upgrade=${up}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
