import { ChangeEvent } from "react";
import "../styles/LevelSelection.css";
import "../styles/Popup.css";
import "../styles/NotificationsSelection.css";

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
  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <section className="popup-header">
          <h3 style={{ color: "var(--text-color)" }}>
            Receive email reminders?
          </h3>
          <p style={{ fontSize: "var(--sp-size)" }}>
            Users are <b>93%</b> more likely to complete their challenge when
            they receive reminders.
          </p>
        </section>
        <input
          type="checkbox"
          onChange={handleNotificationsChange}
          checked={notifications || false}
          className="checkbox"
        />
        <button
          className="orange-button"
          onClick={() => {
            handleSetReminders();
            alert("Reminders set");
            togglePopup();
          }}
        >
          Set reminders
        </button>
      </div>
    </div>
  );
}

export default NotificationSelection;
