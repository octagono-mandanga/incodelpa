import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteCursosItemComponent } from './docente-cursos-item.component';

describe('DocenteCursosItemComponent', () => {
  let component: DocenteCursosItemComponent;
  let fixture: ComponentFixture<DocenteCursosItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteCursosItemComponent]
    });
    fixture = TestBed.createComponent(DocenteCursosItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
