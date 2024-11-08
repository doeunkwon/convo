import { ChangeEvent } from "react";
import "../styles/LevelSelection.css";
import "../styles/Popup.css";

interface NotificationSelectionProps {
  togglePopup: () => void;
  handleNotificationsChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSetReminders: () => void;
  notifications: boolean;
}

function NotificationSelection({
  togglePopup,
  handleNotificationsChange,
  notifications,
  handleSetReminders,
}: NotificationSelectionProps) {
  //   const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
  //     const isChecked = event.target.checked;
  //     console.log("Notifications opt-in:", isChecked);
  //     // You can add additional logic here to handle the opt-in state
  //   };

  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: "var(--text-color)" }}>
          Would you like to receive daily email reminders?
        </h3>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--xsmall-gap)",
          }}
        >
          <input
            type="checkbox"
            onChange={handleNotificationsChange}
            checked={notifications || false}
          />
          <p style={{ fontSize: "var(--xsmall-font-size)" }}>
            You may opt out at any time.
          </p>
        </label>
        <button
          className="orange-button"
          onClick={() => {
            togglePopup();
            handleSetReminders();
          }}
        >
          Set reminders
        </button>
      </div>
    </div>
  );
}

export default NotificationSelection;
