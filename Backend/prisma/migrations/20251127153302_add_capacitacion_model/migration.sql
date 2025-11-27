-- CreateTable
CREATE TABLE "Capacitacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tema" TEXT NOT NULL,
    "fechaCapacitacion" DATETIME NOT NULL,
    "institucion" TEXT,
    "certificacion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'completada',
    "duracionHoras" INTEGER,
    "calificacion" REAL,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Capacitacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
