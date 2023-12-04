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
  getLabContent(labId:number) {
    var url: string = `${config.api.baseUrl}${config.api.labs}${labId}/${config.api.content}`;
    return this.http.get<any>(url);
  }
  deleteLabContent(labId: number){
    var url: string = `${config.api.baseUrl}${config.api.labs}${labId}/${config.api['delete-content']}`
    return this.http.delete(url);
  }
  postLabContent(params: any) {
    var newParams: any[] = [];

    // params.forEach((element:any) => {
    //   const formData = new FormData();
    //   formData.append("title",element.title ? element.title : null);
    //   formData.append("subtitle",element.subtitle? element.subtitle : null);
    //   formData.append("image",element.image ? element.image : null);
    //   formData.append("video",element.video ? element.video : null);
    //   formData.append("link",element.link ? element.link : null);
    //   formData.append("text",element.text ? element.text : null);
    //   formData.append("order",element.order);
    //   formData.append("laboratory",element.laboratory );
    //   newParams.push(formData);
    // });

    console.log('without form data:', params);

    const formData = new FormData();
    formData.append('title', params[0].title?params[0].title:null);
    formData.append('subtitle',params[0].subtitle? params[0].subtitle:null);
    formData.append('image', params[0].image? params[0].image :null);
    formData.append('video', params[0].video? params[0].video : null);
    formData.append('link', params[0].link ? params[0].link : null);
    formData.append('text', params[0].text? params[0].text : null);
    formData.append('order', params[0].order);
    formData.append('laboratory', params[0].laboratory );

    console.log('with form data:', newParams);
   

    var url: string = `${config.api.baseUrl}${config.api.labs}${config.api.content}`;
    return this.http.post<any>(url, params);
  }
  deleteLab(lab: Lab) {
    const deletedLab = { enabled: false };
    return this.http.patch<Lab>(`${this.url}${lab.id}/`, deletedLab);
  }
}
