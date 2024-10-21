import React from "react";
import "../styles/CircleIcon.css";

interface CircleIconProps {
  icon: React.ReactElement;
}

function CircleIcon({ icon }: CircleIconProps) {
  return <div className="circle-icon">{icon}</div>;
}

export default CircleIcon;
