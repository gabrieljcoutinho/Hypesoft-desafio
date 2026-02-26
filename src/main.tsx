import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './services/keycloak';

keycloak.init({
  onLoad: 'login-required', // Obriga o login antes de mostrar qualquer coisa
  checkLoginIframe: false
}).then((authenticated) => {
  if (authenticated) {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}).catch((error) => {
  console.error("Erro na autenticação:", error);
});