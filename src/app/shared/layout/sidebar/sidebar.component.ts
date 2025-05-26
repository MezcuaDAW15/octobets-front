import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  user$: Observable<Usuario | null>;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.user$ = this.auth.currentUser$;
    console.log('SidebarComponent initialized' + this.user$);
  }


  go(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
