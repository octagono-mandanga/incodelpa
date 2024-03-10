import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootMateriasEditComponent } from './root-materias-edit.component';

describe('RootMateriasEditComponent', () => {
  let component: RootMateriasEditComponent;
  let fixture: ComponentFixture<RootMateriasEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootMateriasEditComponent]
    });
    fixture = TestBed.createComponent(RootMateriasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
