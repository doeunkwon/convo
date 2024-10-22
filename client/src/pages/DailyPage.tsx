import ChallengeCard from "../components/ChallengeCard";
import "../styles/DailyPage.css";
import Button from "../components/Button";
import { Challenge } from "../models/Challenge";

interface DailyProps {
  dailyChallenge: Challenge;
}

function Daily({ dailyChallenge }: DailyProps) {
  return (
    <main className="daily-page">
      <section className="daily-page-card">
        <p>Today's challenge</p>
        <ChallengeCard
          title={dailyChallenge.title}
          task={dailyChallenge.description}
          relation={dailyChallenge.relation}
        />
      </section>
      <Button
        image={<i className="ri-sparkling-fill" />}
        text="Complete"
        onClick={() => {}}
      />
    </main>
  );
}

export default Daily;
