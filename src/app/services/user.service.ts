import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import data from '../data.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUserData(): User {
    return data.user;
  }
}
