import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootGradosEditComponent } from './root-grados-edit.component';

describe('RootGradosEditComponent', () => {
  let component: RootGradosEditComponent;
  let fixture: ComponentFixture<RootGradosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootGradosEditComponent]
    });
    fixture = TestBed.createComponent(RootGradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
