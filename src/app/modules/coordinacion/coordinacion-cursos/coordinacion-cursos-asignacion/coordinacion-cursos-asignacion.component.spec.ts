import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosAsignacionComponent } from './coordinacion-cursos-asignacion.component';

describe('CoordinacionCursosAsignacionComponent', () => {
  let component: CoordinacionCursosAsignacionComponent;
  let fixture: ComponentFixture<CoordinacionCursosAsignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosAsignacionComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
