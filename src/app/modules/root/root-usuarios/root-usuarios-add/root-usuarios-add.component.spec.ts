import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootUsuariosAddComponent } from './root-usuarios-add.component';

describe('RootUsuariosAddComponent', () => {
  let component: RootUsuariosAddComponent;
  let fixture: ComponentFixture<RootUsuariosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootUsuariosAddComponent]
    });
    fixture = TestBed.createComponent(RootUsuariosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
