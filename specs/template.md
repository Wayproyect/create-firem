# Specification: Template Configuration (`template.md`)

This document defines the structure, core libraries, and configuration rules for the base project template distributed by `create-firem`. The generated template is pre-configured to build web applications using React, Firebase, and Material UI (MUI).

---

## 1. Core Stack
The template must include and pre-configure the following technologies:
- **Frontend Framework**: ReactJS (bootstrapped with [Vite](https://vite.dev/) for optimal performance).
- **Styling & UI Components**: Material UI (MUI) v5+ (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`).
- **Backend & Services**: Firebase SDK v10+ (Authentication, Firestore, Storage, and Analytics).

---

## 2. Directory Structure of the Template
The template is housed inside the `template/` directory of the generator. When copied to the target user directory, it should look like this:

```text
template/
├── src/
│   ├── assets/           # Images, SVG icons, and static assets
│   ├── components/       # Common reusable MUI components
│   ├── config/
│   │   └── firebase.ts   # Firebase initialization & exports (auth, db, etc.)
│   ├── theme/
│   │   └── theme.js      # Custom MUI theme (colors, typography)
│   ├── App.jsx           # Main layout containing theme provider and routing
│   └── main.jsx          # App entry point (mounting React to the DOM)
├── gitignore             # Placeholder (renamed to .gitignore by CLI)
├── index.html            # Main HTML document template
├── package.json          # Package definition with placeholders
└── vite.config.js        # Vite configuration with React support
```

---

## 3. Libraries and Dependencies (`package.json`)

The template's `package.json` should contain at least the following dependencies:

```json
{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.11.0",
    "@mui/material": "^5.11.0",
    "firebase": "^10.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "vite": "^5.0.0"
  }
}
```

---

## 4. Integration Details

### A. Firebase Setup (`src/config/firebase.ts`)
Initialize Firebase using a direct configuration constant, with TypeScript typings:

```typescript
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;
```

### B. Material UI Theme & Provider (`src/theme/theme.js` & `src/App.jsx`)
Configure a basic customizable MUI theme:

**`src/theme/theme.js`**:
```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize primary color
    },
    secondary: {
      main: '#9c27b0', // Customize secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
```

**`src/App.jsx`**:
```jsx
import React from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Box } from '@mui/material';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Firem Template!
          </Typography>
          <Typography variant="body1">
            ReactJS + Firebase + Material UI are ready to go.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
```

---

## 5. Scaffold Replacement Rules
During the creation process, the CLI generator must apply these transformations:
1. **Placeholder Replacement**: Replace all occurrences of `{{PROJECT_NAME}}` in `package.json` and `index.html` with the name chosen by the user.
2. **Rename Dotfiles**: Rename `gitignore` in the template folder to `.gitignore` when writing to the target project directory.
