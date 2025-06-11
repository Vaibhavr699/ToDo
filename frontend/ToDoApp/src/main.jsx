// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// Initialize TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create router with future flags
const router = {
    future: {
      v7_relativeSplatPath: true,
    v7_startTransition: true
  }
};

// Render the root
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={router.future}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
