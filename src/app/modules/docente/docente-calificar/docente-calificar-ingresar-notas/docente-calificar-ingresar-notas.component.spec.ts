import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCalificarIngresarNotasComponent } from './docente-calificar-ingresar-notas.component';

describe('DocenteCalificarIngresarNotasComponent', () => {
  let component: DocenteCalificarIngresarNotasComponent;
  let fixture: ComponentFixture<DocenteCalificarIngresarNotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCalificarIngresarNotasComponent]
    });
    fixture = TestBed.createComponent(DocenteCalificarIngresarNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
