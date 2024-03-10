import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPeriodosEditComponent } from './root-periodos-edit.component';

describe('RootPeriodosEditComponent', () => {
  let component: RootPeriodosEditComponent;
  let fixture: ComponentFixture<RootPeriodosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootPeriodosEditComponent]
    });
    fixture = TestBed.createComponent(RootPeriodosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
