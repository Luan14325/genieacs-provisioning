// Boolean-ish VP to mirror a tag in the GUI (handy for debugging CI runs).
let value;
if ("value" in args[1]) {
  value = args[1].value;
} else if ("value" in args[3]) {
  value = args[3].value;
} else {
  value = [0, "xsd:unsignedInt"]; // 0 or 1
}
return { writable: true, value };
