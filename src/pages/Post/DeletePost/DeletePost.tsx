import { useIonAlert } from "@ionic/react";
import { trash } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { doc, deleteDoc } from "firebase/firestore";
import "./DeletePost.css";

import db from "../../../firebase-config";
import { useHistory } from "react-router";

function DeletePost(props: any) {
  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const handleDelete = () => {
    const deletePost = async () => {
      const postDocRef = doc(db, "posts", props.id);
      try {
        await deleteDoc(postDocRef);

        history.push("/");
      } catch (err) {
        alert(err);
      }
    };

    presentAlert({
      header: "delete the post?",
      cssClass: "custom-alert",
      buttons: [
        {
          text: "No",
          cssClass: "alert-button-cancel",
        },
        {
          text: "Yes",
          cssClass: "alert-button-confirm",
          handler: deletePost,
        },
      ],
    });
  };
  return (
    <div onClick={handleDelete} className="del-container">
      <IonIcon slot="end" icon={trash} color="danger"></IonIcon>
      <p style={{ margin: "0" }}>Delete</p>
    </div>
  );
}
export default DeletePost;
