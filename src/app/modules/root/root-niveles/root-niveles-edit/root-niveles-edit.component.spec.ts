import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootNivelesEditComponent } from './root-niveles-edit.component';

describe('RootNivelesEditComponent', () => {
  let component: RootNivelesEditComponent;
  let fixture: ComponentFixture<RootNivelesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootNivelesEditComponent]
    });
    fixture = TestBed.createComponent(RootNivelesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
