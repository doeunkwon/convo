import ChallengeCard from "../components/ChallengeCard";
import "../styles/DailyPage.css";
import Button from "../components/Button";
import { Challenge } from "../models/challenge";

interface DailyProps {
  level: number;
  dailyChallenge: Challenge;
  handleToggleCompletion: () => void;
  completed: boolean;
}

function Daily({
  level,
  dailyChallenge,
  handleToggleCompletion,
  completed,
}: DailyProps) {
  return (
    <main className="daily-page">
      <section className="daily-page-card">
        <p>Level {level} Challenge</p>
        <ChallengeCard
          title={dailyChallenge.title}
          task={dailyChallenge.task}
          tip={dailyChallenge.tip}
        />
      </section>
      <Button
        image={
          completed ? (
            <i className="ri-sparkling-line" />
          ) : (
            <i className="ri-sparkling-fill" />
          )
        }
        gradient={true}
        text={completed ? "Uncomplete" : "Complete"}
        onClick={handleToggleCompletion}
      />
    </main>
  );
}

export default Daily;
