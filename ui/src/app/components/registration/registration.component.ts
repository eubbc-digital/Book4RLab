/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
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
import { IanaTimezone } from 'src/app/interfaces/timezone';
import { iana_timezones } from 'src/app/store/timezone-data-shortened-store';
import { map, Observable, startWith } from 'rxjs';
import moment from 'moment-timezone';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  
  countries: Country[] = countries;
  
  timezones: IanaTimezone[] = [];
  // timezones : any[] = []
  timezoneChosen : IanaTimezone = {group: '', timezone: '', label: ''};
  timezoneDefault : IanaTimezone = {group: '', timezone: '', label: ''};

  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;

  registrationForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    lastName: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    country: new UntypedFormControl({}, [
      Validators.required,
      this.requireMatch.bind(this),
    ]),
    password: new UntypedFormControl('', [
      Validators.minLength(8),
      Validators.required,
      this.matchValidator('passwordConfirmation', true),
    ]),
    passwordConfirmation: new UntypedFormControl('', [
      Validators.required,
      this.matchValidator('password'),
    ]),
  });

  filteredOptions!: Observable<Country[]>;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this.filterCountry(name) : this.countries.slice()))
    );
    // this.getTimezones();
    
    this.timezoneDefault = this.getDefaultTimezone();
    this.timezones = this.sortTimezones(iana_timezones);
    this.timezoneChosen = this.timezoneDefault;
    console.log(this.timezoneChosen);
  }

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { notSame: true };
    };
  }

  private requireMatch(control: UntypedFormControl): ValidationErrors | null {
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
        time_zone: this.timezoneChosen.timezone,
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
            this.checkReturnUrl();
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
  getDefaultTimezone() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var utc;
    var hour = moment().tz(tz).utcOffset()/60;
    if (hour > -1) { utc = "UTC+" + hour.toString() + ":00" }
    else { utc = "UTC" + hour.toString() + ":00" }
    return { timezone:tz, group:utc,label:"" };
  }
  getTimezones(){
    
    const timezonesNames = moment.tz.names();
    const timezonesC = moment.tz.countries();
    
    var timezonesWithUTC:any[] = []
    
    timezonesNames.forEach(tz => {
      var utc;
      var hour = moment().tz(tz).utcOffset()/60;
      if (hour > -1) { utc = "UTC+" + hour.toString(); }
      else { utc = "UTC" + hour.toString(); }
      console.log(tz);
      console.log(utc);
      timezonesWithUTC.push({name:tz,UTC:utc})
    });
    this.timezones = timezonesWithUTC;

  }
  sortTimezones(timezones:any[]){
      timezones.sort( function( a:any, b:any ) {
        a = a.timezone.toLowerCase();
        b = b.timezone.toLowerCase();
    
        return a < b ? -1 : a > b ? 1 : 0;
    });
    return timezones;

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

  checkReturnUrl() {
    let params = new URLSearchParams(document.location.search);
    let returnUrl = params.get('return-url');

    if (returnUrl) this.router.navigateByUrl(returnUrl);
    else {
      this.router.navigateByUrl('');
    }
  }
}
