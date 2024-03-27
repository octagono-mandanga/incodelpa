import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteAsignacionesComponent } from './docente-asignaciones.component';

describe('DocenteAsignacionesComponent', () => {
  let component: DocenteAsignacionesComponent;
  let fixture: ComponentFixture<DocenteAsignacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteAsignacionesComponent]
    });
    fixture = TestBed.createComponent(DocenteAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
