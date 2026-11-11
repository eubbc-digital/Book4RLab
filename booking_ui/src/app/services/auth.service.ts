/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import config from '../config.json';

export interface InstructorRequestStatus {
  status: 'none' | 'pending' | 'approved';
  requested_at?: string;
}

export const authConfig: AuthConfig = {
  issuer: environment.auth.issuer,
  clientId: environment.auth.clientId,
  responseType: 'code',
  // Production issuer is HTTPS. Dev uses plain HTTP on the eeda-sso dev host, which the library rejects by default.
  requireHttps: environment.production,
  scope: 'openid profile email',
  redirectUri: document.baseURI,
  postLogoutRedirectUri: document.baseURI,
  // Silent SSO checks use iframes, which third-party cookie rules block across domains
  useSilentRefresh: false,
  sessionChecksEnabled: false,
  showDebugInformation: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private refreshing: Promise<boolean> | null = null;

  constructor(private oauth: OAuthService, private http: HttpClient) {
    this.oauth.configure(authConfig);
  }

  /**
   * Runs before the app renders (APP_INITIALIZER). Loads Keycloak metadata and
   * completes a login redirect. Never rejects, so an unreachable Keycloak still
   * lets anonymous pages load.
   */
  init(): Promise<void> {
    return this.oauth
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => undefined)
      .catch((error) => {
        console.error('Keycloak discovery failed', error);
      });
  }

  isLoggedIn(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  /** Renews the access token with the refresh token (no iframe, so it works across domains). */
  /**
   * Renew the access token. Requests that fail together share one refresh, so the
   * same refresh token is never sent twice (Keycloak may rotate it on use).
   */
  refreshSession(): Promise<boolean> {
    if (this.refreshing) return this.refreshing;
    if (!this.oauth.getRefreshToken()) return Promise.resolve(false);
    this.refreshing = this.oauth
      .refreshToken()
      .then(() => true)
      .catch(() => false)
      .finally(() => (this.refreshing = null));
    return this.refreshing;
  }

  accessToken(): string {
    return this.oauth.getAccessToken();
  }

  /** Path the user was on before signing in. Read once after the login redirect. */
  consumeReturnUrl(): string | null {
    const state = this.oauth.state;
    if (!state || !state.startsWith('/')) return null;
    this.oauth.state = '';
    return state;
  }

  login(returnUrl: string = '/labs'): void {
    this.oauth.initCodeFlow(returnUrl);
  }

  /** Opens Keycloak's self-registration form. Email verification happens there. */
  register(returnUrl: string = '/labs'): void {
    this.oauth.initCodeFlow(returnUrl, { prompt: 'create' });
  }

  logout(): void {
    this.oauth.logOut();
  }

  requestInstructorAccess(reason: string = ''): Observable<InstructorRequestStatus> {
    return this.http.post<InstructorRequestStatus>(
      `${config.api.baseUrl}${config.api.instructorRequest}`,
      { reason }
    );
  }

  getInstructorRequestStatus(): Observable<InstructorRequestStatus> {
    return this.http.get<InstructorRequestStatus>(
      `${config.api.baseUrl}${config.api.instructorRequest}`
    );
  }
}
