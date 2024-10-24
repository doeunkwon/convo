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
import {
  fetchChallenge,
  saveChallengeToServer,
} from "./services/challengeService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserChallenge, deleteChallenge } from "./services/challengeService";

function AppContent() {
  const location = useLocation();
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "",
    task: "",
    tip: "",
    dateCreated: "",
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

  // ISSUES:
  // 1. Gemini API is called twice
  // 2. dateCreated is not being saved to the database

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentDate = new Date().toISOString().split("T")[0];
        // const currentDate = "2024-10-25";
        const existingChallenge = await getUserChallenge(user.uid);

        if (
          existingChallenge &&
          existingChallenge.dateCreated === currentDate
        ) {
          setDailyChallenge(existingChallenge);
        } else {
          if (existingChallenge) {
            await deleteChallenge(user.uid);
          }
          const newChallenge = await fetchChallenge();
          if (newChallenge) {
            newChallenge.dateCreated = currentDate;
            setDailyChallenge(newChallenge);
            await saveChallengeToServer(user.uid, {
              ...newChallenge,
            });
          }
        }
      }
    });
    setProgress(getProgress());
    return () => unsubscribe();
  }, []);

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
