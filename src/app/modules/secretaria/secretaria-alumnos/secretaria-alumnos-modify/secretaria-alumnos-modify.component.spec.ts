import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaAlumnosModifyComponent } from './secretaria-alumnos-modify.component';

describe('SecretariaAlumnosModifyComponent', () => {
  let component: SecretariaAlumnosModifyComponent;
  let fixture: ComponentFixture<SecretariaAlumnosModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaAlumnosModifyComponent]
    });
    fixture = TestBed.createComponent(SecretariaAlumnosModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
