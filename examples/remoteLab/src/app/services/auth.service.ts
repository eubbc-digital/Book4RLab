import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import config from '../../config.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private http: HttpClient, private toastr: ToastrService) {}

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
      this.toastr.error(
        'A server error has ocurred please try later.',
        'Error'
      );
      console.error(error);
      return of(result as T);
    };
  }
}
