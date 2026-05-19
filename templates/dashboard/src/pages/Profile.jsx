import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          <strong>Email:</strong> {currentUser?.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>UID:</strong> {currentUser?.uid}
        </Typography>
      </Box>
    </Paper>
  );
}
