import React from 'react';

const PlatformWrapper = ({ isActive, children, className = '' }) => {
  return (
    <div
      className={`absolute w-full h-full transition-all duration-700 ease-in-out origin-center ${
        isActive
          ? 'opacity-100 scale-100 z-20'
          : 'opacity-0 scale-95 z-0 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default PlatformWrapper;
