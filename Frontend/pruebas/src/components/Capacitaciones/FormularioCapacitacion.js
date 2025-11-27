import React, { useState, useEffect } from 'react';

const FormularioCapacitacion = ({ trabajadores, onGuardar, onCancelar, capacitacionEditando }) => {
  const [formData, setFormData] = useState({
    usuarioId: '',
    tema: '',
    fechaCapacitacion: '',
    categoria: 'general',
    institucion: '',
    certificacion: 'no_aplica',
    duracionHoras: '',
    calificacion: '',
    notas: ''
  });

  const [errores, setErrores] = useState({});

  const categorias = ['general', 'seguridad', 'logística', 'atención_cliente', 'operación'];
  const certificaciones = ['no_aplica', 'en_proceso', 'certificado_entregado'];

  // Cargar datos si está editando
  useEffect(() => {
    if (capacitacionEditando) {
      setFormData({
        usuarioId: capacitacionEditando.usuarioId,
        tema: capacitacionEditando.tema,
        fechaCapacitacion: capacitacionEditando.fechaCapacitacion.split('T')[0],
        categoria: capacitacionEditando.categoria,
        institucion: capacitacionEditando.institucion || '',
        certificacion: capacitacionEditando.certificacion,
        duracionHoras: capacitacionEditando.duracionHoras || '',
        calificacion: capacitacionEditando.calificacion || '',
        notas: capacitacionEditando.notas || ''
      });
    }
  }, [capacitacionEditando]);

  const validar = () => {
    const nuevosErrores = {};
    
    if (!formData.usuarioId) nuevosErrores.usuarioId = 'Selecciona un trabajador';
    if (!formData.tema.trim()) nuevosErrores.tema = 'El tema es requerido';
    if (!formData.fechaCapacitacion) nuevosErrores.fechaCapacitacion = 'La fecha es requerida';
    if (formData.duracionHoras && isNaN(formData.duracionHoras)) nuevosErrores.duracionHoras = 'Debe ser un número';
    if (formData.calificacion && (isNaN(formData.calificacion) || formData.calificacion < 0 || formData.calificacion > 100)) {
      nuevosErrores.calificacion = 'Debe ser un número entre 0 y 100';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validar()) {
      onGuardar({
        usuarioId: parseInt(formData.usuarioId),
        tema: formData.tema,
        fechaCapacitacion: formData.fechaCapacitacion,
        categoria: formData.categoria,
        institucion: formData.institucion || null,
        certificacion: formData.certificacion,
        duracionHoras: formData.duracionHoras ? parseInt(formData.duracionHoras) : null,
        calificacion: formData.calificacion ? parseFloat(formData.calificacion) : null,
        notas: formData.notas || null
      });
    }
  };

  const estilosFormulario = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const estilosGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  };

  const estilosGrupo = {
    display: 'flex',
    flexDirection: 'column'
  };

  const estilosLabel = {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
    fontSize: '13px'
  };

  const estilosInput = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box'
  };

  const estilosInputError = {
    ...estilosInput,
    borderColor: '#d32f2f',
    backgroundColor: '#ffebee'
  };

  const estilosError = {
    color: '#d32f2f',
    fontSize: '12px',
    marginTop: '3px'
  };

  const estilosTextarea = {
    ...estilosInput,
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'Arial, sans-serif'
  };

  const estilosBotones = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  };

  const estilosBotonPrimario = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const estilosBotonSecundario = {
    padding: '10px 20px',
    backgroundColor: '#757575',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <form style={estilosFormulario} onSubmit={manejarEnvio}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
        {capacitacionEditando ? '✏️ Editar Capacitación' : '➕ Nueva Capacitación'}
      </h2>

      <div style={estilosGrid}>
        {/* Trabajador */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Trabajador *</label>
          <select
            name="usuarioId"
            value={formData.usuarioId}
            onChange={manejarCambio}
            style={errores.usuarioId ? estilosInputError : estilosInput}
          >
            <option value="">Selecciona un trabajador</option>
            {trabajadores.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          {errores.usuarioId && <p style={estilosError}>{errores.usuarioId}</p>}
        </div>

        {/* Tema */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Tema *</label>
          <input
            type="text"
            name="tema"
            value={formData.tema}
            onChange={manejarCambio}
            placeholder="Ej: Protocolo de Seguridad"
            style={errores.tema ? estilosInputError : estilosInput}
          />
          {errores.tema && <p style={estilosError}>{errores.tema}</p>}
        </div>

        {/* Fecha */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Fecha de Capacitación *</label>
          <input
            type="date"
            name="fechaCapacitacion"
            value={formData.fechaCapacitacion}
            onChange={manejarCambio}
            style={errores.fechaCapacitacion ? estilosInputError : estilosInput}
          />
          {errores.fechaCapacitacion && <p style={estilosError}>{errores.fechaCapacitacion}</p>}
        </div>

        {/* Categoría */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={manejarCambio}
            style={estilosInput}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Institución */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Institución</label>
          <input
            type="text"
            name="institucion"
            value={formData.institucion}
            onChange={manejarCambio}
            placeholder="Ej: SENCE, Universidad"
            style={estilosInput}
          />
        </div>

        {/* Certificación */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Estado Certificación</label>
          <select
            name="certificacion"
            value={formData.certificacion}
            onChange={manejarCambio}
            style={estilosInput}
          >
            {certificaciones.map(cert => (
              <option key={cert} value={cert}>
                {cert === 'no_aplica' ? 'No aplica' :
                 cert === 'en_proceso' ? 'En proceso' :
                 'Certificado entregado'}
              </option>
            ))}
          </select>
        </div>

        {/* Duración */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Duración (horas)</label>
          <input
            type="number"
            name="duracionHoras"
            value={formData.duracionHoras}
            onChange={manejarCambio}
            placeholder="Ej: 40"
            min="0"
            style={errores.duracionHoras ? estilosInputError : estilosInput}
          />
          {errores.duracionHoras && <p style={estilosError}>{errores.duracionHoras}</p>}
        </div>

        {/* Calificación */}
        <div style={estilosGrupo}>
          <label style={estilosLabel}>Calificación (0-100)</label>
          <input
            type="number"
            name="calificacion"
            value={formData.calificacion}
            onChange={manejarCambio}
            placeholder="Ej: 85"
            min="0"
            max="100"
            style={errores.calificacion ? estilosInputError : estilosInput}
          />
          {errores.calificacion && <p style={estilosError}>{errores.calificacion}</p>}
        </div>
      </div>

      {/* Notas */}
      <div style={estilosGrupo}>
        <label style={estilosLabel}>Notas</label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={manejarCambio}
          placeholder="Observaciones adicionales"
          style={estilosTextarea}
        />
      </div>

      {/* Botones */}
      <div style={estilosBotones}>
        <button
          type="button"
          style={estilosBotonSecundario}
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={estilosBotonPrimario}
        >
          {capacitacionEditando ? 'Actualizar' : 'Guardar'} Capacitación
        </button>
      </div>
    </form>
  );
};

export default FormularioCapacitacion;
