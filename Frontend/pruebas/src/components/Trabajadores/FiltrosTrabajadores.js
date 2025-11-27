function FiltrosTrabajadores({ onFiltrar, totalTrabajadores }) {
  const handleRolChange = (e) => {
    const rol = e.target.value;
    onFiltrar({ rol: rol === 'todos' ? null : rol });
  };

  const handleEstadoChange = (e) => {
    const activo = e.target.value;
    onFiltrar({ activo: activo === 'todos' ? null : activo === 'true' });
  };

  const limpiarFiltros = () => {
    document.getElementById('filtro-rol').value = 'todos';
    document.getElementById('filtro-estado').value = 'todos';
    onFiltrar({ rol: null, activo: null });
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      {/* Título */}
      <div style={{ flex: '0 0 100%', marginBottom: '8px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#2c3e50',
          margin: 0,
        }}>
          ⚙️ Filtros
        </h3>
      </div>

      {/* Filtro por Rol */}
      <div style={{ flex: '1 1 200px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#495057',
          marginBottom: '8px',
        }}>
          Rol / Departamento
        </label>
        <select
          id="filtro-rol"
          onChange={handleRolChange}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        >
          <option value="todos">Todos los roles</option>
          <option value="logistica">🚚 Logística</option>
          <option value="rrhh">👔 RRHH</option>
          <option value="seguridad">👮 Seguridad</option>
        </select>
      </div>

      {/* Filtro por Estado */}
      <div style={{ flex: '1 1 200px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#495057',
          marginBottom: '8px',
        }}>
          Estado
        </label>
        <select
          id="filtro-estado"
          onChange={handleEstadoChange}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        >
          <option value="todos">Todos los estados</option>
          <option value="true">✅ Activos</option>
          <option value="false">⭕ Inactivos</option>
        </select>
      </div>

      {/* Botón Limpiar Filtros */}
      <div style={{ flex: '0 0 auto', marginTop: 'auto' }}>
        <button
          onClick={limpiarFiltros}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '24px',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          🧹 Limpiar Filtros
        </button>
      </div>

      {/* Contador de resultados */}
      <div style={{
        flex: '0 0 100%',
        marginTop: '8px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #dee2e6',
      }}>
        <span style={{
          fontSize: '14px',
          color: '#495057',
        }}>
          Mostrando <strong style={{ color: '#667eea' }}>{totalTrabajadores}</strong> trabajador(es)
        </span>
      </div>
    </div>
  );
}

export default FiltrosTrabajadores;
