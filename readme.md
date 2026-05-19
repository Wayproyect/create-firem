# create-firem

A modern CLI tool for quickly scaffolding new Firem project templates. 

## Usage

You can generate a new project interactively by running one of the following commands in your terminal:

```bash
npx create-firem
```

Or, using npm init:

```bash
npm init firem
```

*(The CLI will prompt you for project details, features to include, and automatically set up the boilerplate code.)*

## Development & Testing

If you want to contribute to this generator or test it locally, follow these steps:

1. Clone this repository.
2. Install the dependencies of the CLI itself:
   ```bash
   npm install
   ```

### Testing the Scaffolding & Templates Locally

You can test the scaffolding process using two methods:

#### Method A: Direct Execution (Recommended for quick iteration)
Run the generator script directly from the root of the repository:
```bash
node bin/index.js <test-project-name> [options]
```

Example commands to test different configurations:
- **Dashboard with Sidebar Layout**:
  ```bash
  node bin/index.js test-dashboard --template dashboard --layout sidebar
  ```
- **Landing Page with Top Nav & Auth**:
  ```bash
  node bin/index.js test-landing --template landing --layout top --auth true
  ```

#### Method B: Global Symlink
1. Link the package globally:
   ```bash
   npm link
   ```
2. Run `create-firem` anywhere on your machine to test the scaffolding:
   ```bash
   create-firem my-scaffolded-app
   ```
3. To clean up and unlink when done:
   ```bash
   npm unlink -g create-firem
   ```

### Verifying the Generated Template

Once a template is generated, enter its directory and run:
```bash
cd <generated-project-name>
npm install
npm run dev
```

Key aspects to verify:
1. **Routing Modes**: Open `src/config/routerConfig.js` and test toggling `ROUTER_MODE` between `'browser'` (BrowserRouter) and `'hash'` (HashRouter).
2. **Vite Chunk Splitting**: Run `npm run build` to verify that assets are split modularly into `vendor-mui`, `vendor-firebase`, `vendor-core`, etc., keeping the initial bundle sizes lightweight.
3. **Navigation Layouts**: Change navigation layout options (`top`, `bottom`, `sidebar`) during scaffolding to ensure they render and respond properly.

## Architecture

- **`bin/index.js`**: Contains the executable CLI entry point and scaffolding code (copying files, prompting users, rewriting package placeholders, and adjusting layouts).
- **`templates/`**: Contains the boilerplate files for the generated projects:
  - `common/`: Core configuration files (such as `firebase.ts`, MUI theme, and `AppRouter.jsx`) shared by all templates.
  - `basic/`: Minimal skeleton template.
  - `landing/`: Public-facing landing page layout.
  - `dashboard/`: Full persistent login administration panel.

## License

MIT
