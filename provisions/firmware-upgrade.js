const prefix = 'firmware-upgrade: ' // === Firmware Upgrade Provision ===
log(prefix + "=== Running firmware-upgrade provision ===");

// === Get architecture ===
let arch = declare("Device.DeviceInfo.X_MIKROTIK_ArchName", { value: 1 }).value[0];
if (!arch) {
  log(prefix + "Missing architecture. Exiting.");
  return;
}
log(prefix + `Detected architecture: ${arch}`);

let currentVersion = declare("Device.DeviceInfo.SoftwareVersion", { value: 1 }).value[0];
if (!currentVersion) {
  log(prefix + "Missing current software version. Exiting.");
  return;
}
// check if we are on (6 or 7)
const currentRosTree = currentVersion.charAt(0)
let targetVersion = '';
if (currentRosTree === "6") {
  targetVersion = '6.49.18'
  log(prefix+ `Currently on v6, staying on v6 & setting targetVersion to ${targetVersion}`);
  
}
if (currentRosTree === "7") {
 targetVersion = '7.15'
 log(prefix+ `Currently on v7, staying on v7 & setting targetVersion to ${targetVersion}`);
}
if (currentRosTree === "") {
   log(prefix+ `Unable to determine 'currentRosTree', dying`);
   return
}
log(prefix + `Using target version: ${targetVersion}`);


log(prefix + `Current version: ${currentVersion}`);

// === Version comparison ===
function compareVersions(a, b) {
  const aParts = a.split(".").map(n => parseInt(n));
  const bParts = b.split(".").map(n => parseInt(n));
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    let diff = (aParts[i] || 0) - (bParts[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

if (compareVersions(currentVersion, targetVersion) >= 0) {
  log(prefix + "No upgrade needed. Exiting.");
  return;
}

// === Check if upgrade is allowed ===
let upgradeState = declare("VirtualParameters.Upgrade", { value: 1 }).value[0];
log(prefix + `Upgrade state: ${upgradeState}`);

if (upgradeState !== "required") {
  log(prefix + `Upgrade not allowed. Current state is ${upgradeState}, expected 'required'. Exiting.`);
  return;
}

// === Mark upgrade attempt ===
log(prefix + "Marking upgrade attempt...");
log(prefix + `Setting VirtualParameters.SoftwareVersionTarget to ${targetVersion}`);
declare("VirtualParameters.SoftwareVersionTarget", null, { value: targetVersion });
log(prefix + `Setting VirtualParameters.UpgradeAttemptVersion to ${targetVersion}`);
declare("VirtualParameters.UpgradeAttemptVersion", null, { value: targetVersion });

// === Trigger download ===
const fileName = `mikrotik-${arch}.xml`;

log(prefix + `Triggering firmware XML download: ${fileName}`);

declare("Downloads.[FileType:1 Firmware Upgrade Image]", { path: 1 }, { path: 1 });
declare("Downloads.[FileType:1 Firmware Upgrade Image].FileName", { value: 1 }, { value: fileName });
declare("Downloads.[FileType:1 Firmware Upgrade Image].Download", { value: 1 }, { value: Date.now() });
// if we don't set it back to 'ready' then it runs this script over and over again.
declare("VirtualParameters.Upgrade", null, {value: 'ready'});
log("Firmware upgrade script completed.");
commit()
