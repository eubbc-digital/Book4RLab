/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { User } from 'src/app/interfaces/user';
import config from '../../config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;

  passwordResetUrl = `${config.api.baseUrl}${config.api.users.passwordReset}`;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  get emailControl() {
    return this.loginForm.controls['email'];
  }

  get passwordControl() {
    return this.loginForm.controls['password'];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const user: User = {
        email: this.emailControl.value!,
        password: this.passwordControl.value!,
      };
      this.authService.login(user).subscribe((response) => {
        if (response != undefined) {
          localStorage.setItem('token', response.body.token);

          this.checkReturnUrl();

          this.toastr.success(`Welcome ${user.email}`);
        }
      });
    } else {
      this.toastr.error(
        'Please, complete correctly the information.',
        'Invalid action'
      );
    }
  }

  getEmailErrorMessage(): string {
    if (this.emailControl.hasError('required'))
      return 'You must enter an email.';

    return this.emailControl.hasError('email') ? 'Not a valid email.' : '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError('required')) {
      return 'You must enter a password.';
    }

    return this.passwordControl.hasError('minlength')
      ? 'Password must have at least 8 characters.'
      : '';
  }

  checkReturnUrl() {
    let params = new URLSearchParams(document.location.search);
    let returnUrl = params.get('return-url');

    if (returnUrl) this.router.navigateByUrl(returnUrl);
    else {
      this.router.navigateByUrl('');
    }
  }
}
