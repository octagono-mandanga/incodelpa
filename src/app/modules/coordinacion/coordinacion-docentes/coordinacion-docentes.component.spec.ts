import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionDocentesComponent } from './coordinacion-docentes.component';

describe('CoordinacionDocentesComponent', () => {
  let component: CoordinacionDocentesComponent;
  let fixture: ComponentFixture<CoordinacionDocentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionDocentesComponent]
    });
    fixture = TestBed.createComponent(CoordinacionDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
