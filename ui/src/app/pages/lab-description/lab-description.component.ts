import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-description',
  templateUrl: './lab-description.component.html',
  styleUrls: ['./lab-description.component.css'],
})
export class LabDescriptionComponent implements OnInit {
  constructor() {}
  
  valueTypeChosen = ""

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
  ngOnInit(): void {}

  addComponent(){
    console.log(this.valueTypeChosen);
    var value = this.valueTypeChosen;
    this.components.push({code: value , content:""})

  }
  saveComponents(){
    console.log(this.components);
  }
  deleteComponent(index:number){
    this.components.splice(index,1);
    
  }
}
