import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingLinkComponent } from './booking-link.component';

describe('BookingLinkComponent', () => {
  let component: BookingLinkComponent;
  let fixture: ComponentFixture<BookingLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
