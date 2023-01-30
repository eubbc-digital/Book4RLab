/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

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
import { Country } from 'src/app/interfaces/country';
import { countries } from 'src/app/store/country-data-store';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  countries: Country[] = countries;

  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl({}, [
      Validators.required,
      this.requireMatch.bind(this),
    ]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.required,
    ]),
    passwordConfirmation: new FormControl('', [Validators.required]),
  });

  filteredOptions!: Observable<Country[]>;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm.controls['passwordConfirmation'].addValidators(
      this.checkPasswords
    );

    this.filteredOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this.filterCountry(name) : this.countries.slice()))
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

  private requireMatch(control: FormControl): ValidationErrors | null {
    const country: any = control.value;

    if (
      this.countries &&
      country.name &&
      this.filterCountry(country.name).length > 0
    ) {
      return null;
    }
    return { requireMatch: true };
  }

  get passwordControl() {
    return this.registrationForm.controls['password'];
  }

  get passwordConfirmationControl() {
    return this.registrationForm.controls['passwordConfirmation'];
  }

  get countryControl() {
    return this.registrationForm.controls['country'];
  }

  saveUser(formDirective: FormGroupDirective): void {
    if (this.registrationForm.valid) {
      const user: User = {
        name: this.registrationForm.controls['name'].value,
        last_name: this.registrationForm.controls['lastName'].value,
        email: this.registrationForm.controls['email'].value,
        password: this.passwordControl.value,
        country: this.countryControl.value.code,
      };

      this.authService.signUp(user).subscribe((response) => {
        if (response.status !== null && response.status === 201) {
          this.toastr.success(
            `Welcome ${user.name}`,
            'Successful registration'
          );

          let newUser: User = {
            email: response.body.email,
            password: this.registrationForm.controls['password'].value,
          };

          this.authService.login(newUser).subscribe((response) => {
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

  isPasswordConfirmationValid(): boolean {
    return (
      this.passwordConfirmationControl.errors !== null &&
      this.passwordConfirmationControl.errors['notSame']
    );
  }

  filterCountry(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  getCountryName(country: any) {
    return country ? country.name : null;
  }

  getPasswordControlError(): string {
    return (
      this.passwordControl.errors != null &&
      this.passwordControl.errors['minlength']
    );
  }

  getCountryControlError(): string {
    return (
      this.countryControl.errors != null &&
      this.countryControl.errors['requireMatch']
    );
  }
}
