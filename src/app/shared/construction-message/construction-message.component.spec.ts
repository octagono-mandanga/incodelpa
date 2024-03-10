import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionMessageComponent } from './construction-message.component';

describe('ConstructionMessageComponent', () => {
  let component: ConstructionMessageComponent;
  let fixture: ComponentFixture<ConstructionMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionMessageComponent]
    });
    fixture = TestBed.createComponent(ConstructionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
