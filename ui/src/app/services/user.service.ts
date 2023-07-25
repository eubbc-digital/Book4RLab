/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  

  private httpOptions = <any>{};

  constructor(private httpClient: HttpClient,private toastr: ToastrService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'response',
    };
  }

  getUserData(): Observable<User> {
    const URL: string = `${config.api.baseUrl}${config.api.users.me}`;
    return this.httpClient.get<User>(URL);
  }

  updateUserData(user:User): Observable<any> {
    const URL :string = `${config.api.baseUrl}${config.api.users.me}`;
    return this.httpClient.
    patch(URL,user,this.httpOptions).
    pipe(catchError(this.handleError<User>('updateData')));
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
