import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const disabledClass = disabled || loading ? 'btn-disabled' : '';
  
  const classes = [baseClass, variantClass, sizeClass, widthClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {loading && (
        <span className="btn-spinner"></span>
      )}
      {icon && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
    </motion.button>
  );
};

export default Button;
