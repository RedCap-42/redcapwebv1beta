import React from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className }) => {
  return (
    <button onClick={onClick} className={`btn ${className}`}>
      {label}
    </button>
  );
};

export default Button;