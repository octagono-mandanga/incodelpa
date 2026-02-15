import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionHabilitacionItemComponent } from './coordinacion-habilitacion-item.component';

describe('CoordinacionHabilitacionItemComponent', () => {
  let component: CoordinacionHabilitacionItemComponent;
  let fixture: ComponentFixture<CoordinacionHabilitacionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionHabilitacionItemComponent]
    });
    fixture = TestBed.createComponent(CoordinacionHabilitacionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
