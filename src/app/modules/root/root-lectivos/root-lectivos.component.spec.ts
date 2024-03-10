import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootLectivosComponent } from './root-lectivos.component';

describe('RootLectivosComponent', () => {
  let component: RootLectivosComponent;
  let fixture: ComponentFixture<RootLectivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootLectivosComponent]
    });
    fixture = TestBed.createComponent(RootLectivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
