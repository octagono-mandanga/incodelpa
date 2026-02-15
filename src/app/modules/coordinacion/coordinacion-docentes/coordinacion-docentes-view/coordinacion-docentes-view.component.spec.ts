import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionDocentesViewComponent } from './coordinacion-docentes-view.component';

describe('CoordinacionDocentesViewComponent', () => {
  let component: CoordinacionDocentesViewComponent;
  let fixture: ComponentFixture<CoordinacionDocentesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionDocentesViewComponent]
    });
    fixture = TestBed.createComponent(CoordinacionDocentesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
