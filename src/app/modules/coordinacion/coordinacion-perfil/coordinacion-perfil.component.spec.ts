import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionPerfilComponent } from './coordinacion-perfil.component';

describe('CoordinacionPerfilComponent', () => {
  let component: CoordinacionPerfilComponent;
  let fixture: ComponentFixture<CoordinacionPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionPerfilComponent]
    });
    fixture = TestBed.createComponent(CoordinacionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
