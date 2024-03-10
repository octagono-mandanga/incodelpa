import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootLectivosEditComponent } from './root-lectivos-edit.component';

describe('RootLectivosEditComponent', () => {
  let component: RootLectivosEditComponent;
  let fixture: ComponentFixture<RootLectivosEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootLectivosEditComponent]
    });
    fixture = TestBed.createComponent(RootLectivosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
