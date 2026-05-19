# Specification: Command-Line Interface (`cli.md`)

This document specifies the behavior, interactive prompt flow, and command-line options for the `create-firem` CLI generator.

---

## 1. CLI Commands & Arguments
Users can run the generator with options directly from the CLI or follow the interactive prompts.

### Command Syntax
```bash
npx create-firem [project-name] [options]
```

### Options (CLI Flags)
- `--template <type>`: Skip prompt and select template: `dashboard`, `landing`, or `basic`.
- `--layout <type>`: Skip prompt and select navigation layout: `top`, `bottom`, `sidebar`, or `none`.
- `--auth <boolean>`: Skip prompt and enable/disable Firebase authentication (relevant for `landing`).
- `--install`: Automatically install dependencies after scaffolding.
- `--help` / `-h`: Display help documentation.

---

## 2. Interactive Prompt Flow

If the CLI is run without arguments, it will guide the user through the following questions using `prompts` or `inquirer`.

### Step 1: Project Name
- **Prompt**: `What is the name of your project?`
- **Type**: Input text
- **Default**: `my-firem-app`
- **Validation**: Must be a valid npm package name (lowercase, no spaces, URL-safe characters).

### Step 2: Template Type
- **Prompt**: `Select a template type:`
- **Type**: Select list
- **Options**:
  - 📊 **Dashboard**: Includes Firebase Auth with persistent session login, dashboard panels, and protected routes.
  - 🚀 **Landing Page**: Public frontend landing page, loads directly, with an optional configuration to add authentication.
  - 📦 **Basic**: A minimal skeleton project with React, Firebase SDK configured, and MUI installed.

### Step 3: Firebase Authentication (Conditional)
- **Condition**: Only prompt if **Landing Page** was selected in Step 2.
- **Prompt**: `Do you want to include Firebase Authentication in your Landing Page?`
- **Type**: Confirm (Yes/No)
- **Default**: `No`

### Step 4: Layout Navigation Menu Position
- **Prompt**: `Where should the main navigation menu be positioned?`
- **Type**: Select list
- **Options**:
  - ⬆️ **Top (Superior)**: A classic horizontal navbar at the header.
  - ⬇️ **Bottom (Inferior)**: Ideal for mobile-first layouts, showing a bottom navigation bar.
  - ⬅️ **Sidebar (Lateral)**: A modern collapsible sidebar navigation drawer on the left side.
  - ❌ **None (Sin menú)**: No navigation menu will be rendered (useful for clean/minimal setups).

---

## 3. Scaffolding & Customization Logic

Based on the selections made during the prompts, the CLI performs the following changes:

### A. Template Choice Implementation
- **Dashboard**: Copies dashboard-specific components (e.g. `Login.jsx`, `DashboardLayout.jsx`, persistent auth context in `AuthContext.jsx`).
- **Landing**: Copies public-facing homepage component (`LandingPage.jsx`). If auth was selected, includes a modal/page for login and hooks to Firebase Auth.
- **Basic**: Copies a minimal main page and sets up Vite + MUI + Firebase config without views.

### B. Layout Menu Customization
The CLI will copy or modify the navigation layout component (`src/components/Navigation.jsx`) according to the user's choice:
- **`top`**: Generates a component using MUI's `AppBar` and `Toolbar`.
- **`bottom`**: Generates a component using MUI's `BottomNavigation` and `BottomNavigationAction`.
- **`sidebar`**: Generates a component using MUI's `Drawer` and `List` with `ListItem`.
- **`none`**: Generates a stub component that returns `null` (rendering no navigation menu).

---

## 4. Dependencies of the CLI Tool

To ensure a lightweight and beautiful CLI execution, the CLI itself will use:
- **`prompts`**: For fast, user-friendly interactive prompts.
- **`kolorist`**: For terminal text coloring.
- **`ora`**: For loading spinners during dependency installation.
- **`commander`**: For option/flag parsing.
