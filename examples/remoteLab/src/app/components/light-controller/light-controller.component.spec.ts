import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightControllerComponent } from './light-controller.component';

describe('LightControllerComponent', () => {
  let component: LightControllerComponent;
  let fixture: ComponentFixture<LightControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
