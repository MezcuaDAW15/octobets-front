import { Component, OnInit } from '@angular/core';
import { ApuestasAsideComponent } from "./components/apuestas-aside/apuestas-aside.component";
import { BonusBannerComponent } from "./components/bonus-banner/bonus-banner.component";
import { DineroComponent } from "./components/dinero/dinero.component";
import { Apuesta } from '../../shared/models/apuesta.model';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { Router } from '@angular/router';
import { ApuestaBigCardComponent } from '../apuestas-view/components/apuesta-big-card/apuesta-big-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ApuestasAsideComponent, CommonModule, BonusBannerComponent, DineroComponent, ApuestaBigCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  topApuestas: Apuesta[] = [];

  constructor(
    private apuestasService: ApuestasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apuestasService.getTop().subscribe(arr => {
      this.topApuestas = [...arr]
        .sort((a, b) =>
          sumaFichas(b) - sumaFichas(a)
        )
        .slice(0, 10);
    });

    function sumaFichas(a: Apuesta): number {
      return a.opciones.reduce((s, o) => s + (o.totalApostado ?? 0), 0);
    }
  }

  verApuesta(id: string): void {
    this.router.navigate(['/apuestas', id]);
  }
}
