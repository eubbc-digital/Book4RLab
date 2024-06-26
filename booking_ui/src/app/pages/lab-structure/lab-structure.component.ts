import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lab } from 'src/app/interfaces/lab';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lab-structure',
  templateUrl: './lab-structure.component.html',
  styleUrls: ['./lab-structure.component.css'],
})
export class LabStructureComponent implements OnInit {
  // @Input() lab!: any;
  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  lab!: any;

  defaultLabImg = './assets/remote-lab.png';
  cols!: number;

  components: any = [];

  myLabContent: any = [];

  disabledBooking: boolean = false;

  user_email: string = ''

  types: any = [
    { name: 'image', display: 'Image' },
    { name: 'link', display: 'URL' },
    { name: 'subtitle', display: 'Subtitle' },
    { name: 'text', display: 'Normal Text' },
    { name: 'title', display: 'Title' },
    { name: 'video', display: 'Video' },
    { name: 'video_link', display: 'Video URL' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labService: LabService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
  }
  ngOnInit() {
    this.route.params.subscribe({
      next: async (params) => {
        var id = params['id'];
        this.lab = await lastValueFrom(this.labService.getLabById(id));
        this.disabledBooking = !this.lab.is_available_now;
        this.getLabsContentId(id);
      },
    });
    this.getUserEmail();
  }

  async getLabsContentId(id: number) {
    this.myLabContent = await lastValueFrom(this.labService.getLabContent(id));
    this.myLabContent.sort((a: any, b: any) => a.order - b.order);
  }

  getUrlFile(file: any) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      var url = event.target.result;
      return url;
    };
    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };

    reader.readAsDataURL(file);
  }

  selectLab(lab: Lab): void {
    this.labService.checkUserLaboratoryAccess(this.lab.id).subscribe({
      next: (response) => {
        if (response.access === true) {
          this.toastr.success(
            'Access granted to this laboratory'
          );
          this.router.navigate(['/booking', lab.id]);
        } else {
          this.toastr.error(
            'You do not have access to this laboratory. Please contact your instructor.'
          );
        }
      },
      error: (e) => {
        this.toastr.error(
          'There was an error verifying the user access to this laboratory.'
        );
      }
    });
  }

  getType(typeCode: any) {
    for (var i = 0; i < this.types.length; i++) {
      if (this.types[i].name == typeCode) return this.types[i].display;
    }
    return null;
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  getVideoId(url: string): string {
    const videoIdMatch = url.match(/(?:\/|%3D|v=|vi=)([0-9A-Za-z_-]{11})(?:[%#?&]|$)/);
    return videoIdMatch ? videoIdMatch[1] : '';
  }

  getUserEmail(): void {
    this.userService
      .getUserData()
      .subscribe((user) => (this.user_email = user.email));
  }
}
