import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { DineroService } from '../../../../core/services/dinero/dinero.service';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dinero',
  imports: [MatIconModule, CommonModule],
  templateUrl: './dinero.component.html',
  styleUrl: './dinero.component.scss'
})
export class DineroComponent implements OnInit {

  saldo$!: Observable<number>;

  constructor(
    private dineroService: DineroService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.saldo$ = this.dineroService.saldo$;
    this.saldo$.subscribe(saldo => console.log('Saldo recibido:', saldo));

  }

  /** Recarga 100 fichas (demo) */
  addFichas(): void {
    console.log('Recargando falso saldo');
  }

  ajustes(): void {
    this.router.navigate(['/ajustes']);
  }
}
