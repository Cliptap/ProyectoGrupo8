function FiltrosRutas({ filtros, onCambioFiltro, totalRutas }) {
  const limpiarFiltros = () => {
    onCambioFiltro('estado', 'todas');
    onCambioFiltro('prioridad', 'todas');
    onCambioFiltro('busqueda', '');
  };

  return (
    <div style={{
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    }}>
      {/* Filtro por Estado */}
      <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555',
        }}>
          Estado de Ruta
        </label>
        <select
          value={filtros.estado}
          onChange={(e) => onCambioFiltro('estado', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        >
          <option value="todas">Todas las rutas</option>
          <option value="en_curso">En Curso</option>
          <option value="planificada">Planificadas</option>
        </select>
      </div>

      {/* Filtro por Prioridad */}
      <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555',
        }}>
          Prioridad
        </label>
        <select
          value={filtros.prioridad}
          onChange={(e) => onCambioFiltro('prioridad', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        >
          <option value="todas">Todas las prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      {/* Búsqueda + Botón Limpiar (agrupados para evitar solapamiento) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flex: '1 1 500px',
        minWidth: '350px',
        alignItems: 'flex-end',
        width: '100%',
      }}>
        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#555',
          }}>
            Buscar
          </label>
          <input
            type="text"
            placeholder="Vehículo o conductor..."
            value={filtros.busqueda}
            onChange={(e) => onCambioFiltro('busqueda', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
          />
        </div>

        <button
          onClick={limpiarFiltros}
          aria-label="Limpiar filtros"
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            minHeight: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#c0392b';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#e74c3c';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Contador de resultados */}
      <div style={{
        flex: '1 1 100%',
        marginTop: '10px',
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        boxSizing: 'border-box',
      }}>
        <span>
          <strong>{totalRutas}</strong> {totalRutas === 1 ? 'ruta encontrada' : 'rutas encontradas'}
        </span>
        {(filtros.estado !== 'todas' || filtros.prioridad !== 'todas' || filtros.busqueda) && (
          <span style={{ color: '#667eea', fontWeight: '600' }}>
            Filtros activos ✓
          </span>
        )}
      </div>
    </div>
  );
}

export default FiltrosRutas;