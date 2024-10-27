import "../styles/SettingsPage.css";
import {
  signOut,
  deleteUser,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import {
  setupPreference,
  updateUserPreference,
} from "../services/preferenceService";
import { Preference } from "../models/preference";

function SettingsPage() {
  const navigate = useNavigate();

  const [preference, setPreference] = useState<Preference>({ level: 1 });

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
      if (user) {
        await setupPreference(user.uid, setPreference);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="settings-page">
      <h3>Social Skill Level</h3>
      <select
        onChange={handleLevelChange}
        className="settings-level-picker"
        value={preference.level}
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
