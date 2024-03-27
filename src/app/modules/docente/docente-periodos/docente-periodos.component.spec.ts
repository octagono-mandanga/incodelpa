import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentePeriodosComponent } from './docente-periodos.component';

describe('DocentePeriodosComponent', () => {
  let component: DocentePeriodosComponent;
  let fixture: ComponentFixture<DocentePeriodosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocentePeriodosComponent]
    });
    fixture = TestBed.createComponent(DocentePeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
