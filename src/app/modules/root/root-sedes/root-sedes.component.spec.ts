import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSedesComponent } from './root-sedes.component';

describe('RootSedesComponent', () => {
  let component: RootSedesComponent;
  let fixture: ComponentFixture<RootSedesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootSedesComponent]
    });
    fixture = TestBed.createComponent(RootSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
