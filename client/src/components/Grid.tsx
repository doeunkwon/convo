import React from "react";
import "../styles/Grid.css";

interface GridProps {
  size?: number; // Optional prop to set grid size
}

const Grid: React.FC<GridProps> = ({ size }) => {
  const weeks = 26;
  const daysPerWeek = 7;

  const generateData = () => {
    return Array.from(
      { length: weeks * daysPerWeek },
      () => Math.random() > 0.5
    );
  };

  const data = generateData();

  const gridStyle = size
    ? ({ "--grid-size": `${size}px` } as React.CSSProperties)
    : {};

  return (
    <div className="grid" style={gridStyle}>
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="grid-week">
          {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
            const dataIndex = weekIndex * daysPerWeek + dayIndex;
            return (
              <div
                key={dayIndex}
                className={`grid-day ${data[dataIndex] ? "filled" : "empty"}`}
                title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
