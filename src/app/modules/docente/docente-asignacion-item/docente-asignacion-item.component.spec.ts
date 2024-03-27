import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteAsignacionItemComponent } from './docente-asignacion-item.component';

describe('DocenteAsignacionItemComponent', () => {
  let component: DocenteAsignacionItemComponent;
  let fixture: ComponentFixture<DocenteAsignacionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteAsignacionItemComponent]
    });
    fixture = TestBed.createComponent(DocenteAsignacionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
