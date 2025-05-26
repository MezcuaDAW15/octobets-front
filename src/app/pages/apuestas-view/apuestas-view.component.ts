import { Component, inject, OnInit } from '@angular/core';
import { Apuesta, ApuestaEstado, ApuestaTipo } from '../../shared/models/apuesta.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApuestaBigCardComponent } from "./components/apuesta-big-card/apuesta-big-card.component";
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';

@Component({
  selector: 'app-apuestas-view',
  imports: [CommonModule, FormsModule, ApuestaBigCardComponent, MatIconModule],
  templateUrl: './apuestas-view.component.html',
  styleUrl: './apuestas-view.component.scss'
})
export class ApuestasViewComponent implements OnInit {

  apuestasList: Apuesta[] = [];
  apuestasFiltradas: Apuesta[] = [];
  tipos = Object.values(ApuestaTipo);

  showHelpModal = false;


  searchTerm = '';
  showFilters = false;
  selectedTipos = new Set<string>();

  constructor(
    private router: Router,
    private apuestasService: ApuestasService,

  ) { }

  ngOnInit() {
    this.cargarApuestas();


  }

  private cargarApuestas(): void {
    this.apuestasService.getAll().subscribe({
      next: (apuestas) => {
        this.apuestasList = apuestas;
        this.apuestasFiltradas = [...apuestas];
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error cargando apuestas', err);

      }
    });
  }

  goToMisApuestas(): void {
    this.router.navigate(['/mis-apuestas']);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleTipo(tipo: string): void {
    this.selectedTipos.has(tipo)
      ? this.selectedTipos.delete(tipo)
      : this.selectedTipos.add(tipo);
    this.applyFilter();
  }

  filtrarPorTexto(): void {
    this.applyFilter();
  }


  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();

    this.apuestasFiltradas = this.apuestasList.filter(a => {
      const matchText =
        a.titulo.toLowerCase().includes(term) ||
        a.descripcion.toLowerCase().includes(term);

      const matchTipo =
        this.selectedTipos.size === 0 || this.selectedTipos.has(a.tipo);

      return matchText && matchTipo;
    });
  }

  verApuesta(id: string): void {
    this.router.navigate(['/apuestas', id]);
  }

  openHelp(): void {
    this.showHelpModal = true;
  }

  closeHelp(): void {
    this.showHelpModal = false;
  }
}
