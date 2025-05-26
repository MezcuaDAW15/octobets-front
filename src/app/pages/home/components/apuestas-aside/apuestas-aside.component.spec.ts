import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuestasAsideComponent } from './apuestas-aside.component';

describe('ApuestasAsideComponent', () => {
  let component: ApuestasAsideComponent;
  let fixture: ComponentFixture<ApuestasAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApuestasAsideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApuestasAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
