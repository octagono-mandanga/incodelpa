import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaAlumnosComponent } from './secretaria-alumnos.component';

describe('SecretariaAlumnosComponent', () => {
  let component: SecretariaAlumnosComponent;
  let fixture: ComponentFixture<SecretariaAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaAlumnosComponent]
    });
    fixture = TestBed.createComponent(SecretariaAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
