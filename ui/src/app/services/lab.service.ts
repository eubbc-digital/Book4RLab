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
export class LabService {
  private url: string = `${config.api.baseUrl}${config.api.labs}`;

  constructor(private http: HttpClient) {}

  getLabs(owner?: number): Observable<Lab[]> {
    const labsUrl = owner ? `${this.url}?owner=${owner}` : this.url;
    return this.http.get<Lab[]>(labsUrl);
  }

  getLabById(labId: number): Observable<Lab> {
    return this.http.get<Lab>(`${this.url}${labId}/`);
  }

  addLab(lab: Lab) {
    const formData = new FormData();
    formData.append('name', lab.name!);
    formData.append('instructor', lab.instructor!);
    formData.append('university', lab.university!);
    formData.append('course', lab.course!);
    formData.append('image', lab.image!);
    formData.append('url', lab.url!);
    formData.append('description', lab.description!);
    formData.append('enabled', '1');

    return this.http.post<Lab>(this.url, formData);
  }

  updateLab(newLab: Lab, id: number) {
    const formData = new FormData();
    if (newLab.name) formData.append('name', newLab.name!);
    if (newLab.instructor) formData.append('instructor', newLab.instructor!);
    if (newLab.university) formData.append('university', newLab.university!);
    if (newLab.course) formData.append('course', newLab.course!);
    if (newLab.image) formData.append('image', newLab.image!);
    if (newLab.url) formData.append('url', newLab.url!);
    if (newLab.description) formData.append('description', newLab.description!);
    formData.append('enabled', '1');

    return this.http.patch<Lab>(`${this.url}${id}/`, formData);
  }

  deleteLab(lab: Lab) {
    const deletedLab = { enabled: false };
    return this.http.patch<Lab>(`${this.url}${lab.id}/`, deletedLab);
  }
}
