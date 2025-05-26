import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login = '';
  password = '';
  formError = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private alerts: AlertsService,
    private router: Router
  ) { }

  entrar(form: NgForm): void {
    this.formError = '';

    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.auth.login({ login: this.login, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.formError = 'Credenciales incorrectas.';
        this.loading = false;
      }
    });
  }
}
