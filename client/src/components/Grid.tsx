import React from "react";
import "../styles/Grid.css";
import { weeks, daysPerWeek } from "../constants";

interface GridProps {
  history: boolean[];
}

function Grid({ history }: GridProps) {
  return (
    <div className="grid">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="grid-week">
          {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
            const dataIndex = weekIndex * daysPerWeek + dayIndex;
            return (
              <div
                key={dayIndex}
                className={`grid-day ${
                  history[dataIndex] ? "filled" : "empty"
                }`}
                title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;
