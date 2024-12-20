import { Progress } from "../models/progress";
import "../styles/PanelCard.css";
import Grid from "./Grid";

type ProgressCardProps = {
  progress: Progress;
};

function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <main className="panel-card">
      <section className="panel-card-horizontal-header">
        <section className="panel-streak-text">
          <p>Current Streak</p>
          <h3 style={{ color: "var(--text-color)" }}>
            {progress.currentStreak}{" "}
            {progress.currentStreak === 1 ? "day" : "days"}
          </h3>
        </section>
        <section className="panel-card-slit"></section>
        <section className="panel-streak-text">
          <p>Longest Streak</p>
          <section
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--xsmall-gap)",
            }}
          >
            <h3>
              <i
                className="ri-sparkling-fill"
                style={{ color: "var(--orange-color)" }}
              ></i>
            </h3>
            <h3 className="gradient-text">
              {progress.longestStreak}{" "}
              {progress.longestStreak === 1 ? "day" : "days"}
            </h3>
          </section>
        </section>
      </section>
      <section className="panel-card-divider"></section>
      <section className="panel-card-grid">
        <Grid history={progress.history} />
      </section>
    </main>
  );
}

export default ProgressCard;
