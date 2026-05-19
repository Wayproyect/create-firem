#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import { blue, green, red, yellow, bold, cyan } from 'kolorist';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('create-firem')
  .description('Scaffold a new React + Firebase + Material-UI project')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <type>', 'Template type: dashboard, landing, basic')
  .option('-l, --layout <position>', 'Navigation layout: top, bottom, sidebar, none')
  .option('-a, --auth <boolean>', 'Include authentication (for landing template)')
  .option('--install', 'Automatically install dependencies')
  .parse(process.argv);

async function main() {
  console.log(cyan(bold('\n🔥 Welcome to create-firem! Scaffold React + Firebase + MUI in seconds.\n')));

  const args = program.args;
  const options = program.opts();

  let targetDir = args[0];
  let template = options.template;
  let layout = options.layout;
  let includeAuth = options.auth !== undefined ? options.auth === 'true' : null;

  // Prompt for project name if not provided
  if (!targetDir) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is the name of your project?',
      initial: 'my-firem-app',
      validate: (value) => {
        const pattern = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
        return pattern.test(value) ? true : 'Invalid package.json name';
      }
    });

    if (!response.projectName) {
      console.log(yellow('\nOperation cancelled.'));
      process.exit(0);
    }
    targetDir = response.projectName;
  }

  // Prompt for template type if not provided
  if (!template) {
    const response = await prompts({
      type: 'select',
      name: 'template',
      message: 'Select a template type:',
      choices: [
        { title: '📊 Dashboard (Firebase Auth, Persistent Login, Admin View)', value: 'dashboard' },
        { title: '🚀 Landing Page (Direct load, Optional Auth)', value: 'landing' },
        { title: '📦 Basic (Minimal skeleton)', value: 'basic' }
      ]
    });

    if (!response.template) {
      console.log(yellow('\nOperation cancelled.'));
      process.exit(0);
    }
    template = response.template;
  }

  // Prompt for auth conditionally (Landing template only)
  if (template === 'landing' && includeAuth === null) {
    const response = await prompts({
      type: 'confirm',
      name: 'includeAuth',
      message: 'Do you want to include Firebase Authentication in your Landing Page?',
      initial: false
    });

    includeAuth = response.includeAuth;
  } else if (template === 'dashboard') {
    includeAuth = true; // Dashboard always includes auth
  } else if (template === 'basic') {
    includeAuth = false; // Basic is minimal
  }

  // Prompt for navigation layout position if not provided
  if (!layout) {
    const response = await prompts({
      type: 'select',
      name: 'layout',
      message: 'Where should the main navigation menu be positioned?',
      choices: [
        { title: '⬆️ Top (Superior)', value: 'top' },
        { title: '⬇️ Bottom (Inferior - Mobile first)', value: 'bottom' },
        { title: '⬅️ Sidebar (Lateral)', value: 'sidebar' },
        { title: '❌ None (Sin menú)', value: 'none' }
      ]
    });

    if (!response.layout) {
      console.log(yellow('\nOperation cancelled.'));
      process.exit(0);
    }
    layout = response.layout;
  }

  const rootPath = path.resolve(targetDir);

  if (fs.existsSync(rootPath)) {
    const overwriteResponse = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory '${targetDir}' already exists. Overwrite?`,
      initial: false
    });

    if (!overwriteResponse.overwrite) {
      console.log(red('\nAborted.'));
      process.exit(1);
    }
    fs.rmSync(rootPath, { recursive: true, force: true });
  }

  fs.mkdirSync(rootPath, { recursive: true });

  const spinner = ora('Scaffolding project...').start();

  try {
    const templatesDir = path.join(__dirname, '../templates');
    
    // Copy common templates
    copyDir(path.join(templatesDir, 'common'), rootPath);

    // Copy template-specific files
    copyDir(path.join(templatesDir, template), rootPath);

    // Dynamic Navigation template setup based on layout selection
    setupNavigation(rootPath, layout);

    // Dynamic Auth setup
    setupAuth(rootPath, includeAuth, template);

    // Configure layout flex direction in App.jsx if layout is sidebar
    const appPath = path.join(rootPath, 'src/App.jsx');
    if (fs.existsSync(appPath) && layout === 'sidebar') {
      let content = fs.readFileSync(appPath, 'utf8');
      content = content.replace(/flexDirection:\s*'column'/g, "flexDirection: 'row'");
      fs.writeFileSync(appPath, content);
    }

    // Setup package.json name and other details
    const pkgPath = path.join(rootPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      let pkgContent = fs.readFileSync(pkgPath, 'utf8');
      pkgContent = pkgContent.replace(/{{PROJECT_NAME}}/g, path.basename(rootPath));
      fs.writeFileSync(pkgPath, pkgContent);
    }

    // Setup index.html title and details
    const indexPath = path.join(rootPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      indexContent = indexContent.replace(/{{PROJECT_NAME}}/g, path.basename(rootPath));
      fs.writeFileSync(indexPath, indexContent);
    }

    // Rename gitignore to .gitignore
    const gitignorePath = path.join(rootPath, 'gitignore');
    if (fs.existsSync(gitignorePath)) {
      fs.renameSync(gitignorePath, path.join(rootPath, '.gitignore'));
    }


    spinner.succeed(green('Project scaffolded successfully!'));

    let autoInstall = options.install;
    if (!autoInstall) {
      const installResponse = await prompts({
        type: 'confirm',
        name: 'install',
        message: 'Do you want to run "npm install" now?',
        initial: true
      });
      autoInstall = installResponse.install;
    }

    if (autoInstall) {
      const installSpinner = ora('Installing dependencies (this might take a minute)...').start();
      try {
        execSync('npm install', { cwd: rootPath, stdio: 'ignore' });
        installSpinner.succeed(green('Dependencies installed successfully!'));
      } catch (err) {
        installSpinner.fail(red('Failed to install dependencies. You can run "npm install" manually.'));
      }
    }

    console.log(cyan('\nDone! To get started:'));
    console.log(cyan(`  cd ${targetDir}`));
    if (!autoInstall) {
      console.log(cyan('  npm install'));
    }
    console.log(cyan('  npm run dev\n'));

  } catch (error) {
    spinner.fail(red('Error scaffolding project.'));
    console.error(error);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function setupNavigation(rootPath, layout) {
  const navComponentPath = path.join(rootPath, 'src/components/Navigation.jsx');
  
  // Custom navigation content based on selection
  let navContent = '';

  if (layout === 'top') {
    navContent = `import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navigation({ onLogout, isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Firem App
        </Typography>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}`;
  } else if (layout === 'bottom') {
    navContent = `import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navigation({ onLogout, isAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getIndexFromPath = (path) => {
    if (path === '/profile') return 1;
    return 0;
  };

  const value = getIndexFromPath(location.pathname);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue === 0) {
            navigate('/');
          } else if (newValue === 1) {
            navigate('/profile');
          } else if (newValue === 2 && isAuthenticated) {
            onLogout();
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        {isAuthenticated && <BottomNavigationAction label="Logout" icon={<ExitToAppIcon />} />}
      </BottomNavigation>
    </Paper>
  );
}`;
  } else if (layout === 'sidebar') {
    navContent = `import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Navigation({ onLogout, isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        \`& .MuiDrawer-paper\`: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Firem App
        </Box>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        {isAuthenticated && (
          <ListItem button onClick={onLogout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}`;
  } else if (layout === 'none') {
    navContent = `import React from 'react';

export default function Navigation() {
  return null;
}`;
  }

  // Create src/components if not exists
  fs.mkdirSync(path.dirname(navComponentPath), { recursive: true });
  fs.writeFileSync(navComponentPath, navContent);
}

function setupAuth(rootPath, includeAuth, template) {
  if (template === 'landing') {
    const appPath = path.join(rootPath, 'src/App.jsx');
    if (fs.existsSync(appPath)) {
      let content = fs.readFileSync(appPath, 'utf8');
      if (!includeAuth) {
        // Remove auth features from app
        content = content.replace(/\/\* AUTH_START \*\/([\s\S]*?)\/\* AUTH_END \*\//g, '');
        // Enable AUTH_NO block
        content = content.replace(/\/\* AUTH_NO_START \*\/([\s\S]*?)\/\* AUTH_NO_END \*\//g, (match, p1) => {
          return p1.replace(/\/\/\s?/g, '');
        });
        
        // Remove context directory since auth isn't needed
        const authCtxPath = path.join(rootPath, 'src/context');
        if (fs.existsSync(authCtxPath)) {
          fs.rmSync(authCtxPath, { recursive: true, force: true });
        }
      } else {
        // Keep them, clean up tags
        content = content.replace(/\/\* AUTH_START \*\//g, '');
        content = content.replace(/\/\* AUTH_END \*\//g, '');
        // Remove AUTH_NO block
        content = content.replace(/\/\* AUTH_NO_START \*\/([\s\S]*?)\/\* AUTH_NO_END \*\//g, '');
      }
      fs.writeFileSync(appPath, content);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
