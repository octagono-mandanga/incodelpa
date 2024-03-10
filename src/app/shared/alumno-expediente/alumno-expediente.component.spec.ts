import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoExpedienteComponent } from './alumno-expediente.component';

describe('AlumnoExpedienteComponent', () => {
  let component: AlumnoExpedienteComponent;
  let fixture: ComponentFixture<AlumnoExpedienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoExpedienteComponent]
    });
    fixture = TestBed.createComponent(AlumnoExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
