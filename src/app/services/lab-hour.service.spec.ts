import { TestBed } from '@angular/core/testing';

import { LabHourService } from './lab-hour.service';

describe('LabHourService', () => {
  let service: LabHourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabHourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
