import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoCalificarCompetenciaComponent } from './alumno-calificar-competencia.component';

describe('AlumnoCalificarCompetenciaComponent', () => {
  let component: AlumnoCalificarCompetenciaComponent;
  let fixture: ComponentFixture<AlumnoCalificarCompetenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoCalificarCompetenciaComponent]
    });
    fixture = TestBed.createComponent(AlumnoCalificarCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
