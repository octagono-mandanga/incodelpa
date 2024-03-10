import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionDocentesAddComponent } from './coordinacion-docentes-add.component';

describe('CoordinacionDocentesAddComponent', () => {
  let component: CoordinacionDocentesAddComponent;
  let fixture: ComponentFixture<CoordinacionDocentesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionDocentesAddComponent]
    });
    fixture = TestBed.createComponent(CoordinacionDocentesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
