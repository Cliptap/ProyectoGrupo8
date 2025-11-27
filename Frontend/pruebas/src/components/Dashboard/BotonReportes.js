import { useNavigate } from 'react-router-dom';

function BotonReportes() {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'inline-block',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/Reportes')}
        style={buttonStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
        title="Ir a generador de reportes"
      >
        📊 Generar Reportes
      </button>
    </div>
  );
}

export default BotonReportes;
