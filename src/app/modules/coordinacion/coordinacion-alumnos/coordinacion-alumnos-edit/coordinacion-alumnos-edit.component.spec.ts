import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionAlumnosEditComponent } from './coordinacion-alumnos-edit.component';

describe('CoordinacionAlumnosEditComponent', () => {
  let component: CoordinacionAlumnosEditComponent;
  let fixture: ComponentFixture<CoordinacionAlumnosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionAlumnosEditComponent]
    });
    fixture = TestBed.createComponent(CoordinacionAlumnosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
