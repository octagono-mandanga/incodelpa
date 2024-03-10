import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootBackupComponent } from './root-backup.component';

describe('RootBackupComponent', () => {
  let component: RootBackupComponent;
  let fixture: ComponentFixture<RootBackupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootBackupComponent]
    });
    fixture = TestBed.createComponent(RootBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
