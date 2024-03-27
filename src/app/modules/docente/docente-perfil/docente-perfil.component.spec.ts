import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentePerfilComponent } from './docente-perfil.component';

describe('DocentePerfilComponent', () => {
  let component: DocentePerfilComponent;
  let fixture: ComponentFixture<DocentePerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocentePerfilComponent]
    });
    fixture = TestBed.createComponent(DocentePerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
