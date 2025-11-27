import React, { useState, useEffect } from 'react';
import capacitacionesService from '../../services/capacitacionesService';
import usuariosService from '../../services/usuariosService';
import FormularioCapacitacion from './FormularioCapacitacion';
import CapacitacionCard from './CapacitacionCard';

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [capacitacionEditando, setCapacitacionEditando] = useState(null);
  const [filtroTrabajador, setFiltroTrabajador] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [trabajadoresSinCapacitaciones, setTrabajadoresSinCapacitaciones] = useState([]);

  const categorias = ['general', 'seguridad', 'logística', 'atención_cliente', 'operación'];

  // Cargar capacitaciones
  const cargarCapacitaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      let datos;
      
      if (filtroTrabajador || filtroCategoria || filtroDesde || filtroHasta) {
        // Usar filtros complejos
        const resultado = await capacitacionesService.obtenerCapacitacionesPorFiltros({
          usuarioId: filtroTrabajador ? parseInt(filtroTrabajador) : null,
          categoria: filtroCategoria,
          desde: filtroDesde,
          hasta: filtroHasta
        });
        datos = resultado.data || [];
      } else {
        // Obtener todas
        const resultado = await capacitacionesService.obtenerCapacitaciones();
        datos = resultado.data || [];
      }
      
      setCapacitaciones(datos);
    } catch (err) {
      setError('Error al cargar capacitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar trabajadores
  const cargarTrabajadores = async () => {
    try {
      const resultado = await usuariosService.obtenerTodos();
      const workers = resultado.filter(u => u.rol === 'conductor' || u.rol === 'trabajador');
      setTrabajadores(workers);
    } catch (err) {
      console.error('Error al cargar trabajadores:', err);
    }
  };

  // Cargar trabajadores sin capacitaciones
  const cargarTrabajadoresSinCapacitaciones = async () => {
    try {
      const resultado = await capacitacionesService.obtenerTrabajadoresSinCapacitaciones();
      setTrabajadoresSinCapacitaciones((resultado && resultado.data) || []);
    } catch (err) {
      console.error('Error al cargar trabajadores sin capacitaciones:', err);
      setTrabajadoresSinCapacitaciones([]);
    }
  };

  // UseEffect principal
  useEffect(() => {
    cargarTrabajadores();
    cargarCapacitaciones();
    cargarTrabajadoresSinCapacitaciones();
  }, [filtroTrabajador, filtroCategoria, filtroDesde, filtroHasta]);

  // Crear o actualizar capacitación
  const manejarGuardar = async (datos) => {
    try {
      if (capacitacionEditando) {
        await capacitacionesService.actualizarCapacitacion(capacitacionEditando.id, datos);
        setCapacitacionEditando(null);
      } else {
        await capacitacionesService.crearCapacitacion(datos);
      }
      setMostrarFormulario(false);
      setError(null);
      cargarCapacitaciones();
      cargarTrabajadoresSinCapacitaciones();
    } catch (err) {
      setError(err.message || 'Error al guardar capacitación');
      console.error(err);
    }
  };

  // Eliminar capacitación
  const manejarEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta capacitación?')) {
      try {
        await capacitacionesService.eliminarCapacitacion(id);
        cargarCapacitaciones();
        cargarTrabajadoresSinCapacitaciones();
      } catch (err) {
        setError('Error al eliminar capacitación');
        console.error(err);
      }
    }
  };

  // Editar capacitación
  const manejarEditar = (capacitacion) => {
    setCapacitacionEditando(capacitacion);
    setMostrarFormulario(true);
  };

  // Cancelar formulario
  const manejarCancelar = () => {
    setMostrarFormulario(false);
    setCapacitacionEditando(null);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroTrabajador('');
    setFiltroCategoria('');
    setFiltroDesde('');
    setFiltroHasta('');
  };

  const estilosContenedor = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const estilosEncabezado = {
    marginBottom: '30px'
  };

  const estilosTitulo = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const estilosBoton = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const estilosBotonesSecundarios = {
    ...estilosBoton,
    backgroundColor: '#2196F3',
    marginRight: '10px'
  };

  const estilosFiltros = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px'
  };

  const estilosInput = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const estilosLabel = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '13px'
  };

  const estilosError = {
    color: '#d32f2f',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  };

  const estilosSeccion = {
    marginTop: '30px'
  };

  const estilosSeccionTitulo = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px'
  };

  const estilosTarjetas = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const estilosListaTrabajadores = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px'
  };

  const estilosCardTrabajador = {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff9c4',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={estilosContenedor}>
      {/* Encabezado */}
      <div style={estilosEncabezado}>
        <h1 style={estilosTitulo}>📚 Gestión de Capacitaciones</h1>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Registra y consulta las capacitaciones de los trabajadores para tener trazabilidad de su formación.
        </p>
        <button
          style={estilosBoton}
          onClick={() => {
            setCapacitacionEditando(null);
            setMostrarFormulario(!mostrarFormulario);
          }}
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nueva Capacitación'}
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div style={estilosError}>{error}</div>}

      {/* Formulario */}
      {mostrarFormulario && (
        <div style={{ marginBottom: '30px' }}>
          <FormularioCapacitacion
            trabajadores={trabajadores}
            onGuardar={manejarGuardar}
            onCancelar={manejarCancelar}
            capacitacionEditando={capacitacionEditando}
          />
        </div>
      )}

      {/* Filtros */}
      <div style={estilosFiltros}>
        <div>
          <label style={estilosLabel}>Trabajador</label>
          <select
            style={estilosInput}
            value={filtroTrabajador}
            onChange={(e) => setFiltroTrabajador(e.target.value)}
          >
            <option value="">Todos</option>
            {trabajadores.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={estilosLabel}>Categoría</label>
          <select
            style={estilosInput}
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={estilosLabel}>Desde</label>
          <input
            type="date"
            style={estilosInput}
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
          />
        </div>

        <div>
          <label style={estilosLabel}>Hasta</label>
          <input
            type="date"
            style={estilosInput}
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
          />
        </div>

        <div>
          <label style={estilosLabel}>&nbsp;</label>
          <button
            style={{ ...estilosBoton, backgroundColor: '#ff9800' }}
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Capacitaciones */}
      <div style={estilosSeccion}>
        <h2 style={estilosSeccionTitulo}>
          📋 Capacitaciones Registradas ({capacitaciones.length})
        </h2>
        
        {loading && <p>Cargando...</p>}
        
        {!loading && capacitaciones.length === 0 && (
          <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
            No hay capacitaciones que mostrar
          </p>
        )}

        {!loading && capacitaciones.length > 0 && (
          <div style={estilosTarjetas}>
            {capacitaciones.map(cap => (
              <CapacitacionCard
                key={cap.id}
                capacitacion={cap}
                onEditar={manejarEditar}
                onEliminar={manejarEliminar}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trabajadores sin capacitaciones */}
      {trabajadoresSinCapacitaciones.length > 0 && (
        <div style={estilosSeccion}>
          <h2 style={estilosSeccionTitulo}>
            ⚠️ Trabajadores Sin Capacitaciones en el Último Año ({trabajadoresSinCapacitaciones.length})
          </h2>
          <div style={estilosListaTrabajadores}>
            {trabajadoresSinCapacitaciones.map(trab => (
              <div key={trab.id} style={estilosCardTrabajador}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                  {trab.nombre}
                </p>
                <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                  {trab.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Capacitaciones;
