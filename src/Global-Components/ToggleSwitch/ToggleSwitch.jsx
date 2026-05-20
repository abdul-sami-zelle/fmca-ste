import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ id, checked, onChange }) => {
  return (
    // Checkbox 2
    <div className="checkbox-wrapper-7" >
      <input className="tgl tgl-ios" type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label className="tgl-btn" htmlFor={id}></label>
    </div>
  );
};

export default ToggleSwitch;





