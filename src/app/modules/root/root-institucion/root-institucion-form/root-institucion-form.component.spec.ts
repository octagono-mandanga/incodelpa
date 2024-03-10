import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootInstitucionFormComponent } from './root-institucion-form.component';

describe('RootInstitucionFormComponent', () => {
  let component: RootInstitucionFormComponent;
  let fixture: ComponentFixture<RootInstitucionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootInstitucionFormComponent]
    });
    fixture = TestBed.createComponent(RootInstitucionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
