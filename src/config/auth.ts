// Helper function to get environment variables with proper typing
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue: string): string => {
  const value = import.meta.env[key];
  return value || defaultValue;
};

// Get current environment
const isProduction = getEnvVar('VITE_APP_ENV', 'development') === 'production';

// Keycloak configuration from environment variables
export const authConfig = {
  url: getEnvVar('VITE_KEYCLOAK_URL', 'x'),
  realm: getEnvVar('VITE_KEYCLOAK_REALM', 'x'),
  clientId: getEnvVar('VITE_KEYCLOAK_CLIENT_ID', 'x')
};

// Keycloak URLs
export const keycloakUrls = {
  auth: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/auth`,
  token: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`,
  userInfo: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/userinfo`,
  logout: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/logout`
};

// // Get current environment
// const isProduction = getEnvVar('VITE_APP_ENV', 'development') === 'production';

// // Keycloak configuration from environment variables
// export const authConfig = {
//   url: getEnvVar('VITE_KEYCLOAK_URL', 'http://localhost:8080'),
//   realm: getEnvVar('VITE_KEYCLOAK_REALM', 'qc-realm'),
//   clientId: getEnvVar('VITE_KEYCLOAK_CLIENT_ID', 'qc-ui')
// };

// // Keycloak URLs
// export const keycloakUrls = {
//   auth: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/auth`,
//   token: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`,
//   userInfo: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/userinfo`,
//   logout: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/logout`
// };

// OAuth2 configuration
export const oauthConfig = {
  clientId: authConfig.clientId,
  redirectUri: `${window.location.origin}/auth/callback`,
  responseType: 'code',
  scope: 'openid profile email',
  grantType: 'authorization_code'
};

// Qatar Charity Bangladesh roles
export const roles = {
  USER: 'app-user',
  AGENT: 'app-agent',
  AUTHENTICATOR: 'app-authenticator',
  ADMIN: 'app-admin'
};

// Environment info for debugging
export const envInfo = {
  isProduction,
  environment: getEnvVar('VITE_APP_ENV', 'development'),
  keycloakUrl: authConfig.url,
  realm: authConfig.realm,
  clientId: authConfig.clientId
};

// Log configuration in development
if (!isProduction) {
  console.log('🔐 Auth Configuration:', {
    environment: envInfo.environment,
    keycloakUrl: authConfig.url,
    realm: authConfig.realm,
    clientId: authConfig.clientId,
    urls: keycloakUrls
  });
}