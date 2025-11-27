import { useState, useEffect } from 'react';
import Navbar from "../Navbar/Navbar";
import TrabajadorCard from './TrabajadorCard';
import FiltrosTrabajadores from './FiltrosTrabajadores';
import ModalDetalleTrabajador from './ModalDetalleTrabajador';
import FormularioTrabajador from './FormularioTrabajador';
import usuariosService from '../../services/usuariosService';
import { getUsuario } from '../../config/api';

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usuarioActual = getUsuario();
  const [filtros, setFiltros] = useState({ rol: null, activo: null });
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [trabajadorEditar, setTrabajadorEditar] = useState(null);

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async (filtrosAplicados = filtros) => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.obtenerTodos(
        filtrosAplicados.rol,
        filtrosAplicados.activo
      );
      setTrabajadores(data);
    } catch (err) {
      setError(err.message || 'Error al cargar trabajadores');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (nuevosFiltros) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros };
    setFiltros(filtrosActualizados);
    cargarTrabajadores(filtrosActualizados);
  };

  const handleVerDetalle = (trabajador) => {
    setTrabajadorSeleccionado(trabajador);
  };

  const cerrarModal = () => {
    setTrabajadorSeleccionado(null);
  };

  const handleGuardarNuevo = async (datos) => {
    try {
      await usuariosService.crear(datos);
      setMostrarFormulario(false);
      cargarTrabajadores();
      alert('✅ Trabajador creado exitosamente');
    } catch (error) {
      alert(`❌ Error: ${error}`);
    }
  };

  const handleGuardarEdicion = async (datos) => {
    try {
      await usuariosService.actualizar(trabajadorEditar.id, datos);
      setMostrarFormulario(false);
      setTrabajadorEditar(null);
      cargarTrabajadores();
      alert('✅ Trabajador actualizado exitosamente');
    } catch (error) {
      alert(`❌ Error: ${error}`);
    }
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setTrabajadorEditar(null);
  };

  const handleEditar = (trabajador) => {
    setTrabajadorEditar(trabajador);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (trabajador) => {
    // Verificar permisos en el frontend (doble validación)
    if (usuarioActual?.rol !== 'rrhh') {
      alert('❌ Solo usuarios de RRHH pueden eliminar trabajadores');
      return;
    }

    if (trabajador.rol === 'rrhh') {
      alert('❌ No puedes eliminar a otros usuarios de RRHH');
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${trabajador.nombre}?\n\n` +
      `Email: ${trabajador.email}\n` +
      `Rol: ${trabajador.rol}\n\n` +
      `Esta acción NO se puede deshacer.`
    );

    if (confirmacion) {
      try {
        await usuariosService.eliminar(trabajador.id);
        cargarTrabajadores();
        alert(`✅ ${trabajador.nombre} ha sido eliminado exitosamente`);
      } catch (error) {
        alert(`❌ Error al eliminar: ${error}`);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          fontSize: '24px',
          color: '#667eea',
        }}>
          ⏳ Cargando trabajadores...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <div style={{ fontSize: '24px', color: '#e74c3c' }}>{error}</div>
          <button
            onClick={cargarTrabajadores}
            style={{
              padding: '12px 24px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '8px',
            }}>
              👥 Gestión de Trabajadores
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7f8c8d',
            }}>
              Total de trabajadores: <strong>{trabajadores.length}</strong>
            </p>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            ➕ Nuevo Trabajador
          </button>
        </div>

        {/* Filtros */}
        <FiltrosTrabajadores 
          onFiltrar={handleFiltrar}
          totalTrabajadores={trabajadores.length}
        />

        {/* Grid de trabajadores */}
        {trabajadores.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
            <div style={{ fontSize: '24px', color: '#7f8c8d', marginBottom: '8px' }}>
              No hay trabajadores registrados
            </div>
            <div style={{ fontSize: '16px', color: '#95a5a6' }}>
              Comienza agregando un nuevo trabajador
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
          }}>
            {trabajadores.map((trabajador) => (
              <TrabajadorCard
                key={trabajador.id}
                trabajador={trabajador}
                onVerDetalle={handleVerDetalle}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                usuarioActual={usuarioActual}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {trabajadorSeleccionado && (
        <ModalDetalleTrabajador
          trabajador={trabajadorSeleccionado}
          onCerrar={cerrarModal}
        />
      )}

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <FormularioTrabajador
          trabajador={trabajadorEditar}
          onCerrar={cerrarFormulario}
          onGuardar={trabajadorEditar ? handleGuardarEdicion : handleGuardarNuevo}
        />
      )}
    </div>
  );
}

export default Trabajadores;