import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/enums/group';
import { User } from 'src/app/interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-instructor-access-request',
  templateUrl: './instructor-access-request.component.html',
  styleUrls: ['./instructor-access-request.component.css']
})
export class InstructorAccessRequestComponent implements OnInit {
  currentUser?: User;
  isInstructor = false;
  hasRequestedAccess = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUserData().subscribe((user) => {
      this.currentUser = user;
      user.groups!.forEach((group) => {
        if (group.name === Group.Professors) this.isInstructor = true;
      });
    });
  }

  requestInstructorAccess() {
    const data = { email: this.currentUser?.email || '' };

    this.authService.requestInstructorAccess(data).subscribe({
      next: (response: any) => {
        const message = response.body?.message || response.message;

        if (message === 'The user already has instructor access') {
          this.toastr.info(message);
        }
        else if (message === 'Instructor access request is pending approval') {
          this.toastr.warning(message);
          this.hasRequestedAccess = true;
        }
        else if (message === 'Instructor access was already approved') {
          this.toastr.success(message);
        }
        else {
          this.toastr.success('Instructor access request sent');
        }

        if (response.message === 'Instructor access request sent') {
          this.hasRequestedAccess = true;
        }
      },
      error: (err: any) => {
        if (err.status === 400 && err.error.message === 'Invalid email account') {
          this.toastr.error('Invalid email account');
        }
        else if (err.status === 400 && err.error.message === 'Request already exists') {
          this.toastr.warning('You already have a pending request');
        }
        else {
          this.toastr.error('Failed to send request. Please try again later.');
        }
      }
    });
  }
}
