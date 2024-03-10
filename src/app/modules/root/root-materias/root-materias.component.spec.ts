import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootMateriasComponent } from './root-materias.component';

describe('RootMateriasComponent', () => {
  let component: RootMateriasComponent;
  let fixture: ComponentFixture<RootMateriasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootMateriasComponent]
    });
    fixture = TestBed.createComponent(RootMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
