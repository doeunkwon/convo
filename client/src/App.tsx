import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DailyPage from "./pages/DailyPage";
import ProgressPage from "./pages/ProgressPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage"; // Import the SignInPage
import Navbar from "./components/Navbar";
import { useState, useEffect, useRef } from "react";
import { Challenge } from "./models/challenge";
import { Progress } from "./models/progress";
import SettingsPage from "./pages/SettingsPage";
import PrivateRoute from "./components/PrivateRoute";
import { setupChallenge } from "./services/challengeService";
import { setupProgress, toggleCompletion } from "./services/progressService";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { calculateDaysPassed } from "./utils/calculateDaysPassed";
import { today } from "./constants";
import {
  setupPreference,
  updateUserPreference,
} from "./services/preferenceService";
import { Preference } from "./models/preference";

function AppContent() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate); // Store navigate in a ref
  const location = useLocation();
  const unsubscribeRef = useRef<Unsubscribe>(() => {}); // Use a ref for unsubscribe
  const [preference, setPreference] = useState<Preference>({ level: 1 });
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "No title available",
    task: "No task available",
    tip: "No tip available",
    dateCreated: "",
    level: 1,
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

  const getNavbarTitle = (): [number, string] => {
    switch (location.pathname) {
      case "/daily":
        return [1, "Today"];
      case "/progress":
        return [2, "Progress"];
      case "/settings":
        return [0, "Settings"];
      default:
        return [1, `Social Level ${preference.level}`];
    }
  };

  const handleToggleCompletion = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await toggleCompletion(progress, setProgress, user);
      navigate("/progress");
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

  const handleLevelSet = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await updateUserPreference(user.uid, preference);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeFunc = onAuthStateChanged(auth, async (user) => {
      if (user && user.metadata.creationTime) {
        console.log(
          "Fetching and setting user data (This should NOT happen on sign up)"
        );
        await setupPreference(user.uid, setPreference);
        await setupChallenge(user.uid, setDailyChallenge, preference.level);
        await setupProgress(user, setProgress);
        navigateRef.current("/daily"); // Use the ref to navigate
      }
    });

    unsubscribeRef.current = unsubscribeFunc;

    return () => unsubscribeRef.current();
  }, []);

  return (
    <main className="App">
      <section className="App-content">
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <Navbar titleTup={getNavbarTitle()} />
        )}
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route
            path="/signup"
            element={
              <SignUpPage
                setPreference={setPreference}
                setDailyChallenge={setDailyChallenge}
                setProgress={setProgress}
                unsubscribe={unsubscribeRef.current}
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
