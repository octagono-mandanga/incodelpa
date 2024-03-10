import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootUsuariosEditComponent } from './root-usuarios-edit.component';

describe('RootUsuariosEditComponent', () => {
  let component: RootUsuariosEditComponent;
  let fixture: ComponentFixture<RootUsuariosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootUsuariosEditComponent]
    });
    fixture = TestBed.createComponent(RootUsuariosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
