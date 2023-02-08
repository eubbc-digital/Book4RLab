import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowPreviewComponent } from './row-preview.component';

describe('RowPreviewComponent', () => {
  let component: RowPreviewComponent;
  let fixture: ComponentFixture<RowPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
