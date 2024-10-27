import "../styles/SettingsPage.css";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface SettingsPageProps {
  handleLevelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLevelSet: () => void;
  level: number;
}

function SettingsPage({
  handleLevelChange,
  handleLevelSet,
  level,
}: SettingsPageProps) {
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
      // Add confirmation dialog
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (!confirmDelete) return; // Exit if the user cancels

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
      <p>Social Skill Level</p>
      <select
        onChange={handleLevelChange}
        className="settings-level-picker"
        value={level}
      >
        <option value="">Select a level</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <Button gradient={false} text="Set level" onClick={handleLevelSet} />
      <div className="settings-divider" />
      <Button gradient={false} text="Log out" onClick={handleLogout} />
      <Button
        gradient={false}
        text="Delete account"
        onClick={handleDeleteAccount}
      />
    </main>
  );
}

export default SettingsPage;
