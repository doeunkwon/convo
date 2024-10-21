import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Daily from "./pages/Daily";
import Progress from "./pages/Progress";
import Navbar from "./components/Navbar";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <main className="App">
      <section className="App-content">
        <Navbar
          onClickSparkling={() => navigate("/")}
          onClickPulse={() => navigate("/progress")}
          title={getNavbarTitle()}
        />
        <Routes>
          <Route path="/" element={<Daily />} />
          <Route path="/progress" element={<Progress />} />
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
