/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lab } from 'src/app/interfaces/lab';
import { LabService } from 'src/app/services/lab.service';
import config from '../../config.json';

@Component({
  selector: 'app-lab-grid',
  templateUrl: './lab-grid.component.html',
  styleUrls: ['./lab-grid.component.css'],
})
export class LabGridComponent implements OnInit {
  labs: Lab[] = [];
  searchedLab = '';

  defaultLabImg = './assets/remote-lab.png';

  constructor(private labService: LabService, private router: Router) {}

  ngOnInit(): void {
    this.labService.getLabs().subscribe((labs) => {
      this.labs = labs;
    });
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
  }

  getImagePath(image: string): string {
    if (image) {
      const imageName = image.split('/').slice(-1)[0];
      return `${config.api.baseUrl}${config.api.media}${imageName}`;
    } else return this.defaultLabImg;
  }
}
