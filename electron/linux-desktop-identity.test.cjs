const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
);
const electronBuilderConfig = fs.readFileSync(
  path.join(repoRoot, 'electron-builder.yaml'),
  'utf8',
);
const linuxWrapper = fs.readFileSync(
  path.join(repoRoot, 'build', 'linux', 'snap-wrapper.sh'),
  'utf8',
);

const getMatch = (content, pattern, label) => {
  const match = content.match(pattern);
  assert.ok(match, `${label} must be configured`);
  return match[1];
};

test('Linux desktop identity stays consistent across packaging config', () => {
  const startupWmClass = getMatch(
    electronBuilderConfig,
    /^\s*StartupWMClass:\s*([^\s#]+)\s*$/m,
    'linux.desktop.entry.StartupWMClass',
  );
  const wrapperAppClass = getMatch(
    linuxWrapper,
    /^APP_CLASS="([^"]+)"\s*$/m,
    'APP_CLASS',
  );

  assert.equal(packageJson.desktopName, startupWmClass);
  assert.equal(packageJson.desktopName, wrapperAppClass);
});
