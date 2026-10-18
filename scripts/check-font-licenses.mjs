import { readFileSync } from "node:fs";

const requiredClauses = [
  "SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007",
  "PERMISSION & CONDITIONS",
  "TERMINATION",
  "DISCLAIMER"
];
const licenses = [
  { path: "public/fonts/NotoSerifJP-LICENSE-OFL.txt", copyright: "Copyright 2012 Google Inc. All Rights Reserved." },
  { path: "public/fonts/PlusJakartaSans-LICENSE-OFL.txt", copyright: "Copyright 2020 The Plus Jakarta Sans Project Authors" },
  { path: "public/fonts/Vazirmatn-LICENSE-OFL.txt", copyright: "Copyright 2015 The Vazirmatn Project Authors" }
];

const failures = [];
for (const license of licenses) {
  let content;
  try {
    content = readFileSync(license.path, "utf8");
  } catch {
    failures.push(license.path + ": missing license file");
    continue;
  }
  if (!content.includes(license.copyright)) failures.push(license.path + ": required copyright-holder notice is missing");
  for (const clause of requiredClauses) {
    if (!content.includes(clause)) failures.push(license.path + ": missing OFL clause " + JSON.stringify(clause));
  }
}

if (failures.length > 0) {
  console.error("Font license notice check failed:\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("Font license notice check passed for " + licenses.length + " bundled font families.");
}
