import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPerfilComponent } from './root-perfil.component';

describe('RootPerfilComponent', () => {
  let component: RootPerfilComponent;
  let fixture: ComponentFixture<RootPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootPerfilComponent]
    });
    fixture = TestBed.createComponent(RootPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
