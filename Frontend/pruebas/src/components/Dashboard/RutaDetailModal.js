import { useState, useEffect } from 'react';

function RutaDetailModal({ ruta, isOpen, onClose }) {
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimando(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAnimando(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen || !ruta) {
    return null;
  }

  const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    opacity: animando ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    transform: animando ? 'scale(1)' : 'scale(0.9)',
    transition: 'transform 0.2s ease-in-out',
    animation: animando ? 'none' : 'fadeOut 0.2s',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '2px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#999',
    transition: 'color 0.2s',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sectionStyle = {
    padding: '24px',
    borderBottom: '1px solid #f0f0f0',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '16px',
    marginBottom: '12px',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#555',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    color: '#333',
    fontSize: '14px',
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  };

  const getPrioridadBadge = (prioridad) => {
    const styles = {
      urgente: { bg: '#fee', color: '#c33' },
      alta: { bg: '#fff3cd', color: '#856404' },
      media: { bg: '#e7f3ff', color: '#004085' },
      baja: { bg: '#e8f5e9', color: '#2e7d32' },
    };
    const style = styles[prioridad] || styles.media;
    
    return (
      <span style={{
        ...badgeStyle,
        backgroundColor: style.bg,
        color: style.color,
      }}>
        {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </span>
    );
  };

  const getEstadoBadge = (estado) => {
    const isEnCurso = estado === 'en_curso';
    return (
      <span style={{
        ...badgeStyle,
        backgroundColor: isEnCurso ? '#d4edda' : '#fff3cd',
        color: isEnCurso ? '#155724' : '#856404',
      }}>
        {isEnCurso ? '🚚 En Curso' : '📋 Planificada'}
      </span>
    );
  };

  return (
    <div style={modalBackdropStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#2c3e50' }}>
            Detalle de Ruta
          </h2>
          <button
            style={closeButtonStyle}
            onClick={handleClose}
            onMouseEnter={(e) => e.target.style.color = '#666'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
          >
            ✕
          </button>
        </div>

        {/* Información General */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>📌</span> Información General
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>ID Ruta:</span>
            <span style={valueStyle}>#{ruta.id}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Estado:</span>
            <span style={valueStyle}>{getEstadoBadge(ruta.estadoRuta)}</span>
          </div>
        </div>

        {/* Vehículo */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>🚗</span> Información del Vehículo
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Patente:</span>
            <span style={{...valueStyle, fontWeight: '700', color: '#667eea'}}>
              {ruta.vehiculo.patente}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Marca/Modelo:</span>
            <span style={valueStyle}>
              {ruta.vehiculo.marca} {ruta.vehiculo.modelo}
            </span>
          </div>
          {ruta.vehiculo.año && (
            <div style={rowStyle}>
              <span style={labelStyle}>Año:</span>
              <span style={valueStyle}>{ruta.vehiculo.año}</span>
            </div>
          )}
        </div>

        {/* Conductor */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>👤</span> Conductor Asignado
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Nombre:</span>
            <span style={valueStyle}>{ruta.conductor.nombre}</span>
          </div>
          {ruta.conductor.telefono && (
            <div style={rowStyle}>
              <span style={labelStyle}>Teléfono:</span>
              <span style={valueStyle}>{ruta.conductor.telefono}</span>
            </div>
          )}
          {ruta.conductor.email && (
            <div style={rowStyle}>
              <span style={labelStyle}>Email:</span>
              <span style={valueStyle}>{ruta.conductor.email}</span>
            </div>
          )}
        </div>

        {/* Carga */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>📦</span> Información de Carga
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Descripción:</span>
            <span style={valueStyle}>{ruta.carga.descripcion}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Peso:</span>
            <span style={valueStyle}>{ruta.carga.peso.toLocaleString()} kg</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Prioridad:</span>
            <span style={valueStyle}>{getPrioridadBadge(ruta.carga.prioridad)}</span>
          </div>
          {ruta.carga.referencia && (
            <div style={rowStyle}>
              <span style={labelStyle}>Referencia:</span>
              <span style={valueStyle}>{ruta.carga.referencia}</span>
            </div>
          )}
        </div>

        {/* Ruta - Ubicaciones */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>📍</span> Ruta de Entrega
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Origen:</span>
            <span style={valueStyle}>{ruta.origen}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Destino:</span>
            <span style={{...valueStyle, fontWeight: '600', color: '#27ae60'}}>
              {ruta.destino}
            </span>
          </div>
          {ruta.distanciaKm && (
            <div style={rowStyle}>
              <span style={labelStyle}>Distancia:</span>
              <span style={valueStyle}>{ruta.distanciaKm} km</span>
            </div>
          )}
        </div>

        {/* Datos Adicionales - Solo si existen */}
        {(ruta.fechaInicio || ruta.horaEstimada) && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>⏱️</span> Planificación
            </div>
            {ruta.fechaInicio && (
              <div style={rowStyle}>
                <span style={labelStyle}>Fecha Inicio:</span>
                <span style={valueStyle}>
                  {new Date(ruta.fechaInicio).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
            {ruta.horaEstimada && (
              <div style={rowStyle}>
                <span style={labelStyle}>Hora Estimada:</span>
                <span style={valueStyle}>{ruta.horaEstimada}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer / Botones */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ecf0f1',
              color: '#2c3e50',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ecf0f1'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RutaDetailModal;
