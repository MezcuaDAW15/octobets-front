import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../shared/models/usuario.model';
import { Router } from '@angular/router';
import { filter, Observable, switchMap, take } from 'rxjs';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Apuesta, ApuestaEstado, ApuestaTipo } from '../../shared/models/apuesta.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administracion',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent implements OnInit {

  apuestas: Apuesta[] = [];
  filtradas: Apuesta[] = [];
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
        switchMap(u => this.apuestasService.getAllAdmin(u.id!))
      ).subscribe({
        next: apuestas => {
          this.apuestas = apuestas;
          this.filtrar();
        }, error: err => console.error('Error cargando apuestas', err)
      });
  }

  filtrar(): void {
    const s = this.search.toLowerCase();
    this.filtradas = this.apuestas
      .filter(a => !s || a.titulo.toLowerCase().includes(s))
      .filter(a => !this.filtroEstado || a.estado === this.filtroEstado)
      .filter(a => !this.filtroTipo || a.tipo === this.filtroTipo)
  }

  eliminar(apuesta: Apuesta): void {
    this.logged$
      .pipe(
        filter((u): u is Usuario => !!u),
        take(1),
        switchMap(u => this.apuestasService.eliminar(Number(apuesta.id), u.id!))
      ).subscribe({
        next: () => {
          this.alertsService.success("Eliminada", 'Apuesta eliminada correctamente');
          this.apuestas = this.apuestas.filter(a => a.id !== apuesta.id);
          this.filtrar();
        },
        error: err => {
          console.error('Error eliminando apuesta', err);
          this.alertsService.error("Error", 'Error al eliminar la apuesta');
        }
      });
  }

}
