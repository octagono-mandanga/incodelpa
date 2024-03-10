import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootUsuariosComponent } from './root-usuarios.component';

describe('RootUsuariosComponent', () => {
  let component: RootUsuariosComponent;
  let fixture: ComponentFixture<RootUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootUsuariosComponent]
    });
    fixture = TestBed.createComponent(RootUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
