import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Lab } from 'src/app/interfaces/lab';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LabService } from 'src/app/services/lab.service';
import { compilePipeFromMetadata } from '@angular/compiler';
import { FilterPipe } from '../../pipes/lab-filter.pipe';

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
  imageName :string[]= [];

  types: any = [
    { name: 'image', display: 'Image' },
    { name: 'link', display: 'URL' },
    { name: 'subtitle', display: 'Subtitle' },
    { name: 'text', display: 'Normal Text' },
    { name: 'title', display: 'Title' },
    { name: 'video', display: 'Video' },
  ];

  constructor(private router: Router, private labService: LabService) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
  }

  ngOnInit(): void {
    if (this.labId) {
      // this.divideInfoDetails();ç
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
      for (var t = 0; t < this.types.length; t++) {
        if (this.myLabContent[i][this.types[t].name]) {
          this.components.push({
            [this.types[t].name]: this.myLabContent[i][this.types[t].name],
          });
          break;
        }
      }
    }
  }

  getImageName(imageName: string | null): string {
    const defaultImage = 'default.jpeg';
    return imageName
      ? imageName.split('/').pop() ?? defaultImage
      : defaultImage;
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

  onUploadFile(event: any, index: number, field:string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.components[index][field] = file;
    }
  }
  // async getUrlFile(file:any){
  //   var reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     var url = event.target.result;
  //     return url;
  //   };
  //   reader.onerror = (event: any) => {
  //     console.log("File could not be read: " + event.target.error.code);
  //   };
   
  //   reader.readAsDataURL(file);
    
  // }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
}
