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

function AppContent() {
  const location = useLocation();
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
    if (user && user.metadata.creationTime) {
      toggleCompletion(progress, setProgress, user.metadata.creationTime);
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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.metadata.creationTime) {
        await setupChallenge(user.uid, setDailyChallenge);
        await setupProgress(user.uid, setProgress);
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
