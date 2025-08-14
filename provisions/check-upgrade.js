const PFX = "check-upgrade: ";

// Cache reads for GUI visibility
const currentVersion = declare("Device.DeviceInfo.SoftwareVersion", { value: 1 }).value?.[0] || "";
const upgradeState   = declare("VirtualParameters.Upgrade", { value: 1 }).value?.[0] || "";

// Only proceed if current state is "ready"
if (upgradeState !== "ready") {
  log(PFX + `Skipping; state=${upgradeState}`);
  return;
}

let targetVersion = "";
if (currentVersion.startsWith("6.")) {
  targetVersion = "6.49";
} else if (currentVersion.startsWith("7.")) {
  targetVersion = "7.15";
} else {
  log(PFX + `Unknown RouterOS major for version ${currentVersion}, marking done.`);
  declare("VirtualParameters.Upgrade", null, { value: "done" });
  return;
}

// Compare current vs. target
if (currentVersion !== targetVersion) {
  declare("VirtualParameters.Upgrade", null, { value: "required" });
  log(PFX + `Set Upgrade=required (current=${currentVersion}, target=${targetVersion})`);
} else {
  declare("VirtualParameters.Upgrade", null, { value: "done" });
  log(PFX + `Set Upgrade=done (already at target ${targetVersion})`);
}
