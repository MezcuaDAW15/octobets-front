import { AlertsService } from './../../core/services/alerts/alerts.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Apuesta, ApuestaEstado, ApuestaTipo } from '../../shared/models/apuesta.model';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../shared/models/usuario.model';
import { filter, Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-mis-apuestas',
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './mis-apuestas.component.html',
  styleUrl: './mis-apuestas.component.scss'
})
export class MisApuestasComponent {
  misApuestas: Apuesta[] = [];
  filtradas: Apuesta[] = [];

  idOpcionSeleccionada: string | null = null;
  apuestaResolver: Apuesta | null = null;

  search = '';
  filtroEstado: ApuestaEstado | '' = '';
  filtroTipo: ApuestaTipo | '' = '';

  estados = Object.values(ApuestaEstado);
  tipos = Object.values(ApuestaTipo);

  apuestaEstado = ApuestaEstado;
  logged$!: Observable<Usuario | null>;


  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private apuestasService: ApuestasService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {

    this.logged$ = this.authService.currentUser$;

    this.logged$
      .pipe(
        filter((u): u is Usuario => !!u),
        take(1),
        switchMap(u => this.apuestasService.getByUsuario(u.id!))
      ).subscribe({
        next: apuestas => {
          this.misApuestas = apuestas;
          this.filtrar();
        }, error: err => console.error('Error cargando apuestas', err)
      });
  }

  filtrar(): void {
    const s = this.search.toLowerCase();
    this.filtradas = this.misApuestas
      .filter(a => !s || a.titulo.toLowerCase().includes(s))
      .filter(a => !this.filtroEstado || a.estado === this.filtroEstado)
      .filter(a => !this.filtroTipo || a.tipo === this.filtroTipo)
  }

  cargarApuestas(): void {
    this.apuestasService.getByUsuario(1).subscribe(
      (apuestas: Apuesta[]) => {
        this.misApuestas = apuestas;
        this.filtrar();
      },
      error => {
        console.error('Error al cargar las apuestas:', error);
        this.alertsService.error(
          'Error',
          'No se pudieron cargar las apuestas.'
        );
      }
    );


  }


  crearNuevaApuesta(): void {
    this.router.navigate(['/apuestas/crear']);
  }

  cerrarApuesta(apuesta: Apuesta): void {

    this.alertsService.confirm(
      'Cerrar apuesta',
      `¿Estás seguro de que quieres cerrar “${apuesta.titulo}”?`
    ).then(confirmed => {
      if (confirmed) {
        this.apuestasService.cerrar(Number(apuesta.id)).subscribe({
          next: () => {
            apuesta.estado = ApuestaEstado.CERRADA;
            this.alertsService.success(
              'Apuesta cerrada',
              `Has cerrado la apuesta “${apuesta.titulo}”.`
            );
          },
          error: () => {
            this.alertsService.error('Error', 'No se pudo cerrar la apuesta.');
          }
        });

      }
    });


  }


  resolverApuesta(apuesta: Apuesta): void {

    this.apuestaResolver = apuesta;
    this.idOpcionSeleccionada = apuesta.opciones[0]?.id ?? null;
  }
  cancelResolve(): void {
    this.apuestaResolver = null;
    this.idOpcionSeleccionada = null;
  }
  confirmResolve(): void {
    if (!this.apuestaResolver || !this.idOpcionSeleccionada) return;

    const apuesta = this.apuestaResolver;
    const opcionGanadora = this.idOpcionSeleccionada;

    this.apuestasService.resolver(Number(apuesta.id), Number(opcionGanadora)).subscribe({
      next: updated => {
        apuesta.estado = ApuestaEstado.RESUELTA;
        apuesta.opciones.forEach(o => o.ganadora = (o.id === opcionGanadora));
        this.alertsService.success(
          'Apuesta resuelta',
          `Ganadora: "${apuesta.opciones.find(o => o.id === opcionGanadora)!.descripcion}".`
        );
        this.cancelResolve();
      },
      error: () => {
        this.alertsService.error('Error', 'No se pudo resolver la apuesta.');
        this.cancelResolve();
      }
    });
  }


  cancelarApuesta(apuesta: Apuesta): void {
    this.alertsService.confirm(
      'Cancelar apuesta',
      `¿Estás seguro de que quieres cancelar “${apuesta.titulo}”?`
    ).then(confirmed => {
      if (confirmed) {
        apuesta.estado = ApuestaEstado.CANCELADA;
        this.alertsService.error(
          'Apuesta cancelada',
          `Has cancelado la apuesta “${apuesta.titulo}”.`
        );
      }
    });
  }

  verApuesta(id: string): void {
    this.router.navigate(['/apuestas', id]);
  }


  gradientClass(estado: string): string {
    const normalizado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();

    switch (normalizado) {
      case ApuestaEstado.RESUELTA:
        return 'bg-gradient-to-r from-blue-950 to-surface';
      case ApuestaEstado.ABIERTA:
        return 'bg-gradient-to-r from-success-dark to-surface';
      case ApuestaEstado.CERRADA:
        return 'bg-gradient-to-r from-amber-400 to-surface';
      case ApuestaEstado.CANCELADA:
        return 'bg-gradient-to-r from-danger to-surface';
      default:
        return 'bg-surface-light';
    }
  }
}

