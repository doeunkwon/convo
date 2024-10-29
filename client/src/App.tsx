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
import { Progress } from "./models/progress";
import SettingsPage from "./pages/SettingsPage";
import PrivateRoute from "./components/PrivateRoute";
import { setupChallenge } from "./services/challengeService";
import { setupProgress, toggleCompletion } from "./services/progressService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { calculateDaysPassed } from "./utils/calculateDaysPassed";
import { today } from "./constants";
import {
  setupPreference,
  updateUserPreference,
} from "./services/preferenceService";
import { Preference } from "./models/preference";

function AppContent() {
  const location = useLocation();
  const [preference, setPreference] = useState<Preference>({ level: 1 });
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "No title available",
    task: "No task available",
    tip: "No tip available",
    dateCreated: "",
  });
  const [progress, setProgress] = useState<Progress>({
    currentStreak: 0,
    longestStreak: 0,
    history: [],
    dateUpdated: today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
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

  const handleToggleCompletion = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      toggleCompletion(progress, setProgress, user);
    }
  };

  const completed = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.metadata.creationTime) {
      return progress.history[calculateDaysPassed(user.metadata.creationTime)];
    }
    return false;
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevel = event.target.value;
    setPreference({ level: Number(selectedLevel) });
  };

  const handleLevelSet = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      updateUserPreference(user.uid, preference);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.metadata.creationTime) {
        await setupPreference(user.uid, setPreference);
        await setupChallenge(user.uid, setDailyChallenge);
        await setupProgress(user, setProgress);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="App">
      <section className="App-content">
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <Navbar title={getNavbarTitle()} />
        )}
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route
            path="/signup"
            element={
              <SignUpPage
                handleLevelChange={handleLevelChange}
                setPreference={setPreference}
                level={preference.level}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage
                  handleLevelChange={handleLevelChange}
                  handleLevelSet={handleLevelSet}
                  level={preference.level}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/daily"
            element={
              <PrivateRoute>
                <DailyPage
                  dailyChallenge={dailyChallenge}
                  handleToggleCompletion={handleToggleCompletion}
                  completed={completed()}
                />
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
