import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteNotasExtrasComponent } from './docente-notas-extras.component';

describe('DocenteNotasExtrasComponent', () => {
  let component: DocenteNotasExtrasComponent;
  let fixture: ComponentFixture<DocenteNotasExtrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteNotasExtrasComponent]
    });
    fixture = TestBed.createComponent(DocenteNotasExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
