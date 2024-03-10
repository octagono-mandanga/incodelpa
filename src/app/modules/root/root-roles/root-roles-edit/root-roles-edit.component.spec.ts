import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootRolesEditComponent } from './root-roles-edit.component';

describe('RootRolesEditComponent', () => {
  let component: RootRolesEditComponent;
  let fixture: ComponentFixture<RootRolesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootRolesEditComponent]
    });
    fixture = TestBed.createComponent(RootRolesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
