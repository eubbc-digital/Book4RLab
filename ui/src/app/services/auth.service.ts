/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private csrfToken = '';
  private httpOptions = <any>{};

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    this.csrfToken = this.cookieService.get('csrftoken');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'response',
    };

    if (this.csrfToken) this.httpOptions.headers.csrfToken = this.csrfToken;
  }

  signUp(user: User): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.signup}`;
    return this.http
      .post(URL, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('signUp')));
  }

  login(user: User): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.login}`;
    return this.http
      .post(URL, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('login')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error && error.error)
        this.toastr.error(this.getServerErrorMessage(error), 'Error');

      return of(result as T);
    };
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    let errorMsg = 'A server error has ocurred please try later.';

    if (error.error['non_field_errors'])
      errorMsg = `${error.error['non_field_errors']}. Please check that your email and password are correct.`;
    else if (error.error['email']) errorMsg = error.error['email'];

    return errorMsg;
  }
}
