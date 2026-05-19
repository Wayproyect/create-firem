import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navigation from './components/Navigation';
import { AppRouter } from './components/AppRouter';

function App() {
  return (
    <AppRouter>
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <Navigation isAuthenticated={false} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="sm">
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Firem (Basic Template)
              </Typography>
              <Typography variant="body1">
                ReactJS + Firebase + Material UI are configured and ready.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </AppRouter>
  );
}

export default App;
