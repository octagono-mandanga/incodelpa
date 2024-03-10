import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootConfiguracionComponent } from './root-configuracion.component';

describe('RootConfiguracionComponent', () => {
  let component: RootConfiguracionComponent;
  let fixture: ComponentFixture<RootConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootConfiguracionComponent]
    });
    fixture = TestBed.createComponent(RootConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
