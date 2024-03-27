import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoCalificarComponent } from './alumno-calificar.component';

describe('AlumnoCalificarComponent', () => {
  let component: AlumnoCalificarComponent;
  let fixture: ComponentFixture<AlumnoCalificarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoCalificarComponent]
    });
    fixture = TestBed.createComponent(AlumnoCalificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
