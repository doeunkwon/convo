import "../styles/Navbar.css";
import CircleIcon from "./CircleIcon";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  title: string;
};

function Navbar({ title }: NavbarProps) {
  const navigate = useNavigate();

  const toSettings = () => {
    navigate("/settings");
  };

  const toDaily = () => {
    navigate("/daily");
  };

  const toProgress = () => {
    navigate("/progress");
  };

  const renderLeftIcon = () => {
    switch (title) {
      case "Daily":
        return (
          <div onClick={toSettings}>
            <CircleIcon icon={<i className="ri-settings-2-line"></i>} />
          </div>
        );
      case "Progress":
        return (
          <div onClick={toDaily}>
            <CircleIcon icon={<i className="ri-arrow-left-line"></i>} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderRightIcon = () => {
    switch (title) {
      case "Daily":
        return (
          <div onClick={toProgress}>
            <CircleIcon icon={<i className="ri-pie-chart-line"></i>} />
          </div>
        );
      case "Settings":
        return (
          <div onClick={toDaily}>
            <CircleIcon icon={<i className="ri-arrow-right-line"></i>} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <section className="navbar-left">{renderLeftIcon()}</section>
      <h3 className="navbar-title">{title}</h3>
      <section className="navbar-right">{renderRightIcon()}</section>
    </nav>
  );
}

export default Navbar;
