import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInDialogComponent } from './log-in-dialog.component';

describe('LogInDialogComponent', () => {
  let component: LogInDialogComponent;
  let fixture: ComponentFixture<LogInDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogInDialogComponent]
    });
    fixture = TestBed.createComponent(LogInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
