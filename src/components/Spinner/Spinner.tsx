import { IonSpinner } from "@ionic/react";
import "./Spinner.css";

const Spinner: React.FC = () => {
  return (
    <div className="spinner-box">
 
      <IonSpinner name="bubbles" />
    </div>
  );
};

export default Spinner;
