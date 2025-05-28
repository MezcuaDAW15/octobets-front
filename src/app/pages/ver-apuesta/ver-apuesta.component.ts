import { AuthService } from './../../core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  Apuesta,
  ApuestaEstado,
  ApuestaOpcion
} from '../../shared/models/apuesta.model';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { filter, finalize, of, switchMap, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';


type StakeGroup = FormGroup<{ stake: FormControl<number> }>;
type StakesArray = FormArray<StakeGroup>;

@Component({
  selector: 'app-ver-apuesta',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './ver-apuesta.component.html',
  styleUrls: ['./ver-apuesta.component.scss']
})
export class VerApuestaComponent implements OnInit {
  apuesta!: Apuesta;
  form!: FormGroup<{ stakes: StakesArray }>;
  apuestaEstado = ApuestaEstado;

  puedeApostar = false;

  showHelpModal = false;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alerts: AlertsService,
    private apuestasService: ApuestasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const idApuesta = +this.route.snapshot.params['id'];

    this.apuestasService.getById(idApuesta).pipe(
      switchMap(ap => {
        this.apuesta = ap;
        return this.authService.currentUser$.pipe(
          take(1),
          filter(u => true),
          switchMap(user => {
            const me = user ? String(user.id) : null;
            this.puedeApostar =
              ap.estado === ApuestaEstado.ABIERTA &&
              me !== ap.idCreador.toString();
            console.log('Puede apostar:', me, ap.idCreador, this.puedeApostar);

            if (this.puedeApostar) this.buildForm();

            return of(null);
          })
        );
      }),
      finalize(() => this.loading = false)

    ).subscribe({
      next: () => {
        console.log('HOALAAAAAAAAAAAAAAAAAAAAAaa');
        this.loading = false;
      },

      error: () => {
        this.alerts.error('Error', 'No se pudo cargar la apuesta.');
        this.loading = false;
        this.router.navigate(['/mis-apuestas']);
      }
    });
  }
  get opcionGanadora(): ApuestaOpcion | undefined {
    return this.apuesta?.opciones?.find(o => o.ganadora);
  }
  private buildForm(): void {
    const groups = this.apuesta.opciones.map(() =>
      this.fb.group({
        stake: this.fb.control<number | null>(null, [
          Validators.required,
          Validators.min(1)
        ])
      })
    );
    this.form = this.fb.group({
      stakes: this.fb.array(groups)
    }) as FormGroup<{ stakes: StakesArray }>;


    this.stakes.controls.forEach((group, i) => {
      group.controls.stake.valueChanges.subscribe(val => {
        const other = this.stakes.at(i === 0 ? 1 : 0).controls.stake;
        val && val >= 1 ? other.disable({ emitEvent: false })
          : other.enable({ emitEvent: false });
      });
    });
  }

  get stakes(): StakesArray {
    return this.form.controls.stakes;
  }

  apostar(index: number): void {
    if (!this.puedeApostar) return;
    if (this.form.invalid) {
      this.alerts.error('Importe inválido', 'Introduce al menos 1 ficha.');
      return;
    }

    const stakeCtrl = this.stakes.at(index).controls.stake;
    const amount = stakeCtrl.value;
    const opcion = this.apuesta.opciones[index];

    this.apuestasService.apostar(+opcion.id!, amount, opcion.cuota)
      .subscribe({
        next: () => {
          opcion.totalApostado += amount;
          this.alerts.success('Apuesta realizada',
            `Has apostado ${amount} € a "${opcion.descripcion}".`);
          stakeCtrl.reset();
        },
        error: (err: HttpErrorResponse) => {
          const api = typeof err.error === 'object' ? err.error as { code?: string; detail?: string } : null;
          const detail = api?.detail;
          this.alerts.error('Error', detail || 'No se pudo realizar la apuesta.');
        }
      });
  }

  barraProgreso(i: number): number {
    const total = this.apuesta.opciones.reduce((s, o) => s + o.totalApostado, 0);
    return total ? (this.apuesta.opciones[i].totalApostado / total) * 100 : 0;
  }

  volver(): void {
    this.router.navigate(['/mis-apuestas']);
  }

  openHelp(): void {
    this.showHelpModal = true;
  }

  closeHelp(): void {
    this.showHelpModal = false;
  }
}
