import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../shared/models/usuario.model';
import { UsuariosService } from '../../core/services/usuarios/usuarios.service';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { filter, Observable, take } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return (pass && confirm && pass !== confirm) ? { mismatch: true } : null;
}

@Component({
  selector: 'app-usuario-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './usuario-config.component.html'
})
export class UsuarioConfigComponent implements OnInit {
  usuario!: Usuario;
  loading = false;
  loadingPassword = false;
  formError = '';


  avatars = [
    'octo-purple.png', 'octo-green.png', 'octo-blue.png',
    'octo-red.png', 'octo-yellow.png', 'octo-black.png'
  ];
  selectedAvatar = '';

  form!: FormGroup;
  passwordForm!: FormGroup;

  showPasswordModal = false;

  logged$!: Observable<Usuario | null>;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private alerts: AlertsService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.logged$ = this.authService.currentUser$;

    this.logged$
      .pipe(
        filter((u): u is Usuario => !!u),
        take(1)
      )
      .subscribe(u => {

        this.initForms(u);
      });

  }
  private initForms(u: Usuario): void {

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      avatar: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatchValidator });

    this.usuario = u;
    this.selectedAvatar = u.avatar ?? this.avatars[0];
    this.form.patchValue({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      username: u.username,
      avatar: this.selectedAvatar
    });

  }


  guardar(): void {
    this.formError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const updated = {
      ...this.usuario,
      ...this.form.value,
      avatar: this.selectedAvatar
    };
    this.usuariosService.updateUser(updated).subscribe({
      next: () => {
        this.alerts.success('Guardado', 'Datos actualizados correctamente');
        this.loading = false;
        this.authService.refreshUser();

      },
      error: (err: HttpErrorResponse) => {
        const api = typeof err.error === 'object' ? err.error as { code?: string; detail?: string } : null;
        const detail = api?.detail;
        this.formError = detail || 'No se pudo guardar';
        this.loading = false;
      }
    });
  }

  openPasswordModal(): void {
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  cancelPassword(): void {
    this.showPasswordModal = false;
  }


  confirmPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loadingPassword = true;
    const { oldPassword, newPassword } = this.passwordForm.value;
    this.usuariosService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.alerts.success('Contraseña cambiada', 'Tu contraseña se ha actualizado.');
        this.showPasswordModal = false;
        this.loadingPassword = false;
      },
      error: (err: HttpErrorResponse) => {
        const api = typeof err.error === 'object' ? err.error as { code?: string; detail?: string } : null;
        const detail = api?.detail;
        this.alerts.error('Error', detail || 'No se pudo cambiar la contraseña.');
        this.loadingPassword = false;
      }
    });
  }

  go(path: string): void {
    this.router.navigate([path]);
  }


}
