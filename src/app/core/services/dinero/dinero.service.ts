import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class DineroService {
  private base = `${environment.apiUrl}/carteras`;
  private saldoSubject = new BehaviorSubject<number>(0);
  /** Observable público para suscribirse al saldo */

  readonly saldo$ = this.saldoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    // Cuando el usuario hace login o recarga la página, obtenemos su saldo inicial
    this.auth.currentUser$
      .pipe(
        filter(u => !!u),
        switchMap(u => this.http.get<{ saldoFichas: number }>(`${this.base}/${u!.id}`)),
        map(response => response.saldoFichas) // Extraer el saldo
      )
      .subscribe({
        next: saldo => this.saldoSubject.next(saldo),
        error: () => this.saldoSubject.next(0)
      });
  }

  /** Carga el saldo del backend para un usuario */
  private fetchSaldo(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.base}/${idUsuario}`);
  }


  recargar(cantidad: number): Observable<number> {
    return this.auth.currentUser$
      .pipe(
        take(1),
        switchMap(u => {
          if (!u) throw new Error('Usuario no autenticado');
          return this.http.post<number>(
            `${this.base}/${u.id}/recargar`,
            { cantidad }
          );
        }),
        tap(nuevoSaldo => this.saldoSubject.next(nuevoSaldo))
      );
  }


}
