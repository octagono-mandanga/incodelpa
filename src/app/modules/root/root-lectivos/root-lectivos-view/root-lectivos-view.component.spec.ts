import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootLectivosViewComponent } from './root-lectivos-view.component';

describe('RootLectivosViewComponent', () => {
  let component: RootLectivosViewComponent;
  let fixture: ComponentFixture<RootLectivosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootLectivosViewComponent]
    });
    fixture = TestBed.createComponent(RootLectivosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
