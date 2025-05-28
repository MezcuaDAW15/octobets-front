import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Apuesta, ApuestaEstado, ApuestaOpcion, ApuestaTipo } from '../../shared/models/apuesta.model';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { Router } from '@angular/router';
import { ApuestasService } from '../../core/services/apuestas/apuestas.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Observable, take, switchMap, finalize } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-apuesta',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './crear-apuesta.component.html',
  styleUrl: './crear-apuesta.component.scss'
})
export class CrearApuestaComponent implements OnInit {
  tipos = Object.values(ApuestaTipo);

  form!: FormGroup;

  showHelpModal = false;

  userLoaded = false;
  loggedIn = false;

  logged$!: Observable<Usuario | null>;

  loading = true;


  constructor(
    private fb: FormBuilder,
    private alerts: AlertsService,
    private router: Router,
    private apuestasService: ApuestasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.logged$ = this.authService.currentUser$;
    this.logged$.pipe(
      take(1)
    ).subscribe(user => {
      this.loggedIn = !!user;
      this.userLoaded = true;

      // 2) Cuando ya sepamos si hay usuario, montamos el formulario
      this.initForm();
      this.loading = false;
    });

  }
  private initForm() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: [''],
      tipo: ['', Validators.required],
      op1: ['', Validators.required],
      op2: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (!user) {
          this.alerts.error('Sesión', 'Debes iniciar sesión para crear una apuesta');
          return;
        }

        const { titulo, descripcion, tipo, op1, op2 } = this.form.value;

        const opciones: ApuestaOpcion[] = [
          { descripcion: op1, cuota: 2, ganadora: false, totalApostado: 0 },
          { descripcion: op2, cuota: 2, ganadora: false, totalApostado: 0 }
        ];

        const nueva: Apuesta = {
          idCreador: user.id!,
          titulo,
          descripcion,
          tipo: tipo.toUpperCase() as ApuestaTipo,
          fechaCreacion: new Date().toISOString(),
          estado: ApuestaEstado.ABIERTA.toUpperCase() as ApuestaEstado,
          opciones
        };

        this.apuestasService.crearApuesta(nueva).subscribe({
          next: () => {
            console.log('Apuesta creada:', nueva);
            this.alerts.success('Apuesta creada', 'Tu apuesta se ha guardado correctamente.');
            this.router.navigate(['/mis-apuestas']);
          },
          error: (err: HttpErrorResponse) => {
            const api = typeof err.error === 'object' ? err.error as { code?: string; detail?: string } : null;
            const detail = api?.detail;
            this.alerts.error('Error', detail || 'No se pudo crear la apuesta.');
          }
        });
      },
      error: () => this.alerts.error('Error', 'No se pudo obtener el usuario')
    });
  }


  openHelp(): void {
    this.showHelpModal = true;
  }

  closeHelp(): void {
    this.showHelpModal = false;
  }

}
