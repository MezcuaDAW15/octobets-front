import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusBannerComponent } from './bonus-banner.component';

describe('BonusBannerComponent', () => {
  let component: BonusBannerComponent;
  let fixture: ComponentFixture<BonusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
