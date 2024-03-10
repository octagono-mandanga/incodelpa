import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPeriodosAddComponent } from './root-periodos-add.component';

describe('RootPeriodosAddComponent', () => {
  let component: RootPeriodosAddComponent;
  let fixture: ComponentFixture<RootPeriodosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootPeriodosAddComponent]
    });
    fixture = TestBed.createComponent(RootPeriodosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
