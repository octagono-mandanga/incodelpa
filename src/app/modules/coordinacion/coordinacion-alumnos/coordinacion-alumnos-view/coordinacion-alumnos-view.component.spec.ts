import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionAlumnosViewComponent } from './coordinacion-alumnos-view.component';

describe('CoordinacionAlumnosViewComponent', () => {
  let component: CoordinacionAlumnosViewComponent;
  let fixture: ComponentFixture<CoordinacionAlumnosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionAlumnosViewComponent]
    });
    fixture = TestBed.createComponent(CoordinacionAlumnosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
