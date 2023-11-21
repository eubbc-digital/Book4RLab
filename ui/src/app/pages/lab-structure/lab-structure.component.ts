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
import { lastValueFrom } from 'rxjs';

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

  myLabContent : any = [];

  types :any = [
    { name: 'image' , display: 'Image'},
    { name: 'link', display : 'URL'},
    { name: 'subtitle',display:'Subtitle' },
    { name: 'text' , display:'Normal Text'},
    { name: 'title' , display : 'Title'},
    { name: 'video' , display:'Video'},
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labService: LabService
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
  }
  ngOnInit() {
    this.route.params.subscribe({
      next: async (params) => {
        var id = params['id'];
        this.lab = await lastValueFrom(this.labService.getLabById(id));
        this.getLabsContentId(id);
      },
    });
  }

  async getLabsContentId(id:number){
    var labsContents :any[] = await lastValueFrom(this.labService.getLabContent());
    this.myLabContent = labsContents.filter((content)=> content.laboratory == id);
    this.myLabContent.sort((a:any,b:any) => a.order - b.order);
    console.log(this.myLabContent);

  }
  divideInfoDetails() {
    var k = 0;
    for (var i = 0; i < this.types.length; i++) {
      for (var j = 1; j <= this.types[i].count; j++) {
        if (this.lab[this.types[i].name]) {
          this.components.push([
            this.types[i].name,
            this.lab[this.types[i].name + '_' + j],
            k,
          ]);
          k++;
        }
      }
    }
    console.log("Components 2 :",this.components);
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
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
}
