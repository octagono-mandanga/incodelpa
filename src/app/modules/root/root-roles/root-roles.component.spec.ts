import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootRolesComponent } from './root-roles.component';

describe('RootRolesComponent', () => {
  let component: RootRolesComponent;
  let fixture: ComponentFixture<RootRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootRolesComponent]
    });
    fixture = TestBed.createComponent(RootRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
