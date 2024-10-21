import "../styles/PanelCard.css";
import Grid from "./Grid";

type ProgressCardProps = {
  currentStreak: number;
  longestStreak: number;
};

function ProgressCard({ currentStreak, longestStreak }: ProgressCardProps) {
  return (
    <main className="panel-card">
      <section className="panel-card-horizontal-header">
        <section className="panel-streak-text">
          <p>Current streak</p>
          <h3>{currentStreak} days</h3>
        </section>
        <section className="panel-card-slit"></section>
        <section className="panel-streak-text">
          <p>Longest streak</p>
          <h3 className="gradient-text">{longestStreak} days</h3>
        </section>
      </section>
      <section className="panel-card-divider"></section>
      <section className="panel-card-grid">
        <Grid />
      </section>
    </main>
  );
}

export default ProgressCard;
