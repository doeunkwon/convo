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
import { daysPerWeek, today, weeks } from "./constants";
import {
  setupPreference,
  updateUserPreference,
} from "./services/preferenceService";
import { Preference } from "./models/preference";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const unsubscribeRef = useRef<Unsubscribe>(() => {});
  const navigateRef = useRef(navigate); // Store navigate in a ref

  // Update the ref value whenever navigate changes
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const [preference, setPreference] = useState<Preference>({
    level: 1,
    notifications: false,
  });
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    title: "Loading title...  ",
    task: "Loading task...",
    tip: "Loading tip...",
    dateCreated: "",
    level: 1,
  });
  const [progress, setProgress] = useState<Progress>({
    currentStreak: 0,
    longestStreak: 0,
    history: Array.from({ length: weeks * daysPerWeek }, () => 0.0),
    dateUpdated: today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  });
  const levelRef = useRef(preference.level);

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
      await toggleCompletion(progress, setProgress, user, preference.level);
      navigate("/progress");
    }
  };

  const completed = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.metadata.creationTime) {
      return progress.history[calculateDaysPassed(user.metadata.creationTime)];
    }
    return 0.0;
  };

  const handleLevelSet = async (level: number) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setPreference({ ...preference, level });
      await updateUserPreference(user.uid, { ...preference, level });
      await setupChallenge(setDailyChallenge, level);
    }
  };

  const handleSetReminders = async (notifications: boolean) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setPreference({ ...preference, notifications });
      await updateUserPreference(user.uid, {
        ...preference,
        notifications,
      });
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeFunc = onAuthStateChanged(auth, async (user) => {
      if (user && user.metadata.creationTime) {
        console.log(
          "Fetching and setting user data (This should NOT happen on sign up)"
        );
        const preference = await setupPreference(user.uid, setPreference);
        if (preference) {
          levelRef.current = preference.level;
        } else {
          console.log("No preference found, setting default level to 1");
          levelRef.current = 1;
        }
        await setupChallenge(setDailyChallenge, levelRef.current);
        await setupProgress(user, setProgress);

        // Use the navigate function from the ref
        navigateRef.current("/daily");
      }
    });

    unsubscribeRef.current = unsubscribeFunc;

    return () => unsubscribeRef.current();
  }, []); // No need to include navigate in the dependency array

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
                  handleSetLevel={handleLevelSet}
                  level={preference.level}
                  notifications={preference.notifications}
                  handleSetReminders={handleSetReminders}
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
