import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaModificarComponent } from './matricula-modificar.component';

describe('MatriculaModificarComponent', () => {
  let component: MatriculaModificarComponent;
  let fixture: ComponentFixture<MatriculaModificarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatriculaModificarComponent]
    });
    fixture = TestBed.createComponent(MatriculaModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
