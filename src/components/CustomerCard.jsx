import React from 'react';
import './CustomerCard.css';

const CustomerCard = ({ name, avatar, stats, tier }) => {
  return (
    <div className="customer-card">
      <div className="customer-avatar">{avatar}</div>
      <div className="customer-info">
        <h4>{name}</h4>
        <div className="customer-stats">
          {stats.map((stat, index) => (
            <div className="stat" key={index}>
              <span className="label">{stat.label}</span>
              <span className="value">{stat.value}</span>
            </div>
          ))}
        </div>
        <div className="customer-tier">
          <span className={`tier-badge ${tier.toLowerCase()}`}>{tier}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;