import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootRolesAddComponent } from './root-roles-add.component';

describe('RootRolesAddComponent', () => {
  let component: RootRolesAddComponent;
  let fixture: ComponentFixture<RootRolesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootRolesAddComponent]
    });
    fixture = TestBed.createComponent(RootRolesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
