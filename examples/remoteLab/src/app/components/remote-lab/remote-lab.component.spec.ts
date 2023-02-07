import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteLabComponent } from './remote-lab.component';

describe('RemoteLabComponent', () => {
  let component: RemoteLabComponent;
  let fixture: ComponentFixture<RemoteLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
