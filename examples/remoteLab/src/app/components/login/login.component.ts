import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import config from '../../../config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const user: User = {
        email: this.loginForm.controls['email'].value!,
        password: this.loginForm.controls['password'].value!,
      };
      this.authService.login(user).subscribe((response) => {
        if (response != undefined) {
          localStorage.setItem('token', response.body.token);
          this.toastr.success(`Welcome ${user.email}`);

          const accessIdParam = config.urlParams.accessKey;
          const passwordParam = config.urlParams.password;

          const accessId = this.route.snapshot.queryParamMap.get(accessIdParam);
          const password = this.route.snapshot.queryParamMap.get(passwordParam);

          let routerLink = '';

          if (accessId && password) {
            routerLink = `?${accessIdParam}=${accessId}&${passwordParam}=${password}`;
          }

          this.router.navigateByUrl(routerLink);
        }
      });
    } else {
      this.toastr.error(
        'Please, complete correctly the information.',
        'Invalid action'
      );
    }
  }

  getEmailErrorMessage() {
    if (this.loginForm.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.controls['email'].hasError('email')
      ? 'Not a valid email'
      : '';
  }

  isInvalidEmail(): boolean {
    return this.loginForm.controls['email'].invalid;
  }
}
