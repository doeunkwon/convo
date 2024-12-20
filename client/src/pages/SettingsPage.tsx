import "../styles/SettingsPage.css";
import {
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import LevelSelection from "../components/LevelSelection";
import { useState } from "react";
import { deleteUserPreference } from "../services/preferenceService";
import { deleteProgress } from "../services/progressService";
import { deleteChallenge } from "../services/challengeService";

interface SettingsPageProps {
  handleLevelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLevelSet: () => Promise<void>;
  level: number;
}

function SettingsPage({
  handleLevelChange,
  handleLevelSet,
  level,
}: SettingsPageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

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
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (!confirmDelete) return; // Exit if the user cancels

      // Prompt for re-authentication
      const credential = prompt(
        "Please enter your password to confirm deletion:"
      );
      if (!credential) return; // Exit if no password is provided

      try {
        // Ensure user.email is not null
        if (!user.email) {
          throw new Error("User email is not available.");
        }

        // Re-authenticate the userN
        const userCredential = EmailAuthProvider.credential(
          user.email,
          credential
        );
        await reauthenticateWithCredential(user, userCredential);

        // Proceed with account deletion
        await deleteUserPreference(user.uid);
        await deleteProgress(user.uid);
        await deleteChallenge(user.uid);
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
      <Button gradient={false} text="Set Level" onClick={togglePopup} />
      <Button gradient={false} text="Log Out" onClick={handleLogout} />
      <Button
        gradient={false}
        text="Delete Account"
        onClick={handleDeleteAccount}
      />
      {isOpen && (
        <LevelSelection
          togglePopup={togglePopup}
          handleLevelSet={handleLevelSet}
          handleLevelChange={handleLevelChange}
          level={level}
        />
      )}
    </main>
  );
}

export default SettingsPage;
