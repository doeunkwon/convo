import "../styles/PanelCard.css";

type ChallengeCardProps = {
  title: string;
  task: string;
  tip: string;
};

function ChallengeCard({ title, task, tip }: ChallengeCardProps) {
  return (
    <main className="panel-card">
      <section className="panel-card-vertical-header">
        <h3 className="gradient-text">{title}</h3>
        <h3>{task}</h3>
      </section>
      <section className="panel-card-divider"></section>
      <section className="panel-card-relation">
        <section
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "var(--xsmall-gap)",
          }}
        >
          <p style={{ color: "var(--text-color)" }}>
            <i className="ri-service-line"></i>
          </p>
          <p style={{ color: "var(--text-color)" }}>Tip of the day</p>
        </section>
        <p>{tip}</p>
      </section>
    </main>
  );
}

export default ChallengeCard;
