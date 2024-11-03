import React, { useEffect, useState } from "react";
import "../styles/Grid.css";
import { weeks, daysPerWeek } from "../constants";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { calculateDaysPassed } from "../utils/calculateDaysPassed";

interface GridProps {
  history: number[];
}

function Grid({ history }: GridProps) {
  const [daysPassed, setDaysPassed] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.metadata.creationTime) {
        setDaysPassed(calculateDaysPassed(user.metadata.creationTime));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="grid-week">
          {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
            const dataIndex = weekIndex * daysPerWeek + dayIndex;
            const isCurrentDay = dataIndex === daysPassed;
            return (
              <div
                key={dayIndex}
                className={`grid-day ${
                  history[dataIndex] !== 0.0 ? "filled" : "empty"
                } ${isCurrentDay ? "current-day" : ""}`}
                title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;
