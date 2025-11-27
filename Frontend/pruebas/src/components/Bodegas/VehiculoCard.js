import BadgeEstado from './BadgeEstado';

function VehiculoCard({ vehiculo, onVerDetalle, onEditar, onEliminar }) {
  const getEstadoColor = (estado) => {
    const colores = {
      disponible: { bg: '#d4edda', color: '#155724', icon: '✅' },
      en_ruta: { bg: '#fff3cd', color: '#856404', icon: '���' },
      mantenimiento: { bg: '#f8d7da', color: '#721c24', icon: '���' },
    };
    return colores[estado] || colores.disponible;
  };

  const estadoStyle = getEstadoColor(vehiculo.estado);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #e9ecef',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      e.currentTarget.style.borderColor = '#667eea';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#e9ecef';
    }}
    >
      {/* Barra superior con estado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: estadoStyle.bg,
      }} />

      {/* Header del card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px',
          }}>
            {vehiculo.patente}
          </div>
          <div style={{
            fontSize: '16px',
            color: '#7f8c8d',
            fontWeight: '500',
          }}>
            {vehiculo.marca} {vehiculo.modelo}
          </div>
        </div>

        {/* SCRUM-90: Badge mejorado con componente reutilizable */}
        <BadgeEstado estado={vehiculo.estado} size="medium" />
      </div>

      {/* Información del vehículo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
            Capacidad de carga
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
            ⚖️ {vehiculo.capacidadCarga.toLocaleString()} kg
          </div>
        </div>

        {vehiculo.ubicacionActualLat && vehiculo.ubicacionActualLng && (
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
              Ubicación GPS
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#667eea' }}>
              {vehiculo.ubicacionActualLat.toFixed(4)}, {vehiculo.ubicacionActualLng.toFixed(4)}
            </div>
          </div>
        )}

        {vehiculo.sensores && vehiculo.sensores.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
              Sensores activos
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#27ae60' }}>
              {vehiculo.sensores.length}
            </div>
          </div>
        )}

        {vehiculo.rutas && vehiculo.rutas.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
              Rutas asignadas
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#e67e22' }}>
              {vehiculo.rutas.length}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
      }}>
        <button
          onClick={() => onVerDetalle(vehiculo)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
        >
          Ver
        </button>

        <button
          onClick={() => onEditar(vehiculo)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
        >
          Editar
        </button>

        <button
          onClick={() => onEliminar(vehiculo)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default VehiculoCard;
