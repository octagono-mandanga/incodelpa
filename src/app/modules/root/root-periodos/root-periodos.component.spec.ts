import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPeriodosComponent } from './root-periodos.component';

describe('RootPeriodosComponent', () => {
  let component: RootPeriodosComponent;
  let fixture: ComponentFixture<RootPeriodosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootPeriodosComponent]
    });
    fixture = TestBed.createComponent(RootPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
