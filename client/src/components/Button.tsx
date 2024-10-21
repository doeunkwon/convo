import "../styles/Button.css";

type ButtonProps = {
  image: React.ReactElement;
  text: string;
  onClick: () => void;
};

function Button({ image, text, onClick }: ButtonProps) {
  return (
    <main className="button" onClick={onClick}>
      <h3>
        <section className="button-icon">{image}</section>
      </h3>
      <h3>
        <section className="gradient-text">{text}</section>
      </h3>
    </main>
  );
}

export default Button;
