import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DineroComponent } from './dinero.component';

describe('DineroComponent', () => {
  let component: DineroComponent;
  let fixture: ComponentFixture<DineroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DineroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DineroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
