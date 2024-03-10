import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaPerfilComponent } from './secretaria-perfil.component';

describe('SecretariaPerfilComponent', () => {
  let component: SecretariaPerfilComponent;
  let fixture: ComponentFixture<SecretariaPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaPerfilComponent]
    });
    fixture = TestBed.createComponent(SecretariaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
