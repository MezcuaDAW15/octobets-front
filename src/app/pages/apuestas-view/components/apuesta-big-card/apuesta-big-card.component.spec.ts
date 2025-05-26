import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaBigCardComponent } from './apuesta-big-card.component';

describe('ApuestaBigCardComponent', () => {
  let component: ApuestaBigCardComponent;
  let fixture: ComponentFixture<ApuestaBigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestaBigCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApuestaBigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
