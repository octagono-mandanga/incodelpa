import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSedesAddComponent } from './root-sedes-add.component';

describe('RootSedesAddComponent', () => {
  let component: RootSedesAddComponent;
  let fixture: ComponentFixture<RootSedesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootSedesAddComponent]
    });
    fixture = TestBed.createComponent(RootSedesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
