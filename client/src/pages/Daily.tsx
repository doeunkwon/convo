import DailyCard from "../components/DailyCard";
import "../styles/Daily.css";
import Button from "../components/Button";

function Daily() {
  return (
    <main className="daily">
      <section className="daily-card">
        <p>Today's Challenge</p>
        <DailyCard
          title="The Compliment Game"
          task="Give genuine compliments to three different people."
          relation="Today’s challenge helps you make friends by creating positive interactions. Giving genuine compliments fosters warmth and can spark new connections, making others feel valued and open to engaging with you. This simple step builds confidence in forming new friendships."
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
