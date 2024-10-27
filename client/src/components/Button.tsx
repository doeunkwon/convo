import "../styles/Button.css";

type ButtonProps = {
  image?: React.ReactElement;
  gradient: boolean;
  text: string;
  onClick: () => void;
};

function Button({ image, gradient, text, onClick }: ButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {image && (
        <h3>
          <section className="button-icon">{image}</section>
        </h3>
      )}
      <h3>
        {gradient ? (
          <section className="gradient-text">{text}</section>
        ) : (
          <section>{text}</section>
        )}
      </h3>
    </button>
  );
}

export default Button;
