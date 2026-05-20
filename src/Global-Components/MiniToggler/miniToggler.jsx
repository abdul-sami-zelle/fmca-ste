import React from "react";
import "./miniToggler.css";

const MiniToggleSwitch = ({ checked, onChange, isDeliveryAllowed }) => {
  return (
    <div className="checkbox-wrapper-2">
      <input
        type="checkbox"
        className="sc-gJwTLC ikxBAC"
        checked={checked}
        onChange={onChange}
        readOnly={isDeliveryAllowed}
      />
    </div>
  );
};

export default MiniToggleSwitch;
