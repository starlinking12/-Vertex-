import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3ModalProvider } from './components/wallet/Web3Modal';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3ModalProvider>
      <App />
      <Toaster position="bottom-right" />
    </Web3ModalProvider>
  </React.StrictMode>
);