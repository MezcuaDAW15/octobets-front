import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApuestaEstado, ApuestaTipo } from '../../../../shared/models/apuesta.model';

@Component({
  selector: 'app-apuesta-big-card',
  imports: [CommonModule],
  templateUrl: './apuesta-big-card.component.html',
  styleUrl: './apuesta-big-card.component.scss'
})
export class ApuestaBigCardComponent {


  @Input() titulo!: string;

  @Input() descripcion: string = '';

  @Input() tipo: ApuestaTipo | undefined;

  @Input() estado: ApuestaEstado | undefined;;

  @Input() cuotas: [number, number] = [0, 0];

  @Input() descriptions: [string, string] = ['', ''];


  cuotaIndexMap = new Map<number, number>();

  imgUrl = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipo']) {
      this.imgUrl = `url('/assets/images/backgrounds/${this.tipo}.svg')`;
    }
  }
}
