import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CarteraService, Transaccion } from '../../core/services/cartera/cartera.service';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transacciones',
  imports: [CommonModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.scss'
})
export class TransaccionesComponent implements OnInit {

  transacciones = signal<Transaccion[]>([]);
  loading = signal(false);

  constructor(
    private cartera: CarteraService,
    private alerts: AlertsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loading.set(true);
    this.cartera.listTransactions().subscribe({
      next: txs => this.transacciones.set(txs),
      error: () => this.alerts.error('Error', 'No se pudieron cargar las transacciones.'),
      complete: () => this.loading.set(false)
    });
  }
  toFormat(estado: string): string {

    switch (estado) {
      case 'PENDING':
        return 'Pendiente';
      case 'SUCCEEDED':
        return 'Completada';
      case 'FAILED':
        return 'Fallida';
      default:
        return estado.toLocaleLowerCase();
    }
  }
}
