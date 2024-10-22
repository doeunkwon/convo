import "../styles/PanelCard.css";

type ChallengeCardProps = {
  title: string;
  task: string;
  relation: string;
};

function ChallengeCard({ title, task, relation }: ChallengeCardProps) {
  return (
    <main className="panel-card">
      <section className="panel-card-vertical-header">
        <h3 className="gradient-text">{title}</h3>
        <h3>{task}</h3>
      </section>
      <section className="panel-card-divider"></section>
      <section className="panel-card-relation">
        <p style={{ color: "var(--text-color)" }}>
          How it relates to your goal
        </p>
        <p>{relation}</p>
      </section>
    </main>
  );
}

export default ChallengeCard;
