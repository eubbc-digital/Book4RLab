/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import config from '../../config.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  acronym: string = config.organizationData.acronym;
  version: string = config.version;

  constructor() {}

  ngOnInit(): void {}

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
