import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionUnderconstructionComponent } from './coordinacion-underconstruction.component';

describe('CoordinacionUnderconstructionComponent', () => {
  let component: CoordinacionUnderconstructionComponent;
  let fixture: ComponentFixture<CoordinacionUnderconstructionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionUnderconstructionComponent]
    });
    fixture = TestBed.createComponent(CoordinacionUnderconstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
