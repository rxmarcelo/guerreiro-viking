
import React from 'react';
import ReactDOM from 'react-dom/client';
import VikingLandingPage from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VikingLandingPage />
    <Toaster />
  </React.StrictMode>
);
  