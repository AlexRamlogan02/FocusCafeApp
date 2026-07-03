import React, { useState } from 'react';

const Switch = ({ 
  isOn = false, 
  onToggle, 
  onLabel = 'On', 
  offLabel = 'Off',
  onImage,      // Path to the "on" state image
  offImage,     // Path to the "off" state image
  className = ''
}) => {
  const [toggled, setToggled] = useState(isOn);

  const handleToggle = () => {
    const newState = !toggled;
    setToggled(newState);
    
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      className={`switch ${toggled ? 'switch--on' : 'switch--off'} ${className}`}
      onClick={handleToggle}
      role="switch"
      aria-checked={toggled}
    >
      {onImage || offImage ? (
        <img 
          src={toggled ? onImage : offImage} 
          alt={toggled ? onLabel : offLabel}
          className="switch__image"
        />
      ) : (
        <>
          <span className="switch__toggle" />
          <span className="switch__label">
            {toggled ? onLabel : offLabel}
          </span>
        </>
      )}
    </button>
  );
};

export default Switch;