import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootGradosComponent } from './root-grados.component';

describe('RootGradosComponent', () => {
  let component: RootGradosComponent;
  let fixture: ComponentFixture<RootGradosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootGradosComponent]
    });
    fixture = TestBed.createComponent(RootGradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
