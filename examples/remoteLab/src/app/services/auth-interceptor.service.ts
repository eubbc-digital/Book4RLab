import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import config from '../../config.json';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private route: ActivatedRoute, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `token ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          console.log(err);

          const accessIdParam = config.urlParams.accessKey;
          const passwordParam = config.urlParams.password;

          const accessId = this.route.snapshot.queryParamMap.get(accessIdParam);
          const password = this.route.snapshot.queryParamMap.get(passwordParam);

          let routerLink = '/access';

          if (accessId && password) {
            routerLink += `?${accessIdParam}=${accessId}&${passwordParam}=${password}`;
          }

          this.router.navigateByUrl(routerLink);
        }

        return throwError(err);
      })
    );
  }
}
