import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasxalumnoComponent } from './notasxalumno.component';

describe('NotasxalumnoComponent', () => {
  let component: NotasxalumnoComponent;
  let fixture: ComponentFixture<NotasxalumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotasxalumnoComponent]
    });
    fixture = TestBed.createComponent(NotasxalumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
