import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { environment } from './environment';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
const clientId = environment.GG_CLIENT_ID;

root.render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
reportWebVitals();