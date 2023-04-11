import "./Button.css";

const Button: React.FC = (props: any) => {
  return (
    <button className="custom-btn" onClick={props.clicked}>
      {props.name}
    </button>
  );
};

export default Button;
