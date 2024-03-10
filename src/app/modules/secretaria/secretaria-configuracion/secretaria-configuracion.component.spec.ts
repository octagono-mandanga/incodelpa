import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaConfiguracionComponent } from './secretaria-configuracion.component';

describe('SecretariaConfiguracionComponent', () => {
  let component: SecretariaConfiguracionComponent;
  let fixture: ComponentFixture<SecretariaConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaConfiguracionComponent]
    });
    fixture = TestBed.createComponent(SecretariaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
