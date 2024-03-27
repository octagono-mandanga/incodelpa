import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCalificarComponent } from './docente-calificar.component';

describe('DocenteCalificarComponent', () => {
  let component: DocenteCalificarComponent;
  let fixture: ComponentFixture<DocenteCalificarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCalificarComponent]
    });
    fixture = TestBed.createComponent(DocenteCalificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
