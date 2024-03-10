import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAreasComponent } from './root-areas.component';

describe('RootAreasComponent', () => {
  let component: RootAreasComponent;
  let fixture: ComponentFixture<RootAreasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootAreasComponent]
    });
    fixture = TestBed.createComponent(RootAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
