# Specification: Firebase Configuration (`firebase.ts`)

This specification defines how Firebase must be integrated and initialized within the generated templates. To ensure simplicity and eliminate configuration layers, all templates must utilize a unified `firebase.ts` file with direct (hardcoded) configurations.

---

## 1. File Location
The Firebase configuration file must always be placed at:
```text
src/config/firebase.ts
```

---

## 2. Dependencies
The generated projects must have the `firebase` package installed:
- `firebase`: `^10.0.0` or higher.

---

## 3. Configuration & Exports
The `firebase.ts` file initializes the Firebase application using a direct configuration constant and exports the required services (Authentication and Firestore database). No environment variables (`.env`) are used.

### File Template (`src/config/firebase.ts`)
```typescript
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Define the structure of the configuration object
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Hardcoded Firebase configuration object
const firebaseConfig: FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize and export services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
```

---

## 4. Security & Verification
- **Configuration Values**: The initial scaffold contains placeholder strings (e.g., `"YOUR_API_KEY"`). The developer must replace these placeholders directly in `firebase.ts` with their project's credentials.
- **Strict Typing**: All services (`auth`, `db`) and configuration values must be explicitly or implicitly typed using Firebase's TypeScript definitions.
