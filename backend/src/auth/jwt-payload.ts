import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}

export interface UsuarioAutenticado {
  id: number;
  email: string;
  role: Role;
}
