/**
 * BadgeEstado - Componente reutilizable para mostrar el estado de un vehículo
 * con colores, iconos y estilos consistentes
 */

function BadgeEstado({ estado, size = 'medium', showIcon = true, animated = false }) {
  // Configuración de colores e iconos por estado
  const estadosConfig = {
    disponible: {
      bg: '#d4edda',
      bgHover: '#c3e6cb',
      color: '#155724',
      border: '#b1dfbb',
      label: 'Disponible',
      shadow: '0 2px 8px rgba(21, 87, 36, 0.15)',
    },
    en_ruta: {
      bg: '#fff3cd',
      bgHover: '#fff0b3',
      color: '#856404',
      border: '#ffeaa7',
      label: 'En Ruta',
      shadow: '0 2px 8px rgba(133, 100, 4, 0.15)',
    },
    mantenimiento: {
      bg: '#f8d7da',
      bgHover: '#f5c6cb',
      color: '#721c24',
      border: '#f1b0b7',
      label: 'Mantenimiento',
      shadow: '0 2px 8px rgba(114, 28, 36, 0.15)',
    },
  };

  // Tamaños del badge
  const sizes = {
    small: {
      padding: '4px 12px',
      fontSize: '11px',
      iconSize: '14px',
      borderRadius: '12px',
      gap: '4px',
    },
    medium: {
      padding: '8px 16px',
      fontSize: '13px',
      iconSize: '16px',
      borderRadius: '20px',
      gap: '6px',
    },
    large: {
      padding: '10px 20px',
      fontSize: '15px',
      iconSize: '18px',
      borderRadius: '24px',
      gap: '8px',
    },
  };

  const config = estadosConfig[estado] || estadosConfig.disponible;
  const sizeStyle = sizes[size] || sizes.medium;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        backgroundColor: config.bg,
        color: config.color,
        border: `2px solid ${config.border}`,
        borderRadius: sizeStyle.borderRadius,
        fontSize: sizeStyle.fontSize,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: config.shadow,
        transition: 'all 0.2s ease',
        cursor: 'default',
        userSelect: 'none',
        animation: animated ? 'pulse 2s infinite' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = config.bgHover;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = config.bg;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {showIcon && (
        <span style={{ fontSize: sizeStyle.iconSize, lineHeight: 1 }}>
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
    </div>
  );
}

export default BadgeEstado;
