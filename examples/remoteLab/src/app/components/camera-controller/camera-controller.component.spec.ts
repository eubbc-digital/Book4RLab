import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraControllerComponent } from './camera-controller.component';

describe('CameraControllerComponent', () => {
  let component: CameraControllerComponent;
  let fixture: ComponentFixture<CameraControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
