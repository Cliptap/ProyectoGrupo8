function RutasTable({ rutas, onVerDetalle }) {
  if (rutas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999',
      }}>
        <h3 style={{ color: '#666', fontWeight: '400' }}>No hay rutas activas</h3>
        <p style={{ fontSize: '14px' }}>Las rutas aparecerán aquí cuando sean asignadas</p>
      </div>
    );
  }

  const getPrioridadBadge = (prioridad) => {
    const styles = {
      urgente: { bg: '#fee', color: '#c33'},
      alta: { bg: '#fff3cd', color: '#856404'},
      media: { bg: '#e7f3ff', color: '#004085'},
      baja: { bg: '#e8f5e9', color: '#2e7d32'},
    };
    const style = styles[prioridad] || styles.media;
    
    return (
      <span style={{
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
      }}>
        {style.icon} {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </span>
    );
  };

  const getEstadoBadge = (estado) => {
    const isEnCurso = estado === 'en_curso';
    return (
      <span style={{
        padding: '6px 14px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: isEnCurso ? '#d4edda' : '#fff3cd',
        color: isEnCurso ? '#155724' : '#856404',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '16px' }}>{isEnCurso ? '' : ''}</span>
        {isEnCurso ? 'En Curso' : 'Planificada'}
      </span>
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'separate',
        borderSpacing: '0',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={headerStyle}>Vehículo</th>
            <th style={headerStyle}>Carga</th>
            <th style={headerStyle}>Conductor</th>
            <th style={headerStyle}>Ruta</th>
            <th style={{...headerStyle, textAlign: 'center'}}>Prioridad</th>
            <th style={{...headerStyle, textAlign: 'center'}}>Estado</th>
            <th style={{...headerStyle, textAlign: 'center'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta, index) => (
            <tr 
              key={ruta.id} 
              style={{ 
                borderBottom: index < rutas.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={cellStyle}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {ruta.vehiculo.patente}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {ruta.vehiculo.marca} {ruta.vehiculo.modelo}
                  </div>
                </div>
              </td>
              <td style={cellStyle}>
                <div>
                  <div style={{ marginBottom: '4px' }}>
                    {ruta.carga.descripcion}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    ⚖️ {ruta.carga.peso.toLocaleString()} kg
                  </div>
                </div>
              </td>
              <td style={cellStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{ruta.conductor.nombre}</span>
                </div>
              </td>
              <td style={cellStyle}>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div><strong>Origen:</strong> {ruta.origen}</div>
                  <div><strong>Destino:</strong> {ruta.destino}</div>
                  {ruta.distanciaKm && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {ruta.distanciaKm} km
                    </div>
                  )}
                </div>
              </td>
              <td style={{...cellStyle, textAlign: 'center'}}>
                {getPrioridadBadge(ruta.carga.prioridad)}
              </td>
              <td style={{...cellStyle, textAlign: 'center'}}>
                {getEstadoBadge(ruta.estadoRuta)}
              </td>
              <td style={{...cellStyle, textAlign: 'center'}}>
                <button
                  onClick={() => onVerDetalle && onVerDetalle(ruta)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
  borderBottom: '2px solid #dee2e6',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const cellStyle = {
  padding: '16px',
  fontSize: '14px',
};

export default RutasTable;
