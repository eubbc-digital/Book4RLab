/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lab } from '../interfaces/lab';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class PublicLabsService {
  private url: string = `${config.api.baseUrl}${config.api['public-labs']}`;

  constructor(private http: HttpClient) { }

  getPublicLabs(): Observable<Lab[]> {
    return this.http.get<Lab[]>(this.url);
  }
}
