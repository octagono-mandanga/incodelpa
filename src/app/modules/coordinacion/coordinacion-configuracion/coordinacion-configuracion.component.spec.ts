import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionConfiguracionComponent } from './coordinacion-configuracion.component';

describe('CoordinacionConfiguracionComponent', () => {
  let component: CoordinacionConfiguracionComponent;
  let fixture: ComponentFixture<CoordinacionConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinacionConfiguracionComponent]
    });
    fixture = TestBed.createComponent(CoordinacionConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
