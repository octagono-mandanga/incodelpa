import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCompetenciaAsignaturaComponent } from './docente-competencia-asignatura.component';

describe('DocenteCompetenciaAsignaturaComponent', () => {
  let component: DocenteCompetenciaAsignaturaComponent;
  let fixture: ComponentFixture<DocenteCompetenciaAsignaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCompetenciaAsignaturaComponent]
    });
    fixture = TestBed.createComponent(DocenteCompetenciaAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
