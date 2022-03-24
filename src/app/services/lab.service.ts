import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lab } from '../interfaces/lab';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private url: string = `${config.api.baseUrl}${config.api.labs}`;

  constructor(private http: HttpClient) {}

  getLabs(): Observable<Lab[]> {
    return this.http.get<Lab[]>(this.url);
  }
}
