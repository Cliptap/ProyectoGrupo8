-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Capacitacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tema" TEXT NOT NULL,
    "fechaCapacitacion" DATETIME NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'general',
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
INSERT INTO "new_Capacitacion" ("calificacion", "certificacion", "createdAt", "duracionHoras", "estado", "fechaCapacitacion", "id", "institucion", "notas", "tema", "updatedAt", "usuarioId") SELECT "calificacion", "certificacion", "createdAt", "duracionHoras", "estado", "fechaCapacitacion", "id", "institucion", "notas", "tema", "updatedAt", "usuarioId" FROM "Capacitacion";
DROP TABLE "Capacitacion";
ALTER TABLE "new_Capacitacion" RENAME TO "Capacitacion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
