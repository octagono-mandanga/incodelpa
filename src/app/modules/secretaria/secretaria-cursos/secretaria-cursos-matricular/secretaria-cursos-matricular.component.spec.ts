import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaCursosMatricularComponent } from './secretaria-cursos-matricular.component';

describe('SecretariaCursosMatricularComponent', () => {
  let component: SecretariaCursosMatricularComponent;
  let fixture: ComponentFixture<SecretariaCursosMatricularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaCursosMatricularComponent]
    });
    fixture = TestBed.createComponent(SecretariaCursosMatricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
