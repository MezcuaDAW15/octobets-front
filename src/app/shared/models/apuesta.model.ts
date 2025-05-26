export enum ApuestaEstado {
  RESUELTA = 'Resuelta',
  ABIERTA = 'Abierta',
  CERRADA = 'Cerrada',
  CANCELADA = 'Cancelada'
}


export enum ApuestaTipo {
  FUTBOL = 'Futbol',
  BALONCESTO = 'Baloncesto',
  TENIS = 'Tenis',
  VOLEIBOL = 'Voleibol',
  MOTORSPORT = 'Motorsport',
  OTRO_DEPORTE = 'Otro deporte',
  ESPORTS = 'Esports',
  SOCIAL = 'Social',
  ACONTECIMIENTOS = 'Acontecimientos',
  OTROS = 'Otros',
}


export interface ApuestaOpcion {

  id?: string;
  ganadora: boolean;
  cuota: number;
  descripcion: string;
  totalApostado: number;
}


export interface Apuesta {

  id?: string;
  tipo: ApuestaTipo;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  fechaCierre?: string;
  estado: ApuestaEstado;
  opciones: ApuestaOpcion[];
  idCreador: number;

}

export interface Ticket {
  id: string;
  apuestaTitulo: string;
  tipo: ApuestaTipo;
  estado: ApuestaEstado;
  opcion: string;
  cuota: number;
  cantidad: number;
  ganadora: boolean;
  ganancia: number;
  fecha: string;
}
