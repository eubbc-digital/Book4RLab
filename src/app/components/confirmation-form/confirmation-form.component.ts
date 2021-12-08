import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.css'],
})
export class ConfirmationFormComponent implements OnInit {
  @Input() reservation = {
    lab: '',
    datetime: '',
    kit: '',
  };

  currentUser: User = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.currentUser = this.userService.getUserData();
  }
}
