import { RouteComponentProps, useHistory } from "react-router";
import "./SinglePagePost.css";
import {
  IonPage,
  IonImg,
  IonLoading,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase-config";
import DeletePost from "../Post/DeletePost/DeletePost";
import Spinner from "../../components/Spinner/Spinner";
import { create } from "ionicons/icons";
import updatePost from "../Post/UpdatePost/UpdatePost";

interface UserDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const SinglePagePost: React.FC<UserDetailPageProps> = (props) => {
  const inputRef = useRef(null);

  let history = useHistory();
  const id = props.match.params.id;

  const [post, setPost] = useState<any>();
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDocument = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let postFetch = docSnap.data();

        setPost(postFetch);
      } else {
        alert("No such document!");
        history.push("/");
      }
    };

    getDocument();
  }, [history, id]);

  let singlePost = <Spinner />;

  if (post) {
    singlePost = (
      <div>
        <IonImg
          src={
            post.postImg
              ? post.postImg
              : "https://ionicframework.com/docs/img/demos/card-media.png"
          }
          alt=""
        ></IonImg>
        <h1
          id="title"
          contentEditable={edit}
          suppressContentEditableWarning={true}
          ref={inputRef}
        >
          {post.title}
        </h1>
        <p
          id="content"
          contentEditable={edit}
          suppressContentEditableWarning={true}
        >
          {post.content}{" "}
        </p>
      </div>
    );
  }

  const editHandler = () => {
    setEdit(true);
    document.getElementById("edit")?.classList.remove("show");
    document.getElementById("edit")?.classList.add("hide");
  };

  const cancelHandler = () => {
    setEdit(false);
    document.getElementById("edit")?.classList.remove("hide");
    document.getElementById("edit")?.classList.add("show");
  };

  const saveHandler = async () => {
    setLoading(true);
    const title = String(document.getElementById("title")?.textContent?.trim());
    const content = String(
      document.getElementById("content")?.textContent?.trim()
    );

    await updatePost(title, content, id);

    setLoading(false);
  };

  return (
    <IonPage className="singlePostPage">
      <IonHeader collapse="fade" className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark"></IonBackButton>
          </IonButtons>

          {edit ? (
            <div slot="end">
              <IonButton
                style={{ fontSize: "14px" }}
                onClick={cancelHandler}
                color="danger"
              >
                Cancel
              </IonButton>
              <IonButton onClick={saveHandler} color="success">
                Save
              </IonButton>
            </div>
          ) : (
            <div className="del-edit-box">
              <div id="edit" onClick={editHandler}>
                <div className="edit-container">
                  <IonIcon icon={create} color="dark"></IonIcon>
                  <p style={{ margin: "0" }}>Edit</p>
                </div>
              </div>

              <DeletePost id={id} />
            </div>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => {
            alert("updated successfully");
            cancelHandler();
          }}
          message={"Updating..."}
        />

        <main className="singlePage-container">{singlePost}</main>
      </IonContent>
    </IonPage>
  );
};

export default SinglePagePost;
