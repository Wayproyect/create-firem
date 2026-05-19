import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import { Box, Container } from '@mui/material';
import { AppRouter } from './components/AppRouter';

// Modular loading: lazy import the sub-views of the dashboard to keep the initial build lightweight
const DashboardOverview = React.lazy(() => import('./pages/DashboardOverview'));
const Profile = React.lazy(() => import('./pages/Profile'));

function DashboardLayout() {
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Navigation onLogout={logout} isAuthenticated={true} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pb: 10 }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

function MainApp() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Login />;
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter>
        <MainApp />
      </AppRouter>
    </AuthProvider>
  );
}
