import React from 'react';

const MobileCard = ({ 
  title, 
  subtitle, 
  fields = [], 
  actions = [], 
  badge = null,
  borderColor = '#ff6b9d' 
}) => {
  return (
    <div className="mobile-card" style={{ borderLeftColor: borderColor }}>
      <div className="mobile-card-header">
        <div>
          <div className="mobile-card-title">{title}</div>
          {subtitle && <div className="mobile-card-subtitle">{subtitle}</div>}
        </div>
        {badge && <div className="mobile-card-badge">{badge}</div>}
      </div>
      
      <div className="mobile-card-body">
        {fields.map((field, index) => (
          <div key={index} className="mobile-card-field">
            <div className="mobile-card-label">{field.label}</div>
            <div className="mobile-card-value">{field.value}</div>
          </div>
        ))}
      </div>
      
      {actions.length > 0 && (
        <div className="mobile-card-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`mobile-action-button ${action.className || ''}`}
              title={action.title}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCard;