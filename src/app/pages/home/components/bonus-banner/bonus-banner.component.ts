import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bonus-banner',
  imports: [MatIconModule, CommonModule],
  templateUrl: './bonus-banner.component.html',
  styleUrl: './bonus-banner.component.scss'
})
export class BonusBannerComponent implements OnInit {
  user$!: Observable<Usuario | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
  }

  gotoLogin() { this.router.navigate(['/login']); }
  gotoRegister() { this.router.navigate(['/registro']); }


}
