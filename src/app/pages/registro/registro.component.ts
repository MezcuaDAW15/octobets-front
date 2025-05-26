import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  nombre = '';
  apellidos = '';
  username = '';
  email = '';
  password = '';
  password2 = '';

  formError = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private alerts: AlertsService,
    private router: Router
  ) { }

  registrar(form: NgForm): void {
    this.formError = '';
    if (form.invalid || this.password !== this.password2) {
      form.form.markAllAsTouched();
      if (this.password !== this.password2) {
        this.formError = 'Las contraseñas deben coincidir.';
      }
      return;
    }

    this.loading = true;
    this.auth.register({
      nombre: this.nombre,
      apellidos: this.apellidos,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.alerts.success('Cuenta creada', 'Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.formError = err.error?.message || 'No se pudo crear la cuenta.';
        this.loading = false;
      }
    });
  }
}
