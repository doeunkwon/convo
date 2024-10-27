import React from "react";
import "../styles/ProgressPage.css";
import ProgressCard from "../components/ProgressCard";
import { Progress } from "../models/progress";
import { getUserCreationTime } from "../utils/getUserStartDate";
import { calculateDaysPassed } from "../utils/calculateDaysPassed";

interface ProgressPageProps {
  progress: Progress;
}

function ProgressPage({ progress }: ProgressPageProps) {
  const userCreationTime = getUserCreationTime();
  const todayIndex = calculateDaysPassed(userCreationTime);

  return (
    <main className="progress-page">
      <p>
        Week {Math.floor(todayIndex / 7) + 1}, Day {(todayIndex % 7) + 1}
      </p>
      <ProgressCard progress={progress} />
    </main>
  );
}

export default ProgressPage;
