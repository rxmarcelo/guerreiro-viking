
import React from 'react';
import ReactDOM from 'react-dom/client';
import VikingLandingPage from '@/App';
import PaymentStatusPage from '@/PaymentStatusPage'; // Importe a nova página
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';

const AppRouter = () => {
  if (window.location.pathname.startsWith('/status-pagamento')) {
    return <PaymentStatusPage />;
  }
  return <VikingLandingPage />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster />
  </React.StrictMode>
);
  