import "../styles/SettingsPage.css";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/"); // Redirect to the home or login page after sign out
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteUser(user);
        console.log("User account deleted");
        navigate("/"); // Redirect to the home or login page after account deletion
      } catch (error: any) {
        console.error("Error deleting account:", error.message);
        // Handle re-authentication if needed
      }
    } else {
      console.error("No user is currently signed in.");
    }
  };

  return (
    <main className="settings-page">
      <button onClick={handleLogout} className="settings-logout-button">
        <p style={{ color: "var(--text-color)" }}>Log out</p>
      </button>
      <button onClick={handleDeleteAccount} className="settings-logout-button">
        <p style={{ color: "var(--text-color)" }}>Delete account</p>
      </button>
    </main>
  );
}

export default SettingsPage;
