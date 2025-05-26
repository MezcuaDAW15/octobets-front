import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsGridComponent } from './slots-grid.component';

describe('SlotsGridComponent', () => {
  let component: SlotsGridComponent;
  let fixture: ComponentFixture<SlotsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
