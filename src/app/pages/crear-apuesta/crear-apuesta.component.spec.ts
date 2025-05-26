import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearApuestaComponent } from './crear-apuesta.component';

describe('CrearApuestaComponent', () => {
  let component: CrearApuestaComponent;
  let fixture: ComponentFixture<CrearApuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearApuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearApuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
