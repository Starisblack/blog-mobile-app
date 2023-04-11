import "./UpdatePost.css";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import db from "../../../firebase-config";

const updatePost = (title: string, content: string, id: string) => {
  const update = async () => {
    const postDocRef = doc(db, "posts", id);
    try {
      await updateDoc(postDocRef, {
        title: title,
        content: content,
        created: Timestamp.now(),
      });
    } catch (err) {
      alert(err);
    }
  };

  return update();
};

export default updatePost;
