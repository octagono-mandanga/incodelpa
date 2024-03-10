import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootInstitucionComponent } from './root-institucion.component';

describe('RootInstitucionComponent', () => {
  let component: RootInstitucionComponent;
  let fixture: ComponentFixture<RootInstitucionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootInstitucionComponent]
    });
    fixture = TestBed.createComponent(RootInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
