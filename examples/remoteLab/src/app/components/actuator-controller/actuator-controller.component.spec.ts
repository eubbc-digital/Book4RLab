import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuatorControllerComponent } from './actuator-controller.component';

describe('ActuatorControllerComponent', () => {
  let component: ActuatorControllerComponent;
  let fixture: ComponentFixture<ActuatorControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActuatorControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuatorControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
