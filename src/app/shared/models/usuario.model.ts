export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthRequestDTO {
  login: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  tokenType: string;
  idUsuario: number;
  email: string;
  nombre: string;
  apellidos: string;
  username: string;
  avatar?: string;
}
