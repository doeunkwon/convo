import { ChangeEvent } from "react";
import "../styles/LevelSelection.css";

interface LevelSelectionProps {
  togglePopup: () => void;
  handleLevelChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLevelSet?: () => void;
  level: number;
}

function LevelSelection({
  togglePopup,
  handleLevelChange,
  handleLevelSet,
  level,
}: LevelSelectionProps) {
  return (
    <div className="level-selection-overlay" onClick={togglePopup}>
      <div
        className="level-selection-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="level-selection-popup-header">
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
            <option value="3">3. Mingler</option>
            <option value="4">4. Engager</option>
            <option value="5">5. Connector</option>
          </select>
          {handleLevelSet && (
            <button
              className="orange-button"
              onClick={() => {
                handleLevelSet();
                alert("Social level updated");
                togglePopup();
              }}
            >
              Set level
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
            <b>3. Mingler</b>
            <br />
            I’m comfortable in most social settings, happy to chat but still
            warming up to leading conversations.
          </div>
          <div>
            <b>4. Engager</b>
            <br />I feel relaxed and natural in social situations, and I often
            take the initiative to keep conversations engaging.
          </div>
          <div>
            <b>5. Connector</b>
            <br />
            I’m energized by social interactions, can navigate conversations
            with ease, and connect effortlessly with new people.
          </div>
        </section>
      </div>
    </div>
  );
}

export default LevelSelection;
