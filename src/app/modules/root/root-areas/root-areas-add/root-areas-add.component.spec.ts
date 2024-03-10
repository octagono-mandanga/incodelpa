import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAreasAddComponent } from './root-areas-add.component';

describe('RootAreasAddComponent', () => {
  let component: RootAreasAddComponent;
  let fixture: ComponentFixture<RootAreasAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootAreasAddComponent]
    });
    fixture = TestBed.createComponent(RootAreasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
