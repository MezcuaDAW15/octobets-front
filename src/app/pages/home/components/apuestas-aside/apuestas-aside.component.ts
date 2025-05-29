import { Component, OnInit } from '@angular/core';
import { ApuestaCardComponent } from "../apuesta-card/apuesta-card.component";
import { CommonModule } from '@angular/common';
import { Apuesta } from '../../../../shared/models/apuesta.model';
import { Router, RouterLink } from '@angular/router';
import { ApuestasService } from '../../../../core/services/apuestas/apuestas.service';



@Component({
  selector: 'app-apuestas-aside',
  imports: [ApuestaCardComponent, CommonModule, RouterLink],
  templateUrl: './apuestas-aside.component.html',
  styleUrl: './apuestas-aside.component.scss'
})
export class ApuestasAsideComponent implements OnInit {

  apuestas: Apuesta[] = []

  constructor(
    private apuestasService: ApuestasService,
    private router: Router,

  ) { }
  ngOnInit(): void {
    this.apuestasService.getLast().subscribe((apuestas: Apuesta[]) => {
      this.apuestas = apuestas;
    });

  }


  verApuesta(id: string): void {
    this.router.navigate(['/apuestas', id]);
  }


}
