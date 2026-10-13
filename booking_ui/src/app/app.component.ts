/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public spinkit = Spinkit;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const returnUrl = this.authService.consumeReturnUrl();
    if (returnUrl) this.router.navigateByUrl(returnUrl);
  }
}
