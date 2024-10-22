import React from "react";
import "../styles/Progress.css";
import ProgressCard from "../components/ProgressCard";

function Progress() {
  return (
    <main className="progress">
      <p>Recent performance</p>
      <ProgressCard currentStreak={12} longestStreak={21} />
    </main>
  );
}

export default Progress;
