import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaCursosComponent } from './secretaria-cursos.component';

describe('SecretariaCursosComponent', () => {
  let component: SecretariaCursosComponent;
  let fixture: ComponentFixture<SecretariaCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaCursosComponent]
    });
    fixture = TestBed.createComponent(SecretariaCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
