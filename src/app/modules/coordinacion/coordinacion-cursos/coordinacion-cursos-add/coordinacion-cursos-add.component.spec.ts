import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosAddComponent } from './coordinacion-cursos-add.component';

describe('CoordinacionCursosAddComponent', () => {
  let component: CoordinacionCursosAddComponent;
  let fixture: ComponentFixture<CoordinacionCursosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosAddComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
