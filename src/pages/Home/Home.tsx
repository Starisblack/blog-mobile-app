import { useState, useEffect } from "react";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { Link } from "react-router-dom";
import "./Home.css";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "../../firebase-config";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner/Spinner";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [posts, setPosts] = useState<any>([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      setLoading(false);
    });
  }, []);

  const searchInput = (e: any) => {
    let userInput = e.target.value;

    setUserInput(userInput);
  };

  const searchHandler = (posts: any) => {
    return posts.filter((post: any) =>
      post.data.title.toLowerCase().includes(userInput.toLowerCase())
    );
  };

  let fetchPosts: any = null;

  if (posts) {
    fetchPosts = searchHandler(posts).map((post: any) => {
      return (
        <Card
          key={post.id}
          id={post.id}
          title={post.data.title}
          content={post.data.content}
          category={post.data.category}
          postImg={post.data.postImg}
        />
      );
    });
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <main className="home">
          <IonTitle>Blogs</IonTitle>

          <IonSearchbar
            onIonChange={searchInput}
            placeholder="Search Blogs by Title"
          ></IonSearchbar>

          {loading ? <Spinner /> : fetchPosts}
        </main>
      </IonContent>

      <Link to="/post">
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </Link>
    </IonPage>
  );
};

export default Home;
