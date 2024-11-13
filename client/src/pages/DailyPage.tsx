import ChallengeCard from "../components/ChallengeCard";
import "../styles/DailyPage.css";
import Button from "../components/Button";
import { Challenge } from "../models/challenge";

interface DailyProps {
  dailyChallenge: Challenge;
  handleToggleCompletion: () => Promise<void>;
  completed: number;
}

function Daily({
  dailyChallenge,
  handleToggleCompletion,
  completed,
}: DailyProps) {
  return (
    <main className="daily-page">
      <section className="daily-page-card">
        <p>Level {dailyChallenge.level} Challenge</p>
        <ChallengeCard
          title={dailyChallenge.title}
          task={dailyChallenge.task}
          tip={dailyChallenge.tip}
        />
        <p style={{ fontSize: "var(--sp-size)" }}>
          Discuss this challenge on{" "}
          <a
            href="https://www.reddit.com/r/ConvoApp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            r/convoapp
          </a>
        </p>
      </section>
      <Button
        image={
          completed !== 0.0 ? (
            <i className="ri-sparkling-line" />
          ) : (
            <i className="ri-sparkling-fill" />
          )
        }
        gradient={true}
        text={completed !== 0.0 ? "Uncomplete" : "Complete"}
        onClick={handleToggleCompletion}
      />
    </main>
  );
}

export default Daily;
