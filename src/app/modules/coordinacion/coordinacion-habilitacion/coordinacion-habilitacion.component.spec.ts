import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionHabilitacionComponent } from './coordinacion-habilitacion.component';

describe('CoordinacionHabilitacionComponent', () => {
  let component: CoordinacionHabilitacionComponent;
  let fixture: ComponentFixture<CoordinacionHabilitacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionHabilitacionComponent]
    });
    fixture = TestBed.createComponent(CoordinacionHabilitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
