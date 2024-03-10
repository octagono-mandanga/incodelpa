import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaReportesComponent } from './secretaria-reportes.component';

describe('SecretariaReportesComponent', () => {
  let component: SecretariaReportesComponent;
  let fixture: ComponentFixture<SecretariaReportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretariaReportesComponent]
    });
    fixture = TestBed.createComponent(SecretariaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
