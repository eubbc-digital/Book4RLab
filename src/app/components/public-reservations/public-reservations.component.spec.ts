import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicReservationsComponent } from './public-reservations.component';

describe('PublicReservationsComponent', () => {
  let component: PublicReservationsComponent;
  let fixture: ComponentFixture<PublicReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
