const PFX = "bootstrap: ";

// Read/cache
const cur = declare("Device.DeviceInfo.SoftwareVersion", { value: 1 }).value?.[0];
declare("VirtualParameters.SoftwareVersionTarget", { value: 1 });
declare("VirtualParameters.Upgrade", { value: 1 });

// Initialize Upgrade VP to "ready" (your bootstrap rule)
declare("VirtualParameters.Upgrade", null, { value: "ready" });

// (Optional) initialize helpers
declare("VirtualParameters.Upgrading", { value: 1 });
declare("VirtualParameters.Upgrading", null, { value: 0 });

log(PFX + "initialized Upgrade=ready; cached all VPs");
