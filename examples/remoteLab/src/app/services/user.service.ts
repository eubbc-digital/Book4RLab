import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import config from '../../config.json';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = config.api.baseUrl + config.api.users.me;

  constructor(private http: HttpClient) {}

  validateUserSession(): Observable<User> {
    return this.http.get<User>(this.url);
  }
}
