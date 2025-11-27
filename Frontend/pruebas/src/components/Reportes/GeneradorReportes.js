import { useState } from 'react';
import { dashboardService, reportesService } from '../../services';
import { exportarPDF, descargarPDF, exportarExcel, descargarExcel, descargarJSON } from '../../utils/exportUtils';

function GeneradorReportes() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tiposReporte, setTiposReporte] = useState({
    rutas: true,
    cargas: false,
    vehiculos: false,
    usuarios: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [datosGenerados, setDatosGenerados] = useState(null);
  const [estadisticasReporte, setEstadisticasReporte] = useState(null);

  const handleToggleTipo = (tipo) => {
    setTiposReporte(prev => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona un rango de fechas');
      return;
    }

    if (!Object.values(tiposReporte).some(v => v)) {
      setError('Por favor selecciona al menos un tipo de reporte');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const datosConsolidados = {};
      let totalRegistros = 0;

      // Rutas
      if (tiposReporte.rutas) {
        const rutas = await dashboardService.obtenerRutasActivas();
        const rutasFiltradas = rutas.filter(r => {
          const fecha = new Date(r.fechaInicio);
          return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
        });
        datosConsolidados.rutas = rutasFiltradas.map(r => ({
          'ID Ruta': r.id,
          'Vehículo': r.vehiculo.patente,
          'Conductor': r.conductor.nombre,
          'Origen': r.origen,
          'Destino': r.destino,
          'Estado': r.estadoRuta,
          'Distancia (km)': r.distanciaKm || '-',
          'Prioridad': r.carga.prioridad,
          'Peso (kg)': r.carga.peso,
        }));
        totalRegistros += datosConsolidados.rutas.length;
      }

      // Cargas
      if (tiposReporte.cargas) {
        // Simular datos de cargas (en producción, vendrían del backend)
        datosConsolidados.cargas = [];
        totalRegistros += datosConsolidados.cargas.length;
      }

      // Vehículos
      if (tiposReporte.vehiculos) {
        // Simular datos de vehículos
        datosConsolidados.vehiculos = [];
        totalRegistros += datosConsolidados.vehiculos.length;
      }

      // Usuarios
      if (tiposReporte.usuarios) {
        // Simular datos de usuarios
        datosConsolidados.usuarios = [];
        totalRegistros += datosConsolidados.usuarios.length;
      }

      setDatosGenerados(datosConsolidados);
      setEstadisticasReporte({
        fechaInicio,
        fechaFin,
        tiposIncluidos: Object.entries(tiposReporte)
          .filter(([_, v]) => v)
          .map(([k]) => k),
        totalRegistros,
        fechaGeneracion: new Date().toLocaleString('es-ES'),
      });

      setError('');
    } catch (err) {
      setError(err.message || 'Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportarPDFReporte = () => {
    if (!datosGenerados) {
      setError('Por favor genera un reporte primero');
      return;
    }

    try {
      const datosTabla = datosGenerados.rutas || [];
      const filtros = {
        'Fecha Inicio': fechaInicio,
        'Fecha Fin': fechaFin,
        'Tipos': Object.entries(tiposReporte)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', '),
      };

      const doc = exportarPDF(
        datosTabla,
        'INFORME DE OPERACIONES LOGÍSTICAS',
        'Reporte Consolidado de Rutas, Cargas, Vehículos y Usuarios',
        estadisticasReporte.fechaGeneracion,
        filtros
      );

      descargarPDF(doc, `Reporte-Operaciones-${new Date().toISOString().split('T')[0]}`);
    } catch (err) {
      setError('Error al exportar PDF');
    }
  };

  const exportarExcelReporte = () => {
    if (!datosGenerados) {
      setError('Por favor genera un reporte primero');
      return;
    }

    try {
      const datosTabla = datosGenerados.rutas || [];
      const csv = exportarExcel(datosTabla, 'Rutas');
      descargarExcel(csv, `Reporte-Operaciones-${new Date().toISOString().split('T')[0]}`);
    } catch (err) {
      setError('Error al exportar Excel');
    }
  };

  const exportarJSONReporte = () => {
    if (!datosGenerados) {
      setError('Por favor genera un reporte primero');
      return;
    }

    try {
      descargarJSON(
        {
          ...datosGenerados,
          estadisticas: estadisticasReporte,
        },
        `Reporte-Operaciones-${new Date().toISOString().split('T')[0]}`
      );
    } catch (err) {
      setError('Error al exportar JSON');
    }
  };

  const containerStyle = {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '30px 20px',
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '24px',
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const formGroupStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'inherit',
  };

  const checkboxContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '8px',
  };

  const checkboxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  };

  const checkboxInputStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#667eea',
  };

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle = (isPrimary = true) => ({
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: isPrimary ? '#667eea' : '#ecf0f1',
    color: isPrimary ? 'white' : '#2c3e50',
  });

  const resultsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  };

  const statBoxStyle = {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    borderLeft: '4px solid #667eea',
  };

  const statNumberStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '4px',
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Encabezado */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#2c3e50' }}>
            📊 Generador de Reportes
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
            Exporta informes consolidados en PDF, Excel o JSON
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filtros */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>🔍</span> Configurar Reporte
          </h2>

          {/* Rango de fechas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Tipos de reporte */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Tipos de Datos a Incluir</label>
            <div style={checkboxContainerStyle}>
              {Object.entries(tiposReporte).map(([tipo, seleccionado]) => (
                <label key={tipo} style={checkboxStyle}>
                  <input
                    type="checkbox"
                    checked={seleccionado}
                    onChange={() => handleToggleTipo(tipo)}
                    style={checkboxInputStyle}
                  />
                  <span style={{ fontSize: '14px', cursor: 'pointer' }}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Botón generar */}
          <button
            onClick={generarReporte}
            disabled={loading}
            style={{
              ...buttonStyle(true),
              width: '100%',
              marginTop: '24px',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#5568d3')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
          >
            {loading ? '⏳ Generando...' : '📋 Generar Reporte'}
          </button>
        </div>

        {/* Resultados */}
        {estadisticasReporte && (
          <>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>
                <span>✅</span> Reporte Generado
              </h2>

              <div style={resultsGridStyle}>
                <div style={statBoxStyle}>
                  <div style={statNumberStyle}>{estadisticasReporte.totalRegistros}</div>
                  <div style={statLabelStyle}>Registros</div>
                </div>
                <div style={statBoxStyle}>
                  <div style={statNumberStyle}>{estadisticasReporte.tiposIncluidos.length}</div>
                  <div style={statLabelStyle}>Tipos de Datos</div>
                </div>
                <div style={statBoxStyle}>
                  <div style={{...statNumberStyle, fontSize: '14px', color: '#555'}}>
                    {estadisticasReporte.fechaGeneracion}
                  </div>
                  <div style={statLabelStyle}>Generado</div>
                </div>
              </div>

              {/* Botones de descarga */}
              <div style={buttonContainerStyle}>
                <button
                  onClick={exportarPDFReporte}
                  style={{
                    ...buttonStyle(true),
                    backgroundColor: '#e74c3c',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  📄 Descargar PDF
                </button>
                <button
                  onClick={exportarExcelReporte}
                  style={{
                    ...buttonStyle(true),
                    backgroundColor: '#27ae60',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
                >
                  📊 Descargar Excel
                </button>
                <button
                  onClick={exportarJSONReporte}
                  style={{
                    ...buttonStyle(true),
                    backgroundColor: '#3498db',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  📋 Descargar JSON
                </button>
                <button
                  onClick={() => {
                    setDatosGenerados(null);
                    setEstadisticasReporte(null);
                  }}
                  style={buttonStyle(false)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#bdc3c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ecf0f1'}
                >
                  🔄 Nuevo Reporte
                </button>
              </div>
            </div>

            {/* Vista previa */}
            {datosGenerados.rutas && datosGenerados.rutas.length > 0 && (
              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>
                  <span>👁️</span> Vista Previa
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px',
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        {Object.keys(datosGenerados.rutas[0]).map(col => (
                          <th key={col} style={{
                            padding: '10px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#555',
                            borderBottom: '2px solid #dee2e6',
                          }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datosGenerados.rutas.slice(0, 5).map((fila, idx) => (
                        <tr key={idx} style={{
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                        }}>
                          {Object.values(fila).map((valor, colIdx) => (
                            <td key={colIdx} style={{ padding: '10px', color: '#333' }}>
                              {typeof valor === 'object' ? JSON.stringify(valor) : valor}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {datosGenerados.rutas.length > 5 && (
                    <p style={{ marginTop: '12px', color: '#999', fontSize: '12px' }}>
                      ... y {datosGenerados.rutas.length - 5} registros más
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GeneradorReportes;
