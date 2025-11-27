import { useState } from 'react';

function SelectorEstadoRuta({ ruta, onCambiarEstado }) {
  const [cambiando, setCambiando] = useState(false);

  const getEstadoInfo = (estado) => {
    const info = {
      planificada: { 
        label: '📋 Planificada', 
        color: '#1565c0', 
        bg: '#e3f2fd',
        siguientes: ['en_curso', 'cancelada']
      },
      en_curso: { 
        label: '🚛 En Curso', 
        color: '#856404', 
        bg: '#fff3cd',
        siguientes: ['completada', 'cancelada']
      },
      completada: { 
        label: '✅ Completada', 
        color: '#155724', 
        bg: '#d4edda',
        siguientes: []
      },
      cancelada: { 
        label: '❌ Cancelada', 
        color: '#721c24', 
        bg: '#f8d7da',
        siguientes: []
      },
    };
    return info[estado] || info.planificada;
  };

  const estadoActual = getEstadoInfo(ruta.estadoRuta);
  const puedeEditar = estadoActual.siguientes.length > 0;

  const handleCambiar = async (nuevoEstado) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de cambiar el estado de "${estadoActual.label}" a "${getEstadoInfo(nuevoEstado).label}"?\n\n` +
      `Esto actualizará automáticamente:\n` +
      `- Estado de la carga: ${ruta.carga.descripcion}\n` +
      `- Estado del vehículo: ${ruta.vehiculo.patente}`
    );

    if (!confirmacion) return;

    setCambiando(true);
    try {
      await onCambiarEstado(ruta.id, nuevoEstado);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCambiando(false);
    }
  };

  if (!puedeEditar) {
    // Solo mostrar el badge sin selector
    return (
      <div style={{
        display: 'inline-block',
        padding: '8px 18px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: estadoActual.bg,
        color: estadoActual.color,
      }}>
        {estadoActual.label}
      </div>
    );
  }

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}
    >
      {/* Estado actual */}
      <div style={{
        display: 'inline-block',
        padding: '8px 18px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: estadoActual.bg,
        color: estadoActual.color,
      }}>
        {estadoActual.label}
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {estadoActual.siguientes.map((siguienteEstado) => {
          const infoSiguiente = getEstadoInfo(siguienteEstado);
          return (
            <button
              key={siguienteEstado}
              onClick={() => handleCambiar(siguienteEstado)}
              disabled={cambiando}
              style={{
                padding: '6px 14px',
                backgroundColor: cambiando ? '#95a5a6' : infoSiguiente.bg,
                color: infoSiguiente.color,
                border: `2px solid ${infoSiguiente.color}`,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: cambiando ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: cambiando ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!cambiando) {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {cambiando ? '⏳' : `→ ${infoSiguiente.label}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectorEstadoRuta;