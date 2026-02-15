import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosAsignacionEditComponent } from './coordinacion-cursos-asignacion-edit.component';

describe('CoordinacionCursosAsignacionEditComponent', () => {
  let component: CoordinacionCursosAsignacionEditComponent;
  let fixture: ComponentFixture<CoordinacionCursosAsignacionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosAsignacionEditComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosAsignacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
