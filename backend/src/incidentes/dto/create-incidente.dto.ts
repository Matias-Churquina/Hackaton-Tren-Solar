import { ApiProperty } from '@nestjs/swagger';
import { Categoria, FranjaHoraria } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateIncidenteDto {
  @ApiProperty({ enum: Categoria })
  @IsEnum(Categoria)
  categoria!: Categoria;

  @ApiProperty()
  @IsDateString()
  fecha!: string;

  @ApiProperty({ enum: FranjaHoraria })
  @IsEnum(FranjaHoraria)
  franja!: FranjaHoraria;

  @ApiProperty()
  @IsLatitude()
  lat!: number;

  @ApiProperty()
  @IsLongitude()
  lng!: number;

  @ApiProperty()
  @IsInt()
  zonaId!: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  sintetico?: boolean;
}

export class CreateIncidentesDto {
  @ApiProperty({ type: [CreateIncidenteDto] })
  @IsArray()
  @ArrayMaxSize(5000)
  @ValidateNested({ each: true })
  @Type(() => CreateIncidenteDto)
  incidentes!: CreateIncidenteDto[];
}
