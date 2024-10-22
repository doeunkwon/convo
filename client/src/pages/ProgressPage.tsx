import React from "react";
import "../styles/Progress.css";
import ProgressCard from "../components/ProgressCard";
import { Progress } from "../models/Progress";

interface ProgressPageProps {
  progress: Progress;
}

function ProgressPage({ progress }: ProgressPageProps) {
  return (
    <main className="progress">
      <p>Past 6 months</p>
      <ProgressCard progress={progress} />
    </main>
  );
}

export default ProgressPage;
