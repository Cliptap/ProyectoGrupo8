function CargaCard({ carga }) {
  // HU8: Función para determinar si la carga está asignada
  const isAsignada = () => {
    if (!carga.rutas || carga.rutas.length === 0) {
      return false;
    }
    // Retorna true si hay al menos una ruta en estado planificada o en_curso
    return carga.rutas.some(ruta => 
      ruta.estadoRuta === 'planificada' || ruta.estadoRuta === 'en_curso'
    );
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: { bg: '#fff3cd', color: '#856404', icon: '🟡' },
      asignada: { bg: '#cfe2ff', color: '#084298', icon: '🔵' },
      en_transito: { bg: '#ffe5cc', color: '#cc5200', icon: '🟠' },
      entregada: { bg: '#d4edda', color: '#155724', icon: '🟢' },
    };
    return colores[estado] || colores.pendiente;
  };

  const getTipoColor = (tipo) => {
    // HU7: Tipos alineados a productos de lujo
    const colores = {
      normal: { bg: '#d1ecf1', color: '#0c5460', icon: '👔' },        // Ropa/accesorios premium
      fragil: { bg: '#f8d7da', color: '#721c24', icon: '🔴' },        // Cristalería, porcelana
      alto_valor: { bg: '#fff3cd', color: '#856404', icon: '💎' },   // Joyas, relojes, electrónica premium
    };
    return colores[tipo] || colores.normal;
  };

  const getPrioridadColor = (prioridad) => {
    const colores = {
      baja: { bg: '#e2e3e5', color: '#383d41' },
      media: { bg: '#d1ecf1', color: '#0c5460' },
      alta: { bg: '#fff3cd', color: '#856404' },
      urgente: { bg: '#f8d7da', color: '#721c24' },
    };
    return colores[prioridad] || colores.media;
  };

  const estadoStyle = getEstadoColor(carga.estado);
  const tipoStyle = getTipoColor(carga.tipo);
  const prioridadStyle = getPrioridadColor(carga.prioridad);

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
        marginBottom: '16px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {tipoStyle.icon} {carga.descripcion}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#7f8c8d',
            fontWeight: '500',
          }}>
            ID: #{carga.id}
          </div>
        </div>

        {/* Badge de estado */}
        <div style={{
          backgroundColor: estadoStyle.bg,
          color: estadoStyle.color,
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textTransform: 'capitalize',
        }}>
          {estadoStyle.icon} {carga.estado.replace('_', ' ')}
        </div>
      </div>

      {/* Información de la carga */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>
            Peso
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50' }}>
            ⚖️ {carga.peso.toLocaleString()} kg
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>
            Tipo
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: tipoStyle.color,
            backgroundColor: tipoStyle.bg,
            padding: '4px 10px',
            borderRadius: '12px',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}>
            {carga.tipo}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>
            Prioridad
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: prioridadStyle.color,
            backgroundColor: prioridadStyle.bg,
            padding: '4px 10px',
            borderRadius: '12px',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}>
            {carga.prioridad}
          </div>
        </div>

        {/* HU8: Indicador de asignación de ruta */}
        <div>
          <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>
            Estado de Asignación
          </div>
          {isAsignada() ? (
            // Carga asignada (tiene ruta en estado planificada o en_curso)
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              ✅ Asignada
            </div>
          ) : (
            // Carga no asignada (sin ruta activa)
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              ❌ No asignada
            </div>
          )}
        </div>
      </div>

      {/* Origen y Destino */}
      <div style={{
        padding: '12px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        marginBottom: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>📍</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>Origen</div>
            <div style={{ fontSize: '13px', color: '#2c3e50', fontWeight: '500' }}>{carga.origen}</div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>🎯</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>Destino</div>
            <div style={{ fontSize: '13px', color: '#2c3e50', fontWeight: '500' }}>{carga.destino}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CargaCard;