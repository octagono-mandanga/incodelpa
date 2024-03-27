import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCompetenciasComponent } from './docente-competencias.component';

describe('DocenteCompetenciasComponent', () => {
  let component: DocenteCompetenciasComponent;
  let fixture: ComponentFixture<DocenteCompetenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCompetenciasComponent]
    });
    fixture = TestBed.createComponent(DocenteCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
