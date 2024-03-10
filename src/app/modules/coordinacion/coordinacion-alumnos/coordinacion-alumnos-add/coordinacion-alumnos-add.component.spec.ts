import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionAlumnosAddComponent } from './coordinacion-alumnos-add.component';

describe('CoordinacionAlumnosAddComponent', () => {
  let component: CoordinacionAlumnosAddComponent;
  let fixture: ComponentFixture<CoordinacionAlumnosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionAlumnosAddComponent]
    });
    fixture = TestBed.createComponent(CoordinacionAlumnosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
