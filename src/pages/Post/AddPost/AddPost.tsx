import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonInput,
  IonItem,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonLoading,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import "./AddPost.css";
import db from "../../../firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useHistory } from "react-router";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../firebase-config";

const Post: React.FC = () => {
  let history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState();

  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  const onInput = (ev: any) => {
    const name = ev.target.name;

    setPost((prevValue: any) => {
      return {
        ...prevValue,
        [name]: ev.target.value,
      };
    });
  };

  const uploadImage = (file: any) => {
    const storage = getStorage(app);

    /** @type {any} */
    const metadata: any = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let postData = {
            title: post.title,
            content: post.content,
            category: post.category,
            created: Timestamp.now(),
            postImg: downloadURL,
          };

          createPost(postData);
        });
      }
    );
  };

  const createPost = async (postData: any) => {
    try {
      await addDoc(collection(db, "posts"), {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        created: postData.created,
        postImg: postData.postImg,
      });

      setLoading(false);
      history.push("/");
    } catch (e) {
      alert("Error adding document: " + e);
    }
  };

  const handleClick = (event: { preventDefault: () => void }) => {
    setLoading(true);
    event.preventDefault();

    uploadImage(image);
  };

  const fileHandler = async (e: any) => {
    const img = e.target.files[0];
    setImage(img);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Create a Post</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"> App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main>
          <IonLoading
            cssClass="my-custom-class"
            isOpen={loading}
            onDidDismiss={() => {
              alert("published");
            }}
            message={"Publishing..."}
          />

          <form onSubmit={handleClick} className="was-validated ">
            <IonItem>
              <IonSelect
                onIonChange={onInput}
                name="category"
                placeholder="Select category"
              >
                <IonSelectOption value="General">General</IonSelectOption>
                <IonSelectOption value="Business">Business</IonSelectOption>
                <IonSelectOption value="Technology">Technology</IonSelectOption>
                <IonSelectOption value="Lifestyle">Lifestyle</IonSelectOption>
                <IonSelectOption value="Fashion">Fashion</IonSelectOption>
                <IonSelectOption value="Beauty">Beauty</IonSelectOption>
                <IonSelectOption value="Science">Science</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                onIonInput={onInput}
                type="text"
                placeholder="Title"
                name="title"
                required
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonTextarea
                autoGrow={true}
                onIonInput={onInput}
                name="content"
                placeholder="Post Content"
                required
              ></IonTextarea>
            </IonItem>

            <IonItem>
              <input type="file" onChange={fileHandler} />
            </IonItem>

            <IonButton id="publish" type="submit" expand="block">
              {" "}
              {loading ? (
                <IonSpinner name="dots" color="light" />
              ) : (
                "Publish"
              )}{" "}
            </IonButton>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Post;
