import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCalificarCompetenciasComponent } from './docente-calificar-competencias.component';

describe('DocenteCalificarCompetenciasComponent', () => {
  let component: DocenteCalificarCompetenciasComponent;
  let fixture: ComponentFixture<DocenteCalificarCompetenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCalificarCompetenciasComponent]
    });
    fixture = TestBed.createComponent(DocenteCalificarCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
