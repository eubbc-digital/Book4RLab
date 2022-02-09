import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kit } from '../interfaces/kit';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class KitService {
  private url: string = `${config.api.baseUrl}${config.api.kits}`;

  constructor(private http: HttpClient) {}

  getKits(): Observable<Kit[]> {
    return this.http.get<Kit[]>(this.url);
  }
}
