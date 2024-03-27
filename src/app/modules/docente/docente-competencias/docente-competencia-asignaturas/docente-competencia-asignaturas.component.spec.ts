import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCompetenciaAsignaturasComponent } from './docente-competencia-asignaturas.component';

describe('DocenteCompetenciaAsignaturasComponent', () => {
  let component: DocenteCompetenciaAsignaturasComponent;
  let fixture: ComponentFixture<DocenteCompetenciaAsignaturasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCompetenciaAsignaturasComponent]
    });
    fixture = TestBed.createComponent(DocenteCompetenciaAsignaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
