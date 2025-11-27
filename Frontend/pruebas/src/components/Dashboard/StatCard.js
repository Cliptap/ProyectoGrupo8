function StatCard({ icon, title, value, subtitle, color = '#667eea', trend }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
      }}>
        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
          {icon} {title}
        </div>
        {trend && (
          <span style={{
            fontSize: '12px',
            color: trend.type === 'up' ? '#27ae60' : '#e74c3c',
            fontWeight: '600',
          }}>
            {trend.type === 'up' ? '↗' : '↘'} {trend.value}
          </span>
        )}
      </div>
      
      <div style={{ 
        fontSize: '36px', 
        fontWeight: '700', 
        color: '#333',
        marginBottom: '10px',
        lineHeight: '1',
      }}>
        {value}
      </div>
      
      {subtitle && (
        <div style={{ 
          fontSize: '13px', 
          color: '#999',
          lineHeight: '1.4',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default StatCard;
