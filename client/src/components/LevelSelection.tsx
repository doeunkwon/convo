import { ChangeEvent } from "react";
import "../styles/LevelSelection.css";
import "../styles/Popup.css";

interface LevelSelectionProps {
  togglePopup: () => void;
  handleLevelChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLevelSet?: () => Promise<void>;
  level: number;
}

function LevelSelection({
  togglePopup,
  handleLevelChange,
  handleLevelSet,
  level,
}: LevelSelectionProps) {
  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <section className="popup-header">
          <h3 style={{ color: "var(--text-color)" }}>
            How comfortable are you in social situations?
          </h3>
          <p>Choose the level that feels most like you:</p>
        </section>
        <section className="level-selection-popup-picker">
          <select
            onChange={handleLevelChange}
            className="level-selection-picker"
            value={level}
          >
            <option value="1">1. Observer</option>
            <option value="2">2. Dabbler</option>
            <option value="3">3. Engager</option>
          </select>
          {handleLevelSet && (
            <button
              className="orange-button"
              onClick={async () => {
                await handleLevelSet();
                alert("Social level updated");
                togglePopup();
              }}
            >
              Save
            </button>
          )}
        </section>
        <section className="level-selection-descriptions">
          <div>
            <b>1. Observer</b>
            <br />
            Socializing feels a bit out of my comfort zone. I prefer to observe
            rather than start conversations.
          </div>
          <div>
            <b>2. Dabbler</b>
            <br />I enjoy short, casual chats but sometimes feel unsure about
            keeping conversations going.
          </div>
          <div>
            <b>3. Engager</b>
            <br />I feel relaxed and natural in social situations, and I often
            take the initiative to keep conversations engaging.
          </div>
        </section>
      </div>
    </div>
  );
}

export default LevelSelection;
