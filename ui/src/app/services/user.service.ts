/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = `${config.api.baseUrl}${config.api.users.me}`;

  constructor(private httpClient: HttpClient) {}

  getUserData(): Observable<User> {
    return this.httpClient.get<User>(this.url);
  }
}
