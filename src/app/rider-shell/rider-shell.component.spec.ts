import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderShellComponent } from './rider-shell.component';

describe('RiderShellComponent', () => {
  let component: RiderShellComponent;
  let fixture: ComponentFixture<RiderShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
