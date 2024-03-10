import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoNotasComponent } from './curso-notas.component';

describe('CursoNotasComponent', () => {
  let component: CursoNotasComponent;
  let fixture: ComponentFixture<CursoNotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoNotasComponent]
    });
    fixture = TestBed.createComponent(CursoNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
