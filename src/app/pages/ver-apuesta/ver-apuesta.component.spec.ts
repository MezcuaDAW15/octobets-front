import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerApuestaComponent } from './ver-apuesta.component';

describe('VerApuestaComponent', () => {
  let component: VerApuestaComponent;
  let fixture: ComponentFixture<VerApuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerApuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerApuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
