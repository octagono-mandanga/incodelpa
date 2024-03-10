import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootMateriasAddComponent } from './root-materias-add.component';

describe('RootMateriasAddComponent', () => {
  let component: RootMateriasAddComponent;
  let fixture: ComponentFixture<RootMateriasAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootMateriasAddComponent]
    });
    fixture = TestBed.createComponent(RootMateriasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
