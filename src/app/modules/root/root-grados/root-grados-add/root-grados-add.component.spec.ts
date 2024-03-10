import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootGradosAddComponent } from './root-grados-add.component';

describe('RootGradosAddComponent', () => {
  let component: RootGradosAddComponent;
  let fixture: ComponentFixture<RootGradosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootGradosAddComponent]
    });
    fixture = TestBed.createComponent(RootGradosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
