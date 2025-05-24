import React from 'react';
import './kpi-cards.css';

const KpiCard = ({ icon, trend, title, value, progress, color }) => (
  <div className="kpi-card" style={{ borderLeftColor: color }}>
    <div className="kpi-header">
      <div className="kpi-icon">{icon}</div>
      <div className={`kpi-trend ${trend > 0 ? 'positive' : 'negative'}`}>
        {trend > 0 ? `↗️ +${trend}%` : `↘️ ${trend}%`}
      </div>
    </div>
    <div className="kpi-content">
      <h3>{title}</h3>
      <p className="kpi-value">{value}</p>
      <div className="kpi-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  </div>
);

export default KpiCard;