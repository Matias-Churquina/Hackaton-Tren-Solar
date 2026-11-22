import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

const SALT_ROUNDS = 10;
const publicFields = {
  id: true,
  email: true,
  nombre: true,
  role: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findAll() {
    return this.prisma.user.findMany({ select: publicFields });
  }

  async create(dto: CreateUserDto) {
    if (await this.findByEmail(dto.email)) {
      throw new ConflictException('El email ya está registrado');
    }
    return this.prisma.user.create({
      data: {
        email: dto.email,
        nombre: dto.nombre,
        role: dto.role,
        passwordHash: await bcrypt.hash(dto.password, SALT_ROUNDS),
      },
      select: publicFields,
    });
  }
}
