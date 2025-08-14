// String state VP: "ready" | "required" | "done" | "failed"
// Writable so provisions/presets can move the state. Default: "ready".
let value;

if ("value" in args[1]) {
  value = args[1].value;
} else if ("value" in args[3]) {
  value = args[3].value;
} else {
  value = ["ready", "xsd:string"];
}

return { writable: true, value };
