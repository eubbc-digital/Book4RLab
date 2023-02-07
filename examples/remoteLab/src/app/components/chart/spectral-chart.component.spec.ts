import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectralChartComponent } from './spectral-chart.component';

describe('SpectralChartComponent', () => {
  let component: SpectralChartComponent;
  let fixture: ComponentFixture<SpectralChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpectralChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectralChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
