import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import DailyPage from "./pages/DailyPage";
import ProgressPage from "./pages/ProgressPage";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { Challenge } from "./models/challenge";
import { weeks, daysPerWeek } from "./constants";
import { Progress } from "./models/progress";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "",
    description: "",
    relation: "",
  });
  const [progress, setProgress] = useState<Progress>({
    currentStreak: 0,
    longestStreak: 0,
    history: [],
  });

  const getNavbarTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Daily";
      case "/progress":
        return "Progress";
      default:
        return "Convo";
    }
  };

  const getChallenge = (): Challenge => {
    return {
      title: "The Compliment Game",
      description: "Give genuine compliments to three different people.",
      relation:
        "Today’s challenge helps you make friends by creating positive interactions. Giving genuine compliments fosters warmth and can spark new connections, making others feel valued and open to engaging with you. This simple step builds confidence in forming new friendships.",
    };
  };

  const getProgress = (): Progress => {
    return {
      currentStreak: 12,
      longestStreak: 21,
      history: Array.from(
        { length: weeks * daysPerWeek },
        () => Math.random() > 0.5
      ),
    };
  };

  useEffect(() => {
    setDailyChallenge(getChallenge());
    setProgress(getProgress());
  }, []);

  return (
    <main className="App">
      <section className="App-content">
        <Navbar
          onClickSparkling={() => navigate("/")}
          onClickPulse={() => navigate("/progress")}
          title={getNavbarTitle()}
        />
        <Routes>
          <Route
            path="/"
            element={<DailyPage dailyChallenge={dailyChallenge} />}
          />
          <Route
            path="/progress"
            element={<ProgressPage progress={progress} />}
          />
        </Routes>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
