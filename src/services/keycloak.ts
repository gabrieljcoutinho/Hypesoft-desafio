import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'hypesoft-realm',
  clientId: 'hypesoft-app',
});

export default keycloak;