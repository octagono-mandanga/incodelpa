import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCompetenciaAsignaturaAddComponent } from './docente-competencia-asignatura-add.component';

describe('DocenteCompetenciaAsignaturaAddComponent', () => {
  let component: DocenteCompetenciaAsignaturaAddComponent;
  let fixture: ComponentFixture<DocenteCompetenciaAsignaturaAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCompetenciaAsignaturaAddComponent]
    });
    fixture = TestBed.createComponent(DocenteCompetenciaAsignaturaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
