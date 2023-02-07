import { Component, OnInit } from '@angular/core';
import config from '../../../config.json';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
})
export class AccessComponent implements OnInit {
  title: string = '';

  constructor() {}

  ngOnInit(): void {
    this.title = config.appInformation.name;
  }
}
