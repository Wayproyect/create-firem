import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function DashboardOverview() {
  const { currentUser, logout } = useAuth();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome back, <strong>{currentUser?.email}</strong>! You are successfully authenticated.
      </Typography>
      <Button variant="contained" color="secondary" onClick={logout}>
        Sign Out
      </Button>
    </Paper>
  );
}
