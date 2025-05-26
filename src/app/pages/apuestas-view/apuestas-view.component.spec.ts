import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestasViewComponent } from './apuestas-view.component';

describe('ApuestasViewComponent', () => {
  let component: ApuestasViewComponent;
  let fixture: ComponentFixture<ApuestasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApuestasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
