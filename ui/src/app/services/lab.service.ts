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

  getVisibleLabs(): Observable<Lab[]> {
    const labsUrl = `${this.url}?visible=true`;
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
    if (lab.image) formData.append('image', lab.image);
    formData.append('url', lab.url!);
    formData.append('description', lab.description!);
    formData.append('visible', String(lab.visible!));
    formData.append('enabled', '1');
    console.log('lab form data:', formData);

    return this.http.post<Lab>(this.url, formData);
  }

  updateLab(newLab: Lab, id: number) {
    const formData = new FormData();
    if (newLab.name) formData.append('name', newLab.name!);
    if (newLab.instructor) formData.append('instructor', newLab.instructor!);
    if (newLab.university) formData.append('university', newLab.university!);
    if (newLab.course) formData.append('course', newLab.course!);

    if (newLab.image && typeof newLab.image !== 'string')
      formData.append('image', newLab.image!);

    if (newLab.url) formData.append('url', newLab.url!);
    if (newLab.description) formData.append('description', newLab.description!);
    formData.append('visible', String(newLab.visible!));
    formData.append('enabled', '1');

    return this.http.patch<Lab>(`${this.url}${id}/`, formData);
  }
  getLabContent() {
    var url: string = `${config.api.baseUrl}${config.api.content}`;
    return this.http.get<any>(url);
  }
  postLabContent(params: any) {
    var newParams: any[] = [];

    params.forEach((element:any) => {
      const formData = new FormData();
      formData.append("title",element.title);
      formData.append("subtitle",element.subtitle);
      formData.append("image",element.image);
      formData.append("video",element.video);
      formData.append("link",element.link);
      formData.append("text",element.text);
      formData.append("order",element.order);
      formData.append("laboratory",element.laboratory);
      console.log(formData);
      newParams.push(formData);
    });

    // const formData = new FormData();
    // formData.append('title', element[0].title);
    // formData.append('subtitle', element[0].subtitle);
    // formData.append('image', element[0].image);
    // formData.append('video', element[0].video);
    // formData.append('link', element[0].link);
    // formData.append('text', element[0].text);
    // formData.append('order', element[0].order);
    // formData.append('laboratory', element[0].laboratory);

    console.log('with form data:', newParams);

    var url: string = `${config.api.baseUrl}${config.api.content}`;
    return this.http.post<any>(url, newParams);
  }
  deleteLab(lab: Lab) {
    const deletedLab = { enabled: false };
    return this.http.patch<Lab>(`${this.url}${lab.id}/`, deletedLab);
  }
}
