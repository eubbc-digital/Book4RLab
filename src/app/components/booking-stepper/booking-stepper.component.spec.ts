import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStepperComponent } from './booking-stepper.component';

describe('BookingStepperComponent', () => {
  let component: BookingStepperComponent;
  let fixture: ComponentFixture<BookingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
