import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseCompareComponent } from './license-compare.component';

describe('LicenseCompareComponent', () => {
  let component: LicenseCompareComponent;
  let fixture: ComponentFixture<LicenseCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
