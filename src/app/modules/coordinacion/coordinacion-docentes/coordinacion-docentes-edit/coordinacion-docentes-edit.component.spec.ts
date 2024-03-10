import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionDocentesEditComponent } from './coordinacion-docentes-edit.component';

describe('CoordinacionDocentesEditComponent', () => {
  let component: CoordinacionDocentesEditComponent;
  let fixture: ComponentFixture<CoordinacionDocentesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionDocentesEditComponent]
    });
    fixture = TestBed.createComponent(CoordinacionDocentesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
