import "../styles/Navbar.css";
import CircleIcon from "./CircleIcon";

type NavbarProps = {
  onClickSparkling: () => void;
  onClickPulse: () => void;
  title: string;
};

function Navbar({ onClickSparkling, onClickPulse, title }: NavbarProps) {
  return (
    <nav className="navbar">
      <section className="navbar-left">
        {title === "Progress" ? (
          <div onClick={onClickSparkling}>
            <CircleIcon icon={<i className="ri-sparkling-line" />} />
          </div>
        ) : (
          <CircleIcon icon={<i className="ri-settings-2-line"></i>} />
        )}
      </section>
      <h3 className="navbar-title">{title}</h3>
      <section className="navbar-right">
        {title === "Daily" && (
          <div onClick={onClickPulse}>
            <CircleIcon icon={<i className="ri-pulse-fill"></i>} />
          </div>
        )}
      </section>
    </nav>
  );
}

export default Navbar;
