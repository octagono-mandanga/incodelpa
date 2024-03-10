import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaAlumnosEditComponent } from './secretaria-alumnos-edit.component';

describe('SecretariaAlumnosEditComponent', () => {
  let component: SecretariaAlumnosEditComponent;
  let fixture: ComponentFixture<SecretariaAlumnosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaAlumnosEditComponent]
    });
    fixture = TestBed.createComponent(SecretariaAlumnosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
