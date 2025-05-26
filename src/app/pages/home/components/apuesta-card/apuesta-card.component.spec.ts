import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestaCardComponent } from './apuesta-card.component';

describe('ApuestaCardComponent', () => {
  let component: ApuestaCardComponent;
  let fixture: ComponentFixture<ApuestaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApuestaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
