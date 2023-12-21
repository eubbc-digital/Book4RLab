import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Lab } from 'src/app/interfaces/lab';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LabService } from 'src/app/services/lab.service';
import { compilePipeFromMetadata } from '@angular/compiler';
import { FilterPipe } from '../../pipes/lab-filter.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lab-description',
  templateUrl: './lab-description.component.html',
  styleUrls: ['./lab-description.component.css'],
})
export class LabDescriptionComponent implements OnInit {
  @Input() labId!: any;

  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  cols!: number;

  myLabContent!: any[];
  defaultLabImg = './assets/remote-lab.png';

  components: any[] = [];
  imageName: string[] = [];

  contentArray: string[] | any[] = [];

  types: any = [
    { name: 'image', display: 'Image' },
    { name: 'link', display: 'URL' },
    { name: 'subtitle', display: 'Subtitle' },
    { name: 'text', display: 'Normal Text' },
    { name: 'title', display: 'Title' },
    { name: 'video', display: 'Video' },
  ];

  typesSearch: any = [
    { name: 'link', display: 'URL' },
    { name: 'subtitle', display: 'Subtitle' },
    { name: 'text', display: 'Normal Text' },
    { name: 'title', display: 'Title' },
  ];

  constructor(private router: Router, private labService: LabService, private toastr: ToastrService,) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
  }

  ngOnInit(): void {
    if (this.labId) {
      this.getLabsContentId(this.labId);
    }
  }

  async getLabsContentId(id: number) {
    var labsContents: any[] = await lastValueFrom(
      this.labService.getLabContent(id)
    );
    this.myLabContent = labsContents;
    this.myLabContent.sort((a, b) => a.order - b.order);
    for (var i = 0; i < this.myLabContent.length; i++) {
      if (
        this.myLabContent[i]['image'] &&
        typeof this.myLabContent[i]['image'] == 'string'
      ) {
        this.components.push({
          image: this.myLabContent[i]['image'],
        });
        this.contentArray.push(this.myLabContent[i]['image']);
      } else if (
        this.myLabContent[i]['video'] != null &&
        typeof this.myLabContent[i]['video'] == 'string'
      ) {
        this.components.push({
          video: this.myLabContent[i]['video'],
        });
        this.contentArray.push(this.myLabContent[i]['video']);
      } else {
        for (var t = 0; t < this.types.length; t++) {
          if (this.myLabContent[i][this.types[t].name]) {
            this.components.push({
              [this.types[t].name]: this.myLabContent[i][this.types[t].name],
            });
            this.contentArray.push('');
            break;
          }
        }
      }
    }
  }

  getType(typeCode: any) {
    for (var i = 0; i < this.types.length; i++) {
      if (this.types[i].name == typeCode) return this.types[i].display;
    }
    return null;
  }

  addNewComponent(typeChosen: string, index: number) {
    if (this.components.length == 0) {
      this.components.push({
        [typeChosen]: '',
      });
    } else {
      this.components.splice(index + 1, 0, {
        [typeChosen]: '',
      });
    }
  }
  addOldComponent(typeChosen: string, index: number, content: any) {
    this.components.splice(index, 0, { [typeChosen]: content });
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
  }

  deleteComponent(index: number) {
    return this.components.splice(index, 1);
  }
  goUp(index: number) {
    var component = this.deleteComponent(index);
    if (index == 0) this.components.splice(0, 0, component[0]);
    else this.components.splice(index - 1, 0, component[0]);
  }
  goDown(index: number) {
    var component = this.deleteComponent(index);
    this.components.splice(index + 1, 0, component[0]);
  }

  onUploadFile(event: any, index: number, field: string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      const file_size = file.size;
      if(file_size <= 50000000){
        this.components[index][field] = file;
        this.getUrlFile(file, index);
      }
      else{
        this.toastr.error("File size must be 50MB or smaller.");
        this.deleteComponent(index);
      }
    }
  }
  async getUrlFile(file: any, index: number) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.contentArray[index] = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };

    reader.readAsDataURL(file);
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
}
