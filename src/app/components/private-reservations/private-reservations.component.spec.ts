import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateReservationsComponent } from './private-reservations.component';

describe('PrivateReservationsComponent', () => {
  let component: PrivateReservationsComponent;
  let fixture: ComponentFixture<PrivateReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
