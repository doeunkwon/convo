import "../styles/SettingsPage.css";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";

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
      <Button gradient={false} text="Set Level" onClick={togglePopup} />
      <Button gradient={false} text="Log Out" onClick={handleLogout} />
      <Button
        gradient={false}
        text="Delete Account"
        onClick={handleDeleteAccount}
      />
      {isOpen && (
        <div className="settings-overlay" onClick={togglePopup}>
          <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
            <section className="settings-popup-header">
              <h3 style={{ color: "var(--text-color)" }}>
                How comfortable are you in social situations?
              </h3>
              <p>Choose the level that feels most like you:</p>
            </section>
            <section className="settings-descriptions">
              <div>
                <b>1. Beginner</b>
                <br />
                Socializing feels a bit out of my comfort zone. I prefer to
                observe rather than start conversations.
              </div>
              <div>
                <b>2. Casual Connector</b>
                <br />I enjoy short, casual chats but sometimes feel unsure
                about keeping conversations going.
              </div>
              <div>
                <b>3. Social Starter</b>
                <br />
                I’m comfortable in most social settings, happy to chat but still
                warming up to leading conversations.
              </div>
              <div>
                <b>4. Skilled Conversationalist</b>
                <br />I feel relaxed and natural in social situations, and I
                often take the initiative to keep conversations engaging.
              </div>
              <div>
                <b>5. Social Pro</b>
                <br />
                I’m energized by social interactions, can navigate conversations
                with ease, and connect effortlessly with new people.
              </div>
            </section>
            <section className="settings-popup-picker">
              <select
                onChange={handleLevelChange}
                className="settings-level-picker"
                value={level}
              >
                <option value="1">1. Beginner</option>
                <option value="2">2. Casual Connector</option>
                <option value="3">3. Social Starter</option>
                <option value="4">4. Skilled Conversationalist</option>
                <option value="5">5. Social Pro</option>
              </select>
              <button className="orange-button">Set level</button>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}

export default SettingsPage;
