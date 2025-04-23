import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter> {/* Router wraps AuthProvider and App */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
