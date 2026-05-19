import React, { Suspense } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ROUTER_MODE } from '../config/routerConfig';

// Common fallback loader for Suspense during lazy chunk retrieval
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
    <h3>Loading...</h3>
  </div>
);

export function AppRouter({ children }) {
  // Select router type dynamically
  const Router = ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </Router>
  );
}
