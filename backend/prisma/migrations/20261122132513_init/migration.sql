-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLICO', 'ANALISTA', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoZona" AS ENUM ('DEPARTAMENTO', 'MUNICIPIO', 'BARRIO');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('HOMICIDIO', 'LESIONES', 'VIOLENCIA_GENERO', 'VIOLENCIA_INTRAFAMILIAR', 'ROBO', 'HURTO', 'HURTO_VEHICULO', 'ESTAFA_ONLINE');

-- CreateEnum
CREATE TYPE "FranjaHoraria" AS ENUM ('MADRUGADA', 'MANANA', 'TARDE', 'NOCHE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALISTA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zona" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoZona" NOT NULL,
    "localidad" TEXT NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Zona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidente" (
    "id" SERIAL NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "franja" "FranjaHoraria" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "zonaId" INTEGER NOT NULL,
    "sintetico" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recomendacion" (
    "id" SERIAL NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "franja" "FranjaHoraria",
    "umbralTasa" DOUBLE PRECISION NOT NULL,
    "accion" TEXT NOT NULL,
    "evidencia" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Recomendacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicioAsistencia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "zonaId" INTEGER NOT NULL,

    CONSTRAINT "ServicioAsistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Zona_nombre_localidad_key" ON "Zona"("nombre", "localidad");

-- CreateIndex
CREATE INDEX "Incidente_categoria_fecha_idx" ON "Incidente"("categoria", "fecha");

-- CreateIndex
CREATE INDEX "Incidente_zonaId_fecha_idx" ON "Incidente"("zonaId", "fecha");

-- AddForeignKey
ALTER TABLE "Incidente" ADD CONSTRAINT "Incidente_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "Zona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicioAsistencia" ADD CONSTRAINT "ServicioAsistencia_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "Zona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
