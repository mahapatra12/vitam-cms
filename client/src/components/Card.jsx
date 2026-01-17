import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ 
  children, 
  title = null,
  subtitle = null,
  actions = null,
  hover = true,
  padding = 'md',
  className = ''
}) => {
  const paddingClass = `card-padding-${padding}`;
  const hoverClass = hover ? 'card-hover' : '';
  
  const classes = ['card', paddingClass, hoverClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
