import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActivationData } from 'src/app/interfaces/activation-data';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})

export class ActivationComponent implements OnInit {
  activationStatus: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['token'] && params['uid']) {
        this.activateAccount(params['token'], params['uid']);
      }
    });
  }

  activateAccount(token: string, uid: string) {
    const activationData: ActivationData = {
      token: token,
      uid: uid
    }

    this.authService.activate(activationData).
      subscribe(
        (response) => {
          if (response.status !== null && response.status === 200) {
            this.activationStatus = 'success';
            setTimeout(() => {
              this.router.navigate(['/access']);
            }, 5000);
          }
        },
        (error) => {
          console.error(error);
          this.activationStatus = 'error';
        }
    );
  }
}
