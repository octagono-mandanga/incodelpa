import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaDocentesComponent } from './secretaria-docentes.component';

describe('SecretariaDocentesComponent', () => {
  let component: SecretariaDocentesComponent;
  let fixture: ComponentFixture<SecretariaDocentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaDocentesComponent]
    });
    fixture = TestBed.createComponent(SecretariaDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
