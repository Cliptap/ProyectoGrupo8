# Ì≥ö Servicios de la API

Servicios para consumir la API del backend.

## Ì¥ß Configuraci√≥n

La URL base se configura en `src/config/api.js`:
- Por defecto: `http://localhost:3000/api`
- Variable de entorno: `REACT_APP_API_URL`

## Ì∫Ä Uso

### Importar servicios
\`\`\`javascript
import { authService, vehiculosService, cargasService, rutasService } from '../services';
\`\`\`

### Autenticaci√≥n
\`\`\`javascript
// Login
const data = await authService.login('email@example.com', 'password123');
// data.token y data.usuario se guardan autom√°ticamente

// Obtener perfil
const perfil = await authService.obtenerPerfil();

// Logout
authService.logout();
\`\`\`

### Veh√≠culos
\`\`\`javascript
// Obtener todos
const vehiculos = await vehiculosService.obtenerTodos();

// Filtrar por estado
const disponibles = await vehiculosService.obtenerTodos('disponible');

// Obtener uno
const vehiculo = await vehiculosService.obtenerPorId(1);

// Crear
const nuevo = await vehiculosService.crear({
  patente: 'ABC123',
  marca: 'Mercedes',
  modelo: 'Actros',
  capacidadCarga: 25000
});

// Actualizar
await vehiculosService.actualizar(1, { estado: 'en_ruta' });

// Eliminar
await vehiculosService.eliminar(1);
\`\`\`

### Cargas y Rutas
Funcionan igual que veh√≠culos. Ver archivos individuales para m√°s detalles.

## Ì¥ê Autenticaci√≥n autom√°tica

El token JWT se agrega autom√°ticamente a todas las peticiones. Si el token expira (401), redirige al login autom√°ticamente.
