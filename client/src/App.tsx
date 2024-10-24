import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import DailyPage from "./pages/DailyPage";
import ProgressPage from "./pages/ProgressPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage"; // Import the SignInPage
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { Challenge } from "./models/challenge";
import { weeks, daysPerWeek } from "./constants";
import { Progress } from "./models/progress";
import SettingsPage from "./pages/SettingsPage";
import PrivateRoute from "./components/PrivateRoute";
import { getAuth } from "firebase/auth";

function AppContent() {
  const location = useLocation();
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "",
    task: "",
    tip: "",
  });
  const [progress, setProgress] = useState<Progress>({
    currentStreak: 0,
    longestStreak: 0,
    history: [],
  });

  const getNavbarTitle = () => {
    switch (location.pathname) {
      case "/daily":
        return "Daily";
      case "/progress":
        return "Progress";
      case "/settings":
        return "Settings";
      default:
        return "Convo";
    }
  };

  // async function fetchChallenge() {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   if (user) {
  //     const token = await user.getIdToken();
  //     const response = await fetch("http://localhost:8080/generate-challenge", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //     });

  //     if (response.ok) {
  //       const challenge = await response.json();
  //       console.log(challenge);
  //       setDailyChallenge(challenge);
  //     } else {
  //       console.error("Failed to fetch challenge");
  //     }
  //   } else {
  //     console.error("No user is signed in");
  //   }
  // }

  function fetchChallenge() {
    setDailyChallenge({
      title: "The Compliment Game",
      task: "Give genuine compliments to three different people.",
      tip: "Today’s challenge helps you make friends by creating positive interactions. Giving genuine compliments fosters warmth and can spark new connections, making others feel valued and open to engaging with you. This simple step builds confidence in forming new friendships.",
    });
  }

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
    fetchChallenge();
    setProgress(getProgress());
  }, []);

  return (
    <main className="App">
      <section className="App-content">
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <Navbar title={getNavbarTitle()} />
        )}
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/daily"
            element={
              <PrivateRoute>
                <DailyPage dailyChallenge={dailyChallenge} />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <ProgressPage progress={progress} />
              </PrivateRoute>
            }
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
