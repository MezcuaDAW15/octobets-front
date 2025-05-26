import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../../shared/models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly base = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.base);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/${id}`);
  }

  getByToken(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/mi-perfil`);
  }

  updateUser(usuario: Usuario) {
    return this.http.put<Usuario>(`${this.base}/mi-perfil`, usuario);
  }

  changePassword(oldPass: string, newPass: string) {
    return this.http.put<void>(`${this.base}/mi-perfil/password`, {
      oldPassword: oldPass,
      newPassword: newPass
    });
  }

  create(user: Usuario, plainPassword: string): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, {
      ...user,
      password: plainPassword
    });
  }

  update(body: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/me`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
