import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const packagesToUpdate = [
  'firebase',
  'react',
  'react-dom',
  'react-router-dom',
  '@mui/material',
  '@mui/icons-material',
  '@emotion/react',
  '@emotion/styled',
  'vite',
  '@vitejs/plugin-react',
  '@types/react',
  '@types/react-dom'
];

function getLatestVersion(pkg) {
  try {
    return execSync(`npm view ${pkg} version`).toString().trim();
  } catch (error) {
    console.error(`Failed to get version for ${pkg}:`, error.message);
    return null;
  }
}

const rootDir = process.cwd();
const templatePaths = [
  path.join(rootDir, 'templates/basic/package.json'),
  path.join(rootDir, 'templates/landing/package.json'),
  path.join(rootDir, 'templates/dashboard/package.json')
];

const latestVersions = {};
for (const pkg of packagesToUpdate) {
  const version = getLatestVersion(pkg);
  if (version) {
    latestVersions[pkg] = `^${version}`;
  }
}

console.log('Latest resolved versions:', latestVersions);

let hasChanges = false;

// Update templates
for (const pjsonPath of templatePaths) {
  if (fs.existsSync(pjsonPath)) {
    const data = JSON.parse(fs.readFileSync(pjsonPath, 'utf8'));
    let fileChanged = false;

    if (data.dependencies) {
      for (const [dep, ver] of Object.entries(data.dependencies)) {
        if (latestVersions[dep] && latestVersions[dep] !== ver) {
          data.dependencies[dep] = latestVersions[dep];
          fileChanged = true;
        }
      }
    }

    if (data.devDependencies) {
      for (const [dep, ver] of Object.entries(data.devDependencies)) {
        if (latestVersions[dep] && latestVersions[dep] !== ver) {
          data.devDependencies[dep] = latestVersions[dep];
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(pjsonPath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Updated ${path.relative(rootDir, pjsonPath)}`);
      hasChanges = true;
    }
  }
}

// Update root package.json devDependencies (firebase)
const rootPjsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(rootPjsonPath)) {
  const rootData = JSON.parse(fs.readFileSync(rootPjsonPath, 'utf8'));
  let rootChanged = false;

  if (rootData.devDependencies && rootData.devDependencies.firebase && latestVersions['firebase']) {
    if (rootData.devDependencies.firebase !== latestVersions['firebase']) {
      rootData.devDependencies.firebase = latestVersions['firebase'];
      rootChanged = true;
    }
  }

  if (rootChanged) {
    fs.writeFileSync(rootPjsonPath, JSON.stringify(rootData, null, 2) + '\n');
    console.log('Updated root package.json devDependencies');
    hasChanges = true;
  }
}

if (hasChanges) {
  // Bump create-firem patch version to ensure npm publish works
  try {
    execSync('npm version patch --no-git-tag-version');
    console.log('Successfully bumped create-firem version');
  } catch (error) {
    console.error('Failed to bump version:', error.message);
  }
} else {
  console.log('All packages are already up-to-date!');
}
