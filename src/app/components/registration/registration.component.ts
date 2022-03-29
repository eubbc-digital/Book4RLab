import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.required,
    ]),
    passwordConfirmation: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm.controls['passwordConfirmation'].addValidators(
      this.checkPasswords
    );
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = this.registrationForm.controls['password'].value;
    let confirmPass =
      this.registrationForm.controls['passwordConfirmation'].value;
    return pass === confirmPass ? null : { notSame: true };
  };

  get passwordControl() {
    return this.registrationForm.controls['password'];
  }

  get passwordConfirmationControl() {
    return this.registrationForm.controls['passwordConfirmation'];
  }

  saveUser(formDirective: FormGroupDirective): void {
    const user: User = {
      name: this.registrationForm.controls['name'].value,
      last_name: this.registrationForm.controls['lastName'].value,
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value,
    };

    if (this.registrationForm.valid) {
      this.toastr.success('Welcome', 'Successful registration');
      this.authService.signUp(user).subscribe((response) => {
        if (response.status !== null && response.status === 201) {
          this.toastr.success('Welcome', 'Successful registration');

          let newUser: User = {
            email: response.body.email,
            password: this.registrationForm.controls['password'].value,
          };

          this.authService.login(newUser).subscribe((response) => {
            this.restartFields(formDirective);
            localStorage.setItem('token', response.body.token);
            this.router.navigateByUrl('');
          });
        }
      });
    } else {
      this.toastr.error(
        'Please, complete correctly the information.',
        'Invalid action'
      );
    }
  }

  restartFields(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    this.registrationForm.reset();
  }

  isPasswordConfirmationValid(): boolean {
    return (
      this.passwordConfirmationControl.errors !== null &&
      this.passwordConfirmationControl.errors['notSame']
    );
  }
}
