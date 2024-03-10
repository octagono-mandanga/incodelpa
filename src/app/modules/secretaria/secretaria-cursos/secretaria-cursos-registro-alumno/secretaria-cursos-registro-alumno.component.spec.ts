import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaCursosRegistroAlumnoComponent } from './secretaria-cursos-registro-alumno.component';

describe('SecretariaCursosRegistroAlumnoComponent', () => {
  let component: SecretariaCursosRegistroAlumnoComponent;
  let fixture: ComponentFixture<SecretariaCursosRegistroAlumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaCursosRegistroAlumnoComponent]
    });
    fixture = TestBed.createComponent(SecretariaCursosRegistroAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
