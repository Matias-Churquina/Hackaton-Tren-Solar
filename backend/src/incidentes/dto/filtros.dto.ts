import { ApiPropertyOptional } from '@nestjs/swagger';
import { Categoria, FranjaHoraria } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';

export class FiltrosDto {
  @ApiPropertyOptional({ enum: Categoria })
  @IsOptional()
  @IsEnum(Categoria)
  categoria?: Categoria;

  @ApiPropertyOptional({ enum: FranjaHoraria })
  @IsOptional()
  @IsEnum(FranjaHoraria)
  franja?: FranjaHoraria;

  @ApiPropertyOptional({ enum: [3, 6, 12], default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsIn([3, 6, 12])
  meses?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  zonaId?: number;
}
