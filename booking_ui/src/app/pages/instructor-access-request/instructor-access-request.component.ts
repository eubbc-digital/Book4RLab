import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
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
  requestReason = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUserData().subscribe((user) => {
      this.currentUser = user;
      this.isInstructor = !!user.groups?.some((group) => group.name === Group.Professors);
      if (!this.isInstructor) this.loadRequestStatus();
    });
  }

  requestInstructorAccess() {
    this.authService.requestInstructorAccess(this.requestReason.trim()).subscribe({
      next: (response) => {
        if (response.status === 'approved') {
          this.isInstructor = true;
          this.toastr.info('You already have instructor access');
        } else if (response.requested_at) {
          this.hasRequestedAccess = true;
          this.toastr.success('Instructor access request sent');
        } else {
          this.hasRequestedAccess = true;
          this.toastr.warning('You already have a pending request');
        }
      },
      error: () => {
        this.toastr.error('Failed to send request. Please try again later.');
      }
    });
  }

  private loadRequestStatus() {
    this.authService.getInstructorRequestStatus().subscribe({
      next: (response) => {
        this.isInstructor = response.status === 'approved';
        this.hasRequestedAccess = response.status === 'pending';
      },
      error: () => {
        this.toastr.error('Could not load your instructor access status.');
      }
    });
  }
}
