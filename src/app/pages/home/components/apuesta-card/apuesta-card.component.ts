import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApuestaEstado, ApuestaTipo } from '../../../../shared/models/apuesta.model';

@Component({
  selector: 'app-apuesta-card',
  imports: [CommonModule],
  templateUrl: './apuesta-card.component.html',
  styleUrl: './apuesta-card.component.scss'
})
export class ApuestaCardComponent {
  @Input() titulo!: string
  @Input() estado: ApuestaEstado | undefined;
  @Input() cuotas: [number, number] = [0, 0]

}
