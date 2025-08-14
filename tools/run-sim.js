import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const ACS_URL = process.env.CWMP_URL || "http://localhost:7547/";
const SIM_BIN = path.join(process.cwd(), "genieacs-sim", "genieacs-sim");
const COUNT = Number(process.env.SIM_COUNT || 1);
const RUN_MS = Number(process.env.SIM_RUN_MS || 5000);

async function makeModel(version) {
  const dir = await mkdtemp(path.join(tmpdir(), "sim-"));
  const file = path.join(dir, "model.json");
  const model = {
    "Device.": [1],
    "Device.DeviceInfo.": [1],
    "Device.DeviceInfo.SoftwareVersion": [1, version],
    "Device.DeviceInfo.X_MIKROTIK_ArchName": [1, "arm"],
    "VirtualParameters.Upgrade": [1, "ready"]
  };
  await writeFile(file, JSON.stringify(model));
  return file;
}

function runSim(model, serial) {
  return new Promise(resolve => {
    const proc = spawn("node", [SIM_BIN, "--acs-url", ACS_URL, "--data-model", model, "--processes", "1", "--serial", String(serial)], { stdio: "inherit" });
    setTimeout(() => {
      proc.kill("SIGTERM");
      resolve();
    }, RUN_MS);
  });
}

async function runSequence(fromVer, toVer, baseSerial) {
  const startModel = await makeModel(fromVer);
  await runSim(startModel, baseSerial);
  const upgradedModel = await makeModel(toVer);
  await runSim(upgradedModel, baseSerial);
}

(async () => {
  for (let i = 0; i < COUNT; i++) {
    await runSequence("6.44.5", "6.49", 1000 + i);
    await runSequence("7.12", "7.15", 2000 + i);
  }
})();
