import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaCursosViewComponent } from './secretaria-cursos-view.component';

describe('SecretariaCursosViewComponent', () => {
  let component: SecretariaCursosViewComponent;
  let fixture: ComponentFixture<SecretariaCursosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaCursosViewComponent]
    });
    fixture = TestBed.createComponent(SecretariaCursosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
