import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosEditComponent } from './coordinacion-cursos-edit.component';

describe('CoordinacionCursosEditComponent', () => {
  let component: CoordinacionCursosEditComponent;
  let fixture: ComponentFixture<CoordinacionCursosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosEditComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
