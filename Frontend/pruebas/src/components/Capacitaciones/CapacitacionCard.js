import React from 'react';

const CapacitacionCard = ({ capacitacion, onEditar, onEliminar }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      'general': '#2196F3',
      'seguridad': '#f44336',
      'logística': '#FF9800',
      'atención_cliente': '#4CAF50',
      'operación': '#9C27B0'
    };
    return colores[categoria] || '#757575';
  };

  const obtenerEmojiCategoria = (categoria) => {
    const emojis = {
      'general': '📘',
      'seguridad': '🔒',
      'logística': '📦',
      'atención_cliente': '👥',
      'operación': '⚙️'
    };
    return emojis[categoria] || '📚';
  };

  const obtenerEstadoCertificacion = (certificacion) => {
    const estados = {
      'no_aplica': '❌ No aplica',
      'en_proceso': '⏳ En proceso',
      'certificado_entregado': '✅ Certificado entregado'
    };
    return estados[certificacion] || certificacion;
  };

  const estilosCard = {
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  };

  const estilosEncabezado = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px'
  };

  const estilosTitulo = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
    margin: 0
  };

  const estilosCategoria = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: obtenerColorCategoria(capacitacion.categoria),
    color: 'white',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold'
  };

  const estilosTrabajador = {
    fontSize: '12px',
    color: '#666',
    margin: '5px 0',
    fontStyle: 'italic'
  };

  const estilosContenido = {
    marginBottom: '10px'
  };

  const estilosPropiedad = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px'
  };

  const estilosEtiqueta = {
    fontWeight: 'bold',
    color: '#555'
  };

  const estilosValor = {
    color: '#333',
    textAlign: 'right'
  };

  const estilosCalificacion = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: capacitacion.calificacion >= 70 ? '#c8e6c9' : '#fff9c4',
    color: capacitacion.calificacion >= 70 ? '#2e7d32' : '#f57f17',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const estilosNotas = {
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderLeft: '3px solid #2196F3',
    borderRadius: '3px',
    fontSize: '12px',
    marginBottom: '10px',
    color: '#666'
  };

  const estilosBotones = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '10px'
  };

  const estilosBoton = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  };

  const estilosBotonEditar = {
    ...estilosBoton,
    backgroundColor: '#2196F3',
    color: 'white'
  };

  const estilosBotonEliminar = {
    ...estilosBoton,
    backgroundColor: '#f44336',
    color: 'white'
  };

  return (
    <div style={estilosCard}>
      {/* Encabezado */}
      <div style={estilosEncabezado}>
        <div>
          <p style={estilosTitulo}>
            {obtenerEmojiCategoria(capacitacion.categoria)} {capacitacion.tema}
          </p>
          <p style={estilosTrabajador}>
            👤 {capacitacion.usuario?.nombre || 'Trabajador desconocido'}
          </p>
        </div>
        <span style={estilosCategoria}>
          {capacitacion.categoria.charAt(0).toUpperCase() + capacitacion.categoria.slice(1).replace('_', ' ')}
        </span>
      </div>

      {/* Contenido */}
      <div style={estilosContenido}>
        {/* Fecha */}
        <div style={estilosPropiedad}>
          <span style={estilosEtiqueta}>📅 Fecha:</span>
          <span style={estilosValor}>{formatearFecha(capacitacion.fechaCapacitacion)}</span>
        </div>

        {/* Institución */}
        {capacitacion.institucion && (
          <div style={estilosPropiedad}>
            <span style={estilosEtiqueta}>🏢 Institución:</span>
            <span style={estilosValor}>{capacitacion.institucion}</span>
          </div>
        )}

        {/* Duración */}
        {capacitacion.duracionHoras && (
          <div style={estilosPropiedad}>
            <span style={estilosEtiqueta}>⏱️ Duración:</span>
            <span style={estilosValor}>{capacitacion.duracionHoras} horas</span>
          </div>
        )}

        {/* Calificación */}
        {capacitacion.calificacion !== null && (
          <div style={estilosPropiedad}>
            <span style={estilosEtiqueta}>⭐ Calificación:</span>
            <span style={estilosCalificacion}>
              {capacitacion.calificacion.toFixed(1)}/100
            </span>
          </div>
        )}

        {/* Certificación */}
        <div style={estilosPropiedad}>
          <span style={estilosEtiqueta}>📜 Certificación:</span>
          <span style={estilosValor}>{obtenerEstadoCertificacion(capacitacion.certificacion)}</span>
        </div>
      </div>

      {/* Notas */}
      {capacitacion.notas && (
        <div style={estilosNotas}>
          <strong>Notas:</strong> {capacitacion.notas}
        </div>
      )}

      {/* Botones */}
      <div style={estilosBotones}>
        <button
          style={estilosBotonEditar}
          onClick={() => onEditar(capacitacion)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
        >
          ✏️ Editar
        </button>
        <button
          style={estilosBotonEliminar}
          onClick={() => onEliminar(capacitacion.id)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default CapacitacionCard;
