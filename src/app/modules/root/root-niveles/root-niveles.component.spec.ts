import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootNivelesComponent } from './root-niveles.component';

describe('RootNivelesComponent', () => {
  let component: RootNivelesComponent;
  let fixture: ComponentFixture<RootNivelesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootNivelesComponent]
    });
    fixture = TestBed.createComponent(RootNivelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
