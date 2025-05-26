import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisApuestasComponent } from './mis-apuestas.component';

describe('MisApuestasComponent', () => {
  let component: MisApuestasComponent;
  let fixture: ComponentFixture<MisApuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisApuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisApuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
