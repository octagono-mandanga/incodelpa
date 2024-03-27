import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCalificarReporteComponent } from './docente-calificar-reporte.component';

describe('DocenteCalificarReporteComponent', () => {
  let component: DocenteCalificarReporteComponent;
  let fixture: ComponentFixture<DocenteCalificarReporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCalificarReporteComponent]
    });
    fixture = TestBed.createComponent(DocenteCalificarReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
