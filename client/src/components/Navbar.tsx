import "../styles/Navbar.css";
import CircleIcon from "./CircleIcon";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  titleTup: [number, string];
};

function Navbar({ titleTup }: NavbarProps) {
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
    switch (titleTup[0]) {
      case 1:
        return (
          <div onClick={toSettings}>
            <CircleIcon icon={<i className="ri-settings-2-line"></i>} />
          </div>
        );
      case 2:
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
    switch (titleTup[0]) {
      case 1:
        return (
          <div onClick={toProgress}>
            <CircleIcon icon={<i className="ri-seedling-line"></i>} />
          </div>
        );
      case 0:
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
      <h3 className="navbar-title">{titleTup[1]}</h3>
      <section className="navbar-right">{renderRightIcon()}</section>
    </nav>
  );
}

export default Navbar;
