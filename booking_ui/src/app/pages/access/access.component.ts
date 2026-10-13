/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import config from '../../config.json';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
})
export class AccessComponent implements OnInit {
  title: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.title = config.appInformation.title;
  }

  signIn(): void {
    this.authService.login();
  }

  signUp(): void {
    this.authService.register();
  }
}
