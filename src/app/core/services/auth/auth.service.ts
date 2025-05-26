import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, EMPTY, map, Observable, retry, tap } from 'rxjs';
import { AuthRequestDTO, AuthResponseDTO, Usuario } from '../../../shared/models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/auth`;
  private readonly LS_TOKEN_KEY = 'octobets_token';

  /**  Usuario autenticado o null  */
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private initializeFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem(this.LS_TOKEN_KEY);
    if (!raw) {
      this.currentUserSubject.next(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(raw.split('.')[1]));
      const user: Usuario = {
        id: payload.uid,
        email: payload.sub,
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        username: payload.username,
        avatar: payload.avatar
      };
      this.currentUserSubject.next(user);
    } catch {
      // token corrupto → lo eliminamos
      localStorage.removeItem(this.LS_TOKEN_KEY);
    }
  }

  constructor(private http: HttpClient) {
    this.initializeFromLocalStorage();
    if (this.getToken()) {
      this.refreshUser();
    }
  }

  /** Hace login y guarda token + usuario */
  login(req: AuthRequestDTO): Observable<Usuario> {
    console.log('login', req);

    return this.http.post<AuthResponseDTO>(`${this.base}/login`, req).pipe(
      tap(res => this.persistSession(res)),
      map(res => this.authResToUser(res))
    );
  }

  /** Registro que devuelve y auto-loguea */
  register(req: Usuario & { password: string }): Observable<Usuario> {
    return this.http.post<AuthResponseDTO>(`${this.base}/register`, req).pipe(
      tap(res => this.persistSession(res)),
      map(res => this.authResToUser(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.LS_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }


  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return localStorage.getItem(this.LS_TOKEN_KEY);
  }

  authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  private persistSession(res: AuthResponseDTO): void {
    localStorage.setItem(this.LS_TOKEN_KEY, res.accessToken);
    this.currentUserSubject.next(this.authResToUser(res));
  }

  private authResToUser(res: AuthResponseDTO): Usuario {
    return {
      id: res.idUsuario,
      email: res.email,
      nombre: res.nombre,
      apellidos: res.apellidos,
      username: res.username,
      avatar: res.avatar
    };
  }

  refreshUser(): void {
    this.http.get<Usuario>(`${environment.apiUrl}/usuarios/mi-perfil`)
      .pipe(

        catchError(err => {
          if (err.status === 401) {
            // token inválido o expirado: cerramos sesión
            this.logout();
          } else {
            // opcional: mostrar un toast o simplemente log en consola
            console.error('Error al refrescar perfil:', err);
          }
          return EMPTY;
        })
      )
      .subscribe(user => this.currentUserSubject.next(user));
  }
}
