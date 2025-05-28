import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

export interface Transaccion {
  id: number;
  fecha: string;     // ISO date
  tipo: 'DEPOSITO' | 'RETIRO';
  cantidadFichas: number;
  cantidadDinero: number;
  stripeId?: string;
  estado?: 'PENDING' | 'SUCCEEDED' | 'FAILED';
}


@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private readonly base = `${environment.apiUrl}/carteras`;

  constructor(
    private http: HttpClient,
  ) { }

  buyChips(chips: number): Observable<string> {
    const params = new HttpParams().set('chips', chips);
    return this.http.post<{ clientSecret: string }>(
      `${this.base}/buy`, null, { params }
    ).pipe(map(r => r.clientSecret));
  }

  /** Retira fichas del saldo */
  withdrawChips(chips: number): Observable<void> {
    const params = new HttpParams().set('chips', chips);
    return this.http.post<void>(`${this.base}/withdraw`, null, { params });
  }

  /** (opcional) Obtener saldo actual */
  balance(): Observable<number> {
    return this.http.get<number>(`${this.base}/balance`);
  }

  listTransactions(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(
      `${this.base}/transacciones`
    ).pipe(
      map(transacciones =>
        transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      )
    );
  }
}
