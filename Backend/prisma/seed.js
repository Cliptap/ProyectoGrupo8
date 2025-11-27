import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Desactivar foreign key constraints temporalmente (SQLite)
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;');

  // Limpiar datos existentes (ahora en cualquier orden)
  await prisma.ruta.deleteMany();
  await prisma.carga.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();

  // Reactivar foreign key constraints
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');

  console.log('✅ Base de datos limpiada');

  // Hash de contraseña común para todos (password123)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Crear usuarios
  const usuarios = await prisma.usuario.createMany({
    data: [
      // Logística
      { email: 'juan.perez@luxchile.com', password: hashedPassword, nombre: 'Juan Pérez', rol: 'logistica' },
      { email: 'maria.gonzalez@luxchile.com', password: hashedPassword, nombre: 'María González', rol: 'logistica' },
      { email: 'carlos.rojas@luxchile.com', password: hashedPassword, nombre: 'Carlos Rojas', rol: 'logistica' },
      // RRHH
      { email: 'ana.martinez@luxchile.com', password: hashedPassword, nombre: 'Ana Martínez', rol: 'rrhh' },
      { email: 'pedro.silva@luxchile.com', password: hashedPassword, nombre: 'Pedro Silva', rol: 'rrhh' },
      // Seguridad
      { email: 'diego.morales@luxchile.com', password: hashedPassword, nombre: 'Diego Morales', rol: 'seguridad' },
      { email: 'laura.fernandez@luxchile.com', password: hashedPassword, nombre: 'Laura Fernández', rol: 'seguridad' },
      // Conductores
      { email: 'conductor1@luxchile.com', password: hashedPassword, nombre: 'Roberto Sánchez', rol: 'conductor' },
      { email: 'conductor2@luxchile.com', password: hashedPassword, nombre: 'Patricia Muñoz', rol: 'conductor' },
      { email: 'conductor3@luxchile.com', password: hashedPassword, nombre: 'Luis Torres', rol: 'conductor' },
      { email: 'conductor4@luxchile.com', password: hashedPassword, nombre: 'Carmen Vega', rol: 'conductor' },
      { email: 'conductor5@luxchile.com', password: hashedPassword, nombre: 'Alberto Díaz', rol: 'conductor' },
    ],
  });

  console.log(`✅ ${usuarios.count} usuarios creados`);

  // Obtener usuarios para las relaciones
  const usuariosCreados = await prisma.usuario.findMany();
  const conductor1 = usuariosCreados.find(u => u.email === 'juan.perez@luxchile.com');
  const conductor2 = usuariosCreados.find(u => u.email === 'carlos.rojas@luxchile.com');

  // Crear vehículos
  const vehiculo1 = await prisma.vehiculo.create({
    data: {
      patente: 'ABCD12',
      marca: 'Mercedes-Benz',
      modelo: 'Actros 2651',
      capacidadCarga: 25000,
      estado: 'disponible',
      ubicacionActualLat: -33.4489,
      ubicacionActualLng: -70.6693,
    },
  });

  const vehiculo2 = await prisma.vehiculo.create({
    data: {
      patente: 'EFGH34',
      marca: 'Volvo',
      modelo: 'FH16',
      capacidadCarga: 30000,
      estado: 'en_ruta',
      ubicacionActualLat: -33.0361,
      ubicacionActualLng: -71.6270,
    },
  });

  const vehiculo3 = await prisma.vehiculo.create({
    data: {
      patente: 'IJKL56',
      marca: 'Scania',
      modelo: 'R450',
      capacidadCarga: 20000,
      estado: 'mantenimiento',
      ubicacionActualLat: -33.4489,
      ubicacionActualLng: -70.6693,
    },
  });

  console.log('✅ 3 vehículos creados');

  // Crear cargas
  // HU7: Cargas alineadas a productos de lujo
  const carga1 = await prisma.carga.create({
    data: {
      descripcion: 'Joyas de diseñador',
      peso: 2500,
      tipo: 'alto_valor',
      prioridad: 'urgente',
      estado: 'en_transito',
      origen: 'Santiago Centro',
      destino: 'Valparaíso',
    },
  });

  const carga2 = await prisma.carga.create({
    data: {
      descripcion: 'Cristalería fina',
      peso: 1200,
      tipo: 'fragil',
      prioridad: 'alta',
      estado: 'pendiente',
      origen: 'Pudahuel',
      destino: 'Viña del Mar',
    },
  });

  const carga3 = await prisma.carga.create({
    data: {
      descripcion: 'Ropa premium y accesorios',
      peso: 5500,
      tipo: 'normal',
      prioridad: 'media',
      estado: 'asignada',
      origen: 'Quilicura',
      destino: 'Rancagua',
    },
  });

  console.log('✅ 3 cargas creadas');

  // Crear rutas
  const ruta1 = await prisma.ruta.create({
    data: {
      vehiculoId: vehiculo2.id,
      cargaId: carga1.id,
      conductorId: conductor1.id,
      origen: 'Santiago Centro',
      destino: 'Valparaíso',
      distanciaKm: 120,
      estadoRuta: 'en_curso',
      fechaInicio: new Date(),
      puntosIntermedio: JSON.stringify([
        { lat: -33.4489, lng: -70.6693 },
        { lat: -33.0361, lng: -71.6270 },
      ]),
    },
  });

  const ruta2 = await prisma.ruta.create({
    data: {
      vehiculoId: vehiculo1.id,
      cargaId: carga3.id,
      conductorId: conductor2.id,
      origen: 'Quilicura',
      destino: 'Rancagua',
      distanciaKm: 87,
      estadoRuta: 'planificada',
      puntosIntermedio: JSON.stringify([
        { lat: -33.3618, lng: -70.7262 },
        { lat: -34.1705, lng: -70.7407 },
      ]),
    },
  });

  console.log('✅ 2 rutas creadas');

  // ============ HU9: CREAR CAPACITACIONES DE EJEMPLO ============
  const conductor1Obj = usuariosCreados.find(u => u.email === 'conductor1@luxchile.com');
  const conductor2Obj = usuariosCreados.find(u => u.email === 'conductor2@luxchile.com');
  const conductor3Obj = usuariosCreados.find(u => u.email === 'conductor3@luxchile.com');
  const logistica1Obj = usuariosCreados.find(u => u.email === 'juan.perez@luxchile.com');

  await prisma.capacitacion.deleteMany(); // Limpiar primero

  await prisma.capacitacion.createMany({
    data: [
      // Capacitaciones para Roberto Sánchez
      {
        usuarioId: conductor1Obj.id,
        tema: 'Protocolo de Seguridad en Transporte de Lujo',
        fechaCapacitacion: new Date('2025-09-15'),
        categoria: 'seguridad',
        institucion: 'SENCE',
        certificacion: 'certificado_entregado',
        estado: 'completada',
        duracionHoras: 40,
        calificacion: 92,
        notas: 'Excelente desempeño, cumplió con todos los módulos'
      },
      {
        usuarioId: conductor1Obj.id,
        tema: 'Manejo Defensivo Avanzado',
        fechaCapacitacion: new Date('2025-11-10'),
        categoria: 'operación',
        institucion: 'Instituto de Transporte',
        certificacion: 'certificado_entregado',
        estado: 'completada',
        duracionHoras: 32,
        calificacion: 88,
        notas: 'Aprobado con distinción en evaluación teórica y práctica'
      },
      // Capacitaciones para Patricia Muñoz
      {
        usuarioId: conductor2Obj.id,
        tema: 'Atención al Cliente Premium',
        fechaCapacitacion: new Date('2025-10-20'),
        categoria: 'atención_cliente',
        institucion: 'Consultoría Empresarial ABC',
        certificacion: 'certificado_entregado',
        estado: 'completada',
        duracionHoras: 24,
        calificacion: 95,
        notas: 'Participación activa, excelentes habilidades comunicacionales'
      },
      // Capacitaciones para Luis Torres (sin capacitaciones recientes - para filtro)
      {
        usuarioId: conductor3Obj.id,
        tema: 'Introducción a Sistemas de GPS',
        fechaCapacitacion: new Date('2024-06-15'),
        categoria: 'operación',
        institucion: 'Telemática Logística',
        certificacion: 'certificado_entregado',
        estado: 'completada',
        duracionHoras: 16,
        calificacion: 80,
        notas: 'Capacitación básica, requiere actualización'
      },
      // Capacitaciones para Juan Pérez (Logística)
      {
        usuarioId: logistica1Obj.id,
        tema: 'Gestión de Inventarios Avanzada',
        fechaCapacitacion: new Date('2025-10-05'),
        categoria: 'logística',
        institucion: 'APICS',
        certificacion: 'certificado_entregado',
        estado: 'completada',
        duracionHoras: 48,
        calificacion: 91,
        notas: 'Implementó mejoras en proceso de recepción post-capacitación'
      }
    ]
  });

  console.log('✅ 5 capacitaciones creadas (HU9)');

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log('   - 12 usuarios (3 logística, 2 RRHH, 2 seguridad, 5 conductores)');
  console.log('   - 3 vehículos');
  console.log('   - 3 cargas');
  console.log('   - 2 rutas');
  console.log('   - 5 capacitaciones (HU9)');
  console.log('\n👤 Credenciales de prueba:');
  console.log('   Email: juan.perez@luxchile.com');
  console.log('   Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });