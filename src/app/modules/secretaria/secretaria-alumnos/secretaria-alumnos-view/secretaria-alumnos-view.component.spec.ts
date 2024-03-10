import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaAlumnosViewComponent } from './secretaria-alumnos-view.component';

describe('SecretariaAlumnosViewComponent', () => {
  let component: SecretariaAlumnosViewComponent;
  let fixture: ComponentFixture<SecretariaAlumnosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaAlumnosViewComponent]
    });
    fixture = TestBed.createComponent(SecretariaAlumnosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
