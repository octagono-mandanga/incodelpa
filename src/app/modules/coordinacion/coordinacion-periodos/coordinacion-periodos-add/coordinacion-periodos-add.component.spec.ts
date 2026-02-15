import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionPeriodosAddComponent } from './coordinacion-periodos-add.component';

describe('CoordinacionPeriodosAddComponent', () => {
  let component: CoordinacionPeriodosAddComponent;
  let fixture: ComponentFixture<CoordinacionPeriodosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionPeriodosAddComponent]
    });
    fixture = TestBed.createComponent(CoordinacionPeriodosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
