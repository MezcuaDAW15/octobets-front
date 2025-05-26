import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApuestaEstado, ApuestaTipo, Ticket } from '../../shared/models/apuesta.model';
import { FormsModule } from '@angular/forms';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { filter, Observable, switchMap, take } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-mis-tickets',
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './mis-tickets.component.html',
  styleUrl: './mis-tickets.component.scss'
})
export class MisTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];

  showHelpModal = false;

  apuestaEstado = ApuestaEstado;

  logged$!: Observable<Usuario | null>;

  // filtros
  search = '';
  filtroEstado: ApuestaEstado | '' = '';
  filtroTipo: ApuestaTipo | '' = '';
  soloGanadoras = false;

  // enums para opciones de filtro
  estados = Object.values(ApuestaEstado);
  tipos = Object.values(ApuestaTipo);
  constructor(
    private apuestasService: ApuestasService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.logged$ = this.authService.currentUser$;

    this.logged$
      .pipe(
        filter((u): u is Usuario => !!u),
        take(1),
        switchMap(u => this.apuestasService.getTickets(u.id!))
      )
      .subscribe({
        next: tickets => {
          this.tickets = tickets;
          this.filtrar();
        },
        error: err => console.error('Error cargando tickets', err)
      });
  }

  filtrar(): void {

    const s = this.search.toLowerCase();
    this.ticketsFiltrados = this.tickets
      .filter(t => !s || t.apuestaTitulo.toLowerCase().includes(s))
      .filter(t => !this.filtroEstado || t.estado === this.filtroEstado)
      .filter(t => !this.filtroTipo || t.tipo === this.filtroTipo)
      .filter(t => !this.soloGanadoras || t.ganadora);
  }

  private cargarTickets(): void {
    this.apuestasService.getTickets(1).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filtrar();
      },
      error: (error) => {
        console.error('Error al cargar los tickets', error);
      }
    });

  }

  openHelp(): void {
    this.showHelpModal = true;
  }

  closeHelp(): void {
    this.showHelpModal = false;
  }




}
