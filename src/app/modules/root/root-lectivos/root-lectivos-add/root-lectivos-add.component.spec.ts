import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootLectivosAddComponent } from './root-lectivos-add.component';

describe('RootLectivosAddComponent', () => {
  let component: RootLectivosAddComponent;
  let fixture: ComponentFixture<RootLectivosAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootLectivosAddComponent]
    });
    fixture = TestBed.createComponent(RootLectivosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
