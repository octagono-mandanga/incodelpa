import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteConfiguracionComponent } from './docente-configuracion.component';

describe('DocenteConfiguracionComponent', () => {
  let component: DocenteConfiguracionComponent;
  let fixture: ComponentFixture<DocenteConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteConfiguracionComponent]
    });
    fixture = TestBed.createComponent(DocenteConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
