import { AuthService } from './../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Apuesta, ApuestaEstado, ApuestaOpcion, ApuestaTipo, Ticket } from '../../../shared/models/apuesta.model';

/** TicketDTO que llega del backend */
interface TicketDTO {
  id: number;
  apuestaTitulo: string;
  apuestaDescripcion: string;
  apuestaTipo: string;
  apuestaEstado: string;
  cantidadFichas: number;
  cuota: number;
  fecha: string;
  opcion: { descripcion: string; ganadora: boolean };
}
interface ApuestaDTO {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  fechaCierre?: string;
  tipo: string;
  estado: string;
  opciones: ApuestaOpcion[];
  idCreador: number;


}
@Injectable({
  providedIn: 'root'
})
export class ApuestasService {
  private base = `${environment.apiUrl}/apuestas`;
  private baseTickets = `${environment.apiUrl}/tickets`;


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(): Observable<Apuesta[]> {
    return this.http.get<ApuestaDTO[]>(this.base)
      .pipe(map((arr) => arr.map(dto => this.toApuesta(dto))));
  }
  getByUsuario(id: number): Observable<Apuesta[]> {
    return this.http.get<ApuestaDTO[]>(`${this.base}/usuarios/${id}`)
      .pipe(map(arr => arr.map(dto => this.toApuesta(dto))));
  }
  getById(id: number): Observable<Apuesta> {
    return this.http.get<ApuestaDTO>(`${this.base}/${id}`).pipe(
      map((dto: ApuestaDTO) => this.toApuesta(dto))
    );
  }
  apostar(
    opcionId: number,
    cantidadFichas: number,
    cuota: number
  ): Observable<Ticket> {
    return this.authService.currentUser$.pipe(
      map(user => user?.id || 0),
      switchMap(userId => {
        const payload = {
          usuario: { id: userId },
          opcion: { id: opcionId },
          cantidadFichas,
          cuota
        };
        console.log('Apuesta payload:', payload);
        return this.http.post<Ticket>(this.baseTickets, payload);
      })
    );
  }
  getTickets(idUsuario: number): Observable<Ticket[]> {
    return this.http
      .get<TicketDTO[]>(this.baseTickets + `/usuarios/${idUsuario}`)
      .pipe(
        map(dtoArr => dtoArr.map(dto => this.toModel(dto)))
      );
  }

  resolver(
    idApuesta: number,
    idOpcionGanadora: number
  ): Observable<Apuesta> {
    return this.http.put<Apuesta>(`${this.base}/${idApuesta}/resolver/${idOpcionGanadora}`, {});
  }
  cerrar(idApuesta: number): Observable<Apuesta> {
    return this.http.put<Apuesta>(`${this.base}/${idApuesta}/cerrar`, {});
  }
  crearApuesta(apuesta: Apuesta): Observable<Apuesta> {

    return this.http.post<Apuesta>(this.base, apuesta);
  }

  private toModel(dto: TicketDTO): Ticket {
    const estadoKey = dto.apuestaEstado as keyof typeof ApuestaEstado;
    const tipoKey = dto.apuestaTipo as keyof typeof ApuestaTipo;

    return {
      id: dto.id.toString(),
      apuestaTitulo: dto.apuestaTitulo,
      tipo: ApuestaTipo[tipoKey],
      estado: ApuestaEstado[estadoKey],
      opcion: dto.opcion.descripcion,
      cuota: dto.cuota,
      cantidad: dto.cantidadFichas,
      ganadora: dto.opcion.ganadora,
      ganancia: dto.apuestaEstado === 'RESUELTA'
        ? dto.opcion.ganadora
          ? dto.cantidadFichas * dto.cuota
          : -dto.cantidadFichas
        : dto.cuota * dto.cantidadFichas,
      fecha: dto.fecha
    };
  }

  private toApuesta(dto: ApuestaDTO): Apuesta {
    const estadoKey = dto.estado as keyof typeof ApuestaEstado;
    const tipoKey = dto.tipo as keyof typeof ApuestaTipo;

    return {
      id: dto.id.toString(),
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fechaCreacion: dto.fechaCreacion,
      fechaCierre: dto.fechaCierre,
      estado: ApuestaEstado[estadoKey],
      tipo: ApuestaTipo[tipoKey],
      idCreador: dto.idCreador,
      opciones: [
        ...dto.opciones.map(op => ({
          id: op.id!.toString(),
          ganadora: op.ganadora,
          cuota: op.cuota,
          descripcion: op.descripcion,
          totalApostado: op.totalApostado
        }))
      ]
    };
  }
}
