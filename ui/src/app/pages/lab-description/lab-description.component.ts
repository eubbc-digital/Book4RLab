import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Lab } from 'src/app/interfaces/lab';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab-description',
  templateUrl: './lab-description.component.html',
  styleUrls: ['./lab-description.component.css'],
})
export class LabDescriptionComponent implements OnInit {
 
  @Input() lab!: Lab;

  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  cols!: number;
  
  defaultLabImg = './assets/remote-lab.png';

  components = [
    {
      content: 'title one',
      code: 'main-title',
    },
    {
      content: 'description my one',
      code: 'text',
    },
  ];

  types = [
    { code: 'main-title', name: 'Main Title' },
    { code: 'title-1', name: 'Title 1' },
    { code: 'title-2', name: 'Title 2' },
    { code: 'text', name: 'Normal Text' },
    { code: 'image', name: 'Image' },
    { code: 'video', name: 'Video' },
    { code: 'url', name: 'URL' },
  ];

  constructor(private router:Router) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
  }

  ngOnInit(): void {}

  onChange(event: any) {
    console.log(event);
    console.log(event.target.value);
    console.log(event.target);

    console.log(this.toDataURL(event.target.value));
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;

      // this.imageName = file.name;
      // this.imageControl.setValue(file);
    }
  }

  getType(typeCode:any){
    for(var i = 0;i<this.types.length;i++){
      if(this.types[i].code == typeCode)return this.types[i].name;
    }
    return null;

  }

  addComponent(typeChosen: any, i: number,content:string="") {
    var componentsTemp = this.components;
    if (i == this.components.length - 1) {
      this.components.push({ code: typeChosen, content: content });
    } else {
      this.components = [
        ...componentsTemp.slice(0, i + 1),
        { code: typeChosen, content: content },
        ...componentsTemp.slice(i + 1),
      ];
    }
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
  }

  saveComponents() {
    console.log(this.components);
  }
  deleteComponent(index: number) {
    return this.components.splice(index, 1);
  }
  goUp(index:number){
    var component = this.deleteComponent(index);
    this.addComponent(component[0].code , index, component[0].content);
  }
  goDown(index:number){
    var component = this.deleteComponent(index);
    this.addComponent(component[0].code , index+1 , component[0].content);
  }
  toDataURL = async (url: any) => {
    console.log('Downloading image...');
    var res = await fetch(url);
    var blob = await res.blob();

    const result = await new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });

    return result;
  };

  onUploadFile(event: any, index: number) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.components[index].content = event.target.result;
      };
    }
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
}
