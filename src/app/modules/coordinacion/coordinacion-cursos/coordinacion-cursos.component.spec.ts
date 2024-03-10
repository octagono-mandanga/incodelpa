import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosComponent } from './coordinacion-cursos.component';

describe('CoordinacionCursosComponent', () => {
  let component: CoordinacionCursosComponent;
  let fixture: ComponentFixture<CoordinacionCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
