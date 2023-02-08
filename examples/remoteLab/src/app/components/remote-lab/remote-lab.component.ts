import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/booking.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';

const urlParams = new URLSearchParams(window.location.search);
const accessKey = urlParams.get('access_key');
const pwd = urlParams.get('pwd');

let labTime = 0;

@Component({
  selector: 'app-remote-lab',
  templateUrl: './remote-lab.component.html',
  styleUrls: ['./remote-lab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteLabComponent implements AfterViewInit {
  loadedData: boolean = false;
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  config: CountdownConfig = {leftTime: labTime, notify: [60, 30], demand: true};
  timerLeft = 0;
  constructor(
    private toastr: ToastrService,
    private bookingService: BookingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.getBookingInformation();
    setInterval(() => {
      labTime -= 1;
      if (labTime < 0) {
        this.getBookingInformation();
      }
    }, 1000)
  }
  
  handleEvent(e: CountdownEvent) {
    this.timerLeft = e.left;
  }

  getBookingInformation(): void{
    this.bookingService.getBookingInfo(accessKey!, pwd!).subscribe( (response) => {
      const data = response;
      if (!data.length) {
        console.log('Access Denied');
        // your remote lab logic to deny access
        window.location.href = "https://eubbc-digital.upb.edu/booking/";
      } else {
        console.log('Access Granted');
        // your remote lab logic to grant access
        const endTime = Date.parse(data[0].end_date);
        const date = Date.now();
        labTime = Math.ceil((endTime - date) / 1000);
      }
      this.config = {leftTime: labTime, notify: [60, 30], demand: false};
      this.countdown.begin();
    })
  }

  logout(): void {
    localStorage.removeItem('token');
    this.goToLogin();
  }

  goToLogin(): void {
    this.router.navigateByUrl('/access');
  }
}
