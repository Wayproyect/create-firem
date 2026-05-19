# Technical Document for Agents (agents.md)

## Repository Purpose
The primary objective of this repository is to build and maintain the `create-firem` project generator. This tool is designed to be executed via standard Node package managers to quickly scaffold a new project template for users.

## Invocation Commands
The finished CLI tool will be invoked by end-users using either of the following commands:
- `npx create-firem`
- `npm init firem`

## Architecture & Structure
As an agent working on this repository, please adhere to the following architectural guidelines for building a modern CLI generator:

1. **CLI Entry Point**: The project must define a main executable script. This is typically configured in the `bin` field of the `package.json` file.
2. **Template Directory**: A dedicated directory (e.g., `template/` or `templates/`) should exist containing the base boilerplate code that will be copied to the target user directory.
3. **Interactivity**: The CLI should optionally prompt the user for relevant project details (e.g., project name, features to include, language preference) using tools like `inquirer` or `prompts`.
4. **Scaffolding Logic**: The tool should handle copying files, correctly renaming dotfiles (such as renaming a placeholder like `gitignore` to `.gitignore`, as npm strips `.gitignore` during publish), and modifying `package.json` placeholders based on user input.
5. **Dependencies**: Upon copying the template, the CLI should optionally install the required dependencies automatically or prompt the user if they'd like to install them.

## AI Agent Instructions
- **Code Style**: Maintain clean, modular JavaScript/TypeScript code.
- **Dependencies**: Keep dependencies to a minimum to ensure fast and reliable execution. Prefer built-in Node.js modules like `fs`, `path`, and `child_process` when possible.
- **Testing**: Ensure any scaffolding logic is thoroughly tested to prevent broken templates for the end-user.
- **Documentation**: Update `README.md` with clear instructions on how users can leverage the generated project and how contributors can maintain and update the template generator.

## Current State
The project generator CLI and base templates are fully functional:
- **CLI Scaffold Logic**: Completed (`bin/index.js`), with full support for interactive scaffolding and command flags (`--template`, `--layout`, `--auth`, `--install`). Includes layout flex direction adjustment for sidebar menus.
- **Templates**: Completed `basic`, `landing`, and `dashboard` templates under `templates/` with `react-router-dom` pre-configured.
- **SPA & Modular Rendering**: Pure Single Page Application (SPA) architecture implemented. Vite config includes advanced code splitting via Rollup manual chunks (`vendor-mui`, `vendor-firebase`, `vendor-core`, etc.) to keep initial bundle sizes lightweight.
- **Flexible Routing**: Pre-configured `AppRouter.jsx` wrapper reading from `routerConfig.js` to dynamically toggle between `'browser'` (BrowserRouter) and `'hash'` (HashRouter) routing modes.
- **Development Setup**: Root dependencies updated to include development packages (like `firebase`) to prevent editor resolution errors.
