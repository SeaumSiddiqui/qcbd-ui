import Keycloak from 'keycloak-js';
import { authConfig } from '../config/auth';

class KeycloakService {
  private keycloak: Keycloak | null = null;
  private initialized = false;
  private initPromise: Promise<boolean> | null = null;
  private refreshInterval: number | null = null;
  private retryCount = 0;
  private readonly maxRetries = 2;
  private readonly retryDelay = 1000;
  private visibilityHandler: (() => void) | null = null;

  async init(): Promise<boolean> {
    if (this.initialized) return !!this.keycloak?.authenticated;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.performInit();
    return this.initPromise;
  }

  private async performInit(): Promise<boolean> {
    try {
      console.log('Initializing Keycloak with config:', authConfig);
      
      this.keycloak = new Keycloak({
        url: authConfig.url,
        realm: authConfig.realm,
        clientId: authConfig.clientId,
      });

      this.keycloak.onAuthError = (errorData) => {
        console.error('Keycloak auth error:', errorData);
      };

      // Use 'check-sso' for public access without forcing login
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        enableLogging: true,
        useNonce: false,
        redirectUri: window.location.origin,
        flow: 'standard'
      });

      this.initialized = true;
      this.retryCount = 0;
      
      console.log('Keycloak initialized. Authenticated:', authenticated);
      
      if (authenticated) this.setupTokenRefresh();
      return authenticated;
    } catch (error) {
      console.error('Keycloak init error:', error);
      this.reset();
      
      this.retryCount++;
      if (this.retryCount <= this.maxRetries) {
        console.log(`Retrying in ${this.retryDelay}ms (${this.retryCount}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * this.retryCount));
        return this.performInit();
      }
      
      console.error(`Initialization failed after ${this.maxRetries} attempts`);
      return false;
    }
  }

  private setupTokenRefresh(): void {
    if (!this.keycloak) return;

    // Clear existing interval
    if (this.refreshInterval !== null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    // Refresh token 5 seconds before it expires
    const refreshToken = () => {
      if (this.keycloak?.authenticated) {
        this.keycloak.updateToken(5).catch(error => {
          console.error('Token refresh failed:', error);
          this.logout();
        });
      }
    };

    // Set up periodic refresh
    this.refreshInterval = window.setInterval(refreshToken, 30000);
    
    // Create and store handler reference
    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') refreshToken();
    };
    
    // Add event listener with stored reference
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // Login
  async login(): Promise<void> {
    if (!this.keycloak) await this.init();
    if (!this.keycloak) return;

    try {
      await this.keycloak.login({
        redirectUri: window.location.origin,
        prompt: 'login'
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    if (!this.keycloak) {
      console.warn('Keycloak not initialized during logout');
      return;
    }

    try {
      console.log('Logging out...');
      
      // Clear refresh interval
      if (this.refreshInterval !== null) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
      
      // Remove visibility change handler
      if (this.visibilityHandler) {
        document.removeEventListener('visibilitychange', this.visibilityHandler);
        this.visibilityHandler = null;
      }

      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect to home even if logout fails
      window.location.href = '/';
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }

  // Get current user info
  getUser() {
    if (!this.isAuthenticated() || !this.keycloak?.tokenParsed) {
      return null;
    }

    const token = this.keycloak.tokenParsed as any;
    
    // Extract roles from realm_access and resource_access
    const realmRoles = token.realm_access?.roles || [];
    const clientRoles = token.resource_access?.[authConfig.clientId]?.roles || [];
    const allRoles = [...realmRoles, ...clientRoles];

    return {
      id: token.sub,
      username: token.preferred_username,
      email: token.email,
      firstName: token.given_name,
      lastName: token.family_name,
      roles: allRoles,
      permissions: allRoles
    };
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles.includes(role) || false;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Check if user is beneficiary
  isUser(): boolean {
    return this.hasRole('app-user');
  }

  // Check if user is agent
  isAgent(): boolean {
    return this.hasRole('app-agent');
  }

  // Check if user is authenticator
  isAuthenticator(): boolean {
    return this.hasRole('app-authenticator');
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('app-admin');
  }

  // Get authorization header for API calls
  getAuthHeader(): { Authorization: string } | {} {
    if (this.isAuthenticated() && this.keycloak?.token) {
      return { Authorization: `Bearer ${this.keycloak.token}` };
    }
    return {};
  }

  // Get Keycloak instance
  getKeycloak(): Keycloak | null {
    return this.keycloak;
  }

  // Get token for manual use
  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  // Reset service (for testing purposes)
  reset(): void {
    if (this.refreshInterval !== null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    // Remove event listener using stored reference
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    
    if (this.keycloak) {
      try {
        this.keycloak.clearToken();
      } catch (e) {
        console.warn('Token clear error:', e);
      }
      this.keycloak = null;
    }
    
    this.initialized = false;
    this.initPromise = null;
  }
}

export const keycloakService = new KeycloakService();