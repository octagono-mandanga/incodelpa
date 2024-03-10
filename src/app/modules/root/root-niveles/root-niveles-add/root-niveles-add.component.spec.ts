import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootNivelesAddComponent } from './root-niveles-add.component';

describe('RootNivelesAddComponent', () => {
  let component: RootNivelesAddComponent;
  let fixture: ComponentFixture<RootNivelesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootNivelesAddComponent]
    });
    fixture = TestBed.createComponent(RootNivelesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
