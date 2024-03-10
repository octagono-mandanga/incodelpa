import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaDocentesViewComponent } from './secretaria-docentes-view.component';

describe('SecretariaDocentesViewComponent', () => {
  let component: SecretariaDocentesViewComponent;
  let fixture: ComponentFixture<SecretariaDocentesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaDocentesViewComponent]
    });
    fixture = TestBed.createComponent(SecretariaDocentesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
