import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCursosComponent } from './docente-cursos.component';

describe('DocenteCursosComponent', () => {
  let component: DocenteCursosComponent;
  let fixture: ComponentFixture<DocenteCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCursosComponent]
    });
    fixture = TestBed.createComponent(DocenteCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
