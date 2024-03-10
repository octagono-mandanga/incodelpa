import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSedesEditComponent } from './root-sedes-edit.component';

describe('RootSedesEditComponent', () => {
  let component: RootSedesEditComponent;
  let fixture: ComponentFixture<RootSedesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootSedesEditComponent]
    });
    fixture = TestBed.createComponent(RootSedesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
