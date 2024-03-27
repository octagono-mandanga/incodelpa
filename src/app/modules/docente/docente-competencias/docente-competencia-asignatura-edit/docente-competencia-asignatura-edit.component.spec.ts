import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCompetenciaAsignaturaEditComponent } from './docente-competencia-asignatura-edit.component';

describe('DocenteCompetenciaAsignaturaEditComponent', () => {
  let component: DocenteCompetenciaAsignaturaEditComponent;
  let fixture: ComponentFixture<DocenteCompetenciaAsignaturaEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCompetenciaAsignaturaEditComponent]
    });
    fixture = TestBed.createComponent(DocenteCompetenciaAsignaturaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
