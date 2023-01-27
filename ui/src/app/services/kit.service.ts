import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getKitsByLabId(labId: number): Observable<Kit[]> {
    const params = new HttpParams().set('laboratory', labId);
    return this.http.get<Kit[]>(this.url, { params });
  }

  getKitById(kitId: number): Observable<Kit> {
    return this.http.get<Kit>(`${this.url}${kitId}/`);
  }

  addKit(kit: Kit) {
    return this.http.post<Kit>(this.url, kit);
  }

  updateKit(newKit: Kit, id: number) {
    return this.http.put<Kit>(`${this.url}${id}/`, newKit);
  }
}
