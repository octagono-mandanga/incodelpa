import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAreasEditComponent } from './root-areas-edit.component';

describe('RootAreasEditComponent', () => {
  let component: RootAreasEditComponent;
  let fixture: ComponentFixture<RootAreasEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootAreasEditComponent]
    });
    fixture = TestBed.createComponent(RootAreasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
