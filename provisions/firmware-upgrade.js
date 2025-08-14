const PFX = "firmware-upgrade: ";

// Check Upgrade state
const state = declare("VirtualParameters.Upgrade", { value: 1 }).value?.[0] || "";
if (state !== "required") {
  log(PFX + `Skipping; state=${state}`);
  return;
}

// Determine current and target versions
const currentVersion = declare("Device.DeviceInfo.SoftwareVersion", { value: 1 }).value?.[0] || "";
let targetVersion = "";
if (currentVersion.startsWith("6.")) {
  targetVersion = "6.49";
} else if (currentVersion.startsWith("7.")) {
  targetVersion = "7.15";
} else {
  log(PFX + `Unknown RouterOS version ${currentVersion}`);
  declare("VirtualParameters.Upgrade", null, { value: "failed" });
  return;
}

// Get architecture to build file name
const arch = declare("Device.DeviceInfo.X_MIKROTIK_ArchName", { value: 1 }).value?.[0] || "";
if (!arch) {
  log(PFX + "Missing architecture");
  declare("VirtualParameters.Upgrade", null, { value: "failed" });
  return;
}

try {
  const fileName = `mikrotik-${arch}.xml`;
  declare("Downloads.[FileType:1 Firmware Upgrade Image]", { path: 1 }, { path: 1 });
  declare("Downloads.[FileType:1 Firmware Upgrade Image].FileName", { value: 1 }, { value: fileName });
  declare("Downloads.[FileType:1 Firmware Upgrade Image].Download", { value: 1 }, { value: Date.now() });
  declare("VirtualParameters.Upgrade", null, { value: "ready" });
  log(PFX + `Triggered download ${fileName} for target ${targetVersion}`);
  commit();
} catch (err) {
  log(PFX + `Download failed: ${err}`);
  declare("VirtualParameters.Upgrade", null, { value: "failed" });
}
