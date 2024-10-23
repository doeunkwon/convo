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
          <p>Current streak</p>
          <h3>{progress.currentStreak} days</h3>
        </section>
        <section className="panel-card-slit"></section>
        <section className="panel-streak-text">
          <p>Longest streak</p>
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
            <h3 className="gradient-text">{progress.longestStreak} days</h3>
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
