const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, readdirSync } = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
function sourceFiles(directory) {
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const relative = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(relative) : [relative];
  });
}

test("source and configuration files contain no unresolved merge markers", () => {
  const files = [
    ...["app", "components", "lib", "dictionaries"].flatMap(sourceFiles),
    ...readdirSync(root).filter(name => /\.(json|mjs|ts|md)$/.test(name)),
    ".env.example", ".gitignore",
  ];
  const broken = files.filter(file => /^(?:<{7} |={7}\s*$|>{7} )/m.test(readFileSync(path.join(root, file), "utf8")));
  assert.deepEqual(broken, [], `Unresolved conflict markers: ${broken.join(", ")}`);
});

test("package manifests are valid JSON and use the same dependency versions", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const lockfile = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"));
  assert.equal(lockfile.name, manifest.name);
  assert.deepEqual(lockfile.packages[""].dependencies, manifest.dependencies);
  assert.deepEqual(lockfile.packages[""].devDependencies, manifest.devDependencies);
});

test("only one Next.js configuration is present", () => {
  assert.deepEqual(readdirSync(root).filter(name => /^next\.config\.(?:js|mjs|ts|mts)$/.test(name)), ["next.config.mjs"]);
});
