/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isOwnApi(req.url)) return next.handle(req);

    return next.handle(this.withToken(req)).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401) return throwError(() => err);

        // Access token expired: renew it once and retry the same request
        return from(this.authService.refreshSession()).pipe(
          switchMap((renewed) => {
            if (renewed) return next.handle(this.withToken(req));

            if (/^\/booking\/\d+/.test(this.router.url))
              this.authService.login(this.router.url);
            return throwError(() => err);
          })
        );
      })
    );
  }

  private withToken(req: HttpRequest<any>): HttpRequest<any> {
    if (!this.authService.isLoggedIn()) return req;
    return req.clone({
      setHeaders: { Authorization: `Bearer ${this.authService.accessToken()}` },
    });
  }

  /** Only our own API receives the access token: relative URLs. */
  private isOwnApi(url: string): boolean {
    return !/^https?:\/\//.test(url);
  }
}
