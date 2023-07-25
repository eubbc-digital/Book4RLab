import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  FormGroupDirective,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Country } from 'src/app/interfaces/country';
import { countries } from 'src/app/store/country-data-store';
import { IanaTimezone } from 'src/app/interfaces/timezone';
import { iana_timezones } from 'src/app/store/timezone-data-shortened-store';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import moment from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  countries: Country[] = countries;
  timeZones: IanaTimezone[] = [];
  timeZoneChosen : IanaTimezone = {group: '', timezone: '', label: ''};
  timeZoneDefault : IanaTimezone = {group: '', timezone: '', label: ''};
  timeZoneRegistered : IanaTimezone = {group: '', timezone: '', label: ''};

  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;

  hideActualPassword:boolean = true;
  changePwd:boolean = false;

  registeredPassword:string | undefined= "";

  editionForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    lastName: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    country: new UntypedFormControl({}, [
      Validators.required,
      this.requireMatch.bind(this),
    ]),
    timeZone: new UntypedFormControl({}, [Validators.required]),

  });

  filteredOptions!: Observable<Country[]>;
  constructor(
    private authService: AuthService,
    private userService : UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserData();
    this.filteredOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this.filterCountry(name) : this.countries.slice()))
    );
    
    
   
    
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
    return this.editionForm.controls['password'];
  }

  get passwordConfirmationControl() {
    return this.editionForm.controls['passwordConfirmation'];
  }

  get countryControl() {
    return this.editionForm.controls['country'];
  }
  get timeZoneControl() {
    return this.editionForm.controls['timeZone'];
  }

  getUserData(){
    
    this.userService.getUserData().subscribe((response) => {
      
      this.editionForm.controls['name'].setValue(response.name);
      this.editionForm.controls['lastName'].setValue(response.last_name);
      this.editionForm.controls['email'].setValue(response.email);
      
      var country = this.getCountryInfoComplete(response.country);
      this.editionForm.controls['country'].setValue(country);

      if(response.time_zone){
        this.timeZoneRegistered = this.getTimezoneUser(response.time_zone);
        this.timeZoneDefault = this.getDefaultTimezone();
        this.timeZones = this.sortTimezones(iana_timezones);
        this.editionForm.controls['timeZone'].setValue({timezone: this.timeZoneRegistered.timezone,
          group: this.timeZoneRegistered.group, label: this.timeZoneRegistered.label});
          
        }
      
      
    })

  }
  updateUser(formDirective: FormGroupDirective): void {
    if (this.editionForm.valid) {
      
      const user: User = {
        name: this.editionForm.controls['name'].value,
        last_name: this.editionForm.controls['lastName'].value,
        email: this.editionForm.controls['email'].value,
        country: this.countryControl.value.code,
        time_zone: this.timeZoneControl.value.timezone,
      };
  
      this.userService.updateUserData(user).subscribe((response) => {
        if (response.status !== null && response.status === 200) {
          this.toastr.success(
            `Welcome ${user.name}`,
            'Successful update of user data'
          );
  
          
      }
      });
    } else {
      this.toastr.error(
        'Please, complete correctly the information.',
        'Invalid action'
      );
    } 
  }

  
  compareTimeZoneObjects(object1: any, object2: any) {
    return object1 
    && object2 
    && object1.timezone == object2.timezone 
  
  }

  compareCountryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.code == object2.code;
  }
  getCountryInfoComplete(code:string|undefined){
    if(code){
      var country:any={};
      countries.forEach(element => {
        if(element.code == code){
          country = element;
        }
      });
      return country;
    }
    else{return undefined;}
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
  getTimezoneUser(timezone:string|undefined){
    if(timezone){
      return {timezone: timezone , group: this.getUTCWithTimezone(timezone),label:""}
    }
    return this.getDefaultTimezone();

  }
  getDefaultTimezone() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var utc;
    var hour = moment().tz(tz).utcOffset()/60;
    if (hour > -1) { utc = "UTC+" + hour.toString() + ":00" }
    else { utc = "UTC" + hour.toString() + ":00" }
    return { timezone:tz, group:utc,label:"" };
  }
  getUTCWithTimezone(timeZone:string){
    var utc;
    var hour = moment().tz(timeZone).utcOffset()/60;
    
    if (hour > -1) { utc = "UTC+" + hour.toString() + ":00" }
    else { utc = "UTC" + hour.toString() + ":00" }
    return utc;
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
      
      timezonesWithUTC.push({name:tz,UTC:utc})
    });
    this.timeZones = timezonesWithUTC;

  }
  sortTimezones(timezones:any[]){
      timezones.sort( function( a:any, b:any ) {
        a = a.timezone.toLowerCase();
        b = b.timezone.toLowerCase();
    
        return a < b ? -1 : a > b ? 1 : 0;
    });
    return timezones;

  }
  changePasswordRequest(){
    if (this.editionForm.controls['actualPassword'].value == this.registeredPassword){
      this.changePwd = true;
    }
    else{ 
      this.toastr.error(
        'Please, enter your actual password.',
        'Invalid password.'
      );
    }
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

