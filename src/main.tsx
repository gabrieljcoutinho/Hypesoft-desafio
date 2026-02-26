import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import keycloak from './services/keycloak';

keycloak.init({
  onLoad: 'login-required', // Isso obriga o login logo de cara
  checkLoginIframe: false
}).then((authenticated) => {
  if (authenticated) {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}).catch(() => {
  console.error("Erro ao autenticar no Keycloak");
});