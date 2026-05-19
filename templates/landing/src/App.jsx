import React, { useState } from 'react';
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import Navigation from './components/Navigation';
import { AppRouter } from './components/AppRouter';
/* AUTH_START */
import { AuthProvider, useAuth } from './context/AuthContext';
/* AUTH_END */

function LandingContent() {
  /* AUTH_START */
  const { currentUser, logout, login } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setOpenLogin(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Login failed. Please check credentials or Firebase setup.');
    }
    setLoading(false);
  };
  /* AUTH_END */

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation 
        /* AUTH_START */
        onLogout={logout} 
        isAuthenticated={!!currentUser} 
        /* AUTH_END */
        /* AUTH_NO_START */
        // isAuthenticated={false}
        /* AUTH_NO_END */
      />
      
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4, textAlign: 'center', pb: 10 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary">
            Welcome to Firem Landing
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A high-performance landing template using React, Material UI, and Firebase.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" size="large">
              Get Started
            </Button>
            
            {/* AUTH_START */}
            {!currentUser ? (
              <Button variant="outlined" size="large" onClick={() => setOpenLogin(true)}>
                Sign In
              </Button>
            ) : (
              <Button variant="outlined" color="secondary" size="large" onClick={logout}>
                Sign Out ({currentUser.email})
              </Button>
            )}
            {/* AUTH_END */}
          </Box>
        </Box>
      </Container>

      {/* AUTH_START */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sign In</DialogTitle>
        <form onSubmit={handleLoginSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="dense"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="dense"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenLogin(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>Sign In</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* AUTH_END */}
    </Box>
  );
}

/* AUTH_START */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter>
        <LandingContent />
      </AppRouter>
    </AuthProvider>
  );
}
/* AUTH_END */
/* AUTH_NO_START */
// export default function App() {
//   return (
//     <AppRouter>
//       <LandingContent />
//     </AppRouter>
//   );
// }
/* AUTH_NO_END */
