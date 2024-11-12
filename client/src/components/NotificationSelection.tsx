import { ChangeEvent, useState } from "react";
import "../styles/LevelSelection.css";
import "../styles/Popup.css";
import "../styles/NotificationsSelection.css";

interface NotificationSelectionProps {
  togglePopup: () => void;
  handleSetReminders: (notifications: boolean) => void;
  notifications: boolean;
}

function NotificationSelection({
  togglePopup,
  notifications,
  handleSetReminders,
}: NotificationSelectionProps) {
  const [localNotifications, setLocalNotifications] =
    useState<boolean>(notifications);

  const handleNotificationsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalNotifications(event.target.checked);
  };

  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <section className="popup-header">
          <h3 style={{ color: "var(--text-color)" }}>
            Receive reminders to complete your challenge?
          </h3>
          <p style={{ fontSize: "var(--sp-size)" }}>
            Users are <b>83%</b> more likely to complete their challenge when
            they receive email reminders.
          </p>
        </section>
        <section className="checkbox-status">
          <input
            type="checkbox"
            onChange={handleNotificationsChange}
            checked={localNotifications || false}
            className="checkbox"
          />
          <p
            style={{
              fontSize: "var(--sp-size)",
              color: localNotifications
                ? "var(--green-color)"
                : "var(--red-color)",
            }}
          >
            {localNotifications ? "Enabled" : "Disabled"}
          </p>
        </section>
        <button
          className="orange-button"
          onClick={() => {
            handleSetReminders(localNotifications);
            togglePopup();
          }}
        >
          Set Reminders
        </button>
      </div>
    </div>
  );
}

export default NotificationSelection;
