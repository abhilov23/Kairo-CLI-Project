import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "src", "app", "api");
const LIB_DIR = path.join(ROOT, "src", "lib");

const results = { protected: [], unprotected: [], inconsistent: [], skipped: [] };

function routeFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...routeFiles(p));
    else if (e.name === "route.ts") files.push(p);
  }
  return files;
}

function read(p) { return fs.readFileSync(p, "utf-8"); }
function rp(p) { return path.relative(ROOT, p).split(path.sep).join("/"); }

function audit() {
  const authLib = path.join(LIB_DIR, "api-auth.ts");
  if (fs.existsSync(authLib) && /user_not_found/.test(read(authLib))) {
    results.protected.push(rp(authLib) + " (centralized check in lib)");
  }

  for (const fp of routeFiles(API_DIR)) {
    const p = rp(fp);
    const c = read(fp);

    if (/auth\s*\(\)/.test(c)) {
      if (/user_not_found/.test(c)) {
        results.protected.push(p + " (inline check)");
        if (!/error_description/.test(c)) {
          results.inconsistent.push({ file: p, issue: "Missing error_description" });
        }
      } else {
        results.unprotected.push({ file: p, reason: "Uses auth() but no user_not_found check" });
      }
    } else if (/getUserIdFromRequest/.test(c)) {
      results.protected.push(p + " (via getUserIdFromRequest)");
    } else {
      results.skipped.push({ file: p, reason: "No auth dependency" });
    }
  }
}

function report() {
  const ln = "-".repeat(58);
  console.log("\n" + "=".repeat(58));
  console.log("  API Route User-Existence Audit");
  console.log("=".repeat(58));

  console.log("\nProtected (" + results.protected.length + "):");
  console.log(ln);
  results.protected.forEach(function(i) { console.log("   [OK]  " + i); });

  console.log("\nUnprotected (" + results.unprotected.length + "):");
  console.log(ln);
  results.unprotected.length === 0
    ? console.log("   (none)")
    : results.unprotected.forEach(function(i) { console.log("   [!!]  " + i.file + " - " + i.reason); });

  console.log("\nFormat issues (" + results.inconsistent.length + "):");
  console.log(ln);
  results.inconsistent.length === 0
    ? console.log("   (none)")
    : results.inconsistent.forEach(function(i) { console.log("   [!]   " + i.file + " - " + i.issue); });

  console.log("\nSkipped (" + results.skipped.length + "):");
  console.log(ln);
  results.skipped.forEach(function(i) { console.log("   [-]   " + i.file + " - " + i.reason); });

  console.log("\n" + "=".repeat(58));
  console.log(
    "  " + results.protected.length + " protected, " +
    results.unprotected.length + " unprotected, " +
    results.inconsistent.length + " format issues, " +
    results.skipped.length + " skipped"
  );

  if (results.unprotected.length > 0 || results.inconsistent.length > 0) {
    console.log("  Result: FAIL - issues found.\n");
    process.exit(1);
  }
  console.log("  Result: PASS - all routes consistent.\n");
}

audit();
report();
