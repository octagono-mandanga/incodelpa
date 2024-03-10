import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionAlumnosComponent } from './coordinacion-alumnos.component';

describe('CoordinacionAlumnosComponent', () => {
  let component: CoordinacionAlumnosComponent;
  let fixture: ComponentFixture<CoordinacionAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionAlumnosComponent]
    });
    fixture = TestBed.createComponent(CoordinacionAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
