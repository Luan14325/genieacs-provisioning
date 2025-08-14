const PFX = "check-upgrade: ";

// Cache reads for GUI
const current = declare("Device.DeviceInfo.SoftwareVersion", { value: 1 }).value?.[0] || "";
const upgrade  = declare("VirtualParameters.Upgrade", { value: 1 }).value?.[0] || "";
const target   = declare("VirtualParameters.SoftwareVersionTarget", { value: 1 }).value?.[0] || "6.49";

// Only run when state is "ready"
if (upgrade !== "ready") {
  log(PFX + `skipping; state=${upgrade}`);
  return;
}

// RouterOS major tree check (v6 vs v7)
const currentTree = current.charAt(0);
// Your policy: single target 6.49 for ALL devices; keep arch checks if you wish.
// Decide if upgrade required
const needs = current !== target;

if (needs) {
  declare("VirtualParameters.Upgrade", null, { value: "required" });
  log(PFX + `set Upgrade=required (current=${current}, target=${target})`);
} else {
  declare("VirtualParameters.Upgrade", null, { value: "done" });
  log(PFX + `set Upgrade=done (already at target ${target})`);
}
