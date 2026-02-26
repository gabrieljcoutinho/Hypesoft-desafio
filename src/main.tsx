import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ADICIONADO ISSO
import App from './App';
import './index.css';
import keycloak from './services/keycloak';

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256' // Recomendado para evitar erros de segurança
}).then((authenticated) => {
  if (authenticated) {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        {/* O BrowserRouter deve abraçar o App */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}).catch(() => {
  console.error("Erro ao autenticar no Keycloak");
});