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
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ActivationData } from '../interfaces/activation-data';
import { ToastrService } from 'ngx-toastr';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpOptions = <any>{};

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'response',
    };
  }

  signUp(user: User): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.signup}`;
    return this.http
      .post(URL, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('signUp')));
  }

  activate(activationData: ActivationData): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.activate}`;
    return this.http
      .post(URL, activationData, this.httpOptions)
      .pipe(catchError(this.handleActivationError<ActivationData>('activate')));
  }

  login(user: User): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.login}`;
    return this.http
      .post(URL, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('login')));
  }

  requestInstructorAccess(data: any): Observable<any> {
    const URL = `${config.api.baseUrl}${config.api.users.instructorAccessRequest}`;
    return this.http.post(URL, data, this.httpOptions)
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error && error.error)
        this.toastr.error(this.getServerErrorMessage(error), 'Error');

      return of(result as T);
    };
  }

  private handleActivationError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error && error.error)
        this.toastr.error(this.getServerErrorMessage(error), 'Error');

      throw error;
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
