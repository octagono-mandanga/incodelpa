import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoBuscarComponent } from './alumno-buscar.component';

describe('AlumnoBuscarComponent', () => {
  let component: AlumnoBuscarComponent;
  let fixture: ComponentFixture<AlumnoBuscarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoBuscarComponent]
    });
    fixture = TestBed.createComponent(AlumnoBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
