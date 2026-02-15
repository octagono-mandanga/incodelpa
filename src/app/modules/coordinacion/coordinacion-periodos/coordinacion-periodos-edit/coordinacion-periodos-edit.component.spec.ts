import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionPeriodosEditComponent } from './coordinacion-periodos-edit.component';

describe('CoordinacionPeriodosEditComponent', () => {
  let component: CoordinacionPeriodosEditComponent;
  let fixture: ComponentFixture<CoordinacionPeriodosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionPeriodosEditComponent]
    });
    fixture = TestBed.createComponent(CoordinacionPeriodosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
