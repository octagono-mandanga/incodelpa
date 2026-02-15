import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionPeriodosComponent } from './coordinacion-periodos.component';

describe('CoordinacionPeriodosComponent', () => {
  let component: CoordinacionPeriodosComponent;
  let fixture: ComponentFixture<CoordinacionPeriodosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionPeriodosComponent]
    });
    fixture = TestBed.createComponent(CoordinacionPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
