import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionCursosViewComponent } from './coordinacion-cursos-view.component';

describe('CoordinacionCursosViewComponent', () => {
  let component: CoordinacionCursosViewComponent;
  let fixture: ComponentFixture<CoordinacionCursosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionCursosViewComponent]
    });
    fixture = TestBed.createComponent(CoordinacionCursosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
