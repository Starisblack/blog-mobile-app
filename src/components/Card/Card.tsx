import React from "react";
import { Link } from "react-router-dom";
import {
  IonCol,
  IonButton,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import "./Card.css";

function Card(props: any) {
  return (
    <div className="card">
      <Link className="read-more-btn" to={"/post/" + props.id}>
        <IonCard>
          <IonGrid>
            <IonRow style={{ alignItems: "center" }}>
              <IonCol size="4.5">
                <img
                  alt="Silhouette of mountains"
                  src={
                    props.postImg
                      ? props.postImg
                      : "https://ionicframework.com/docs/img/demos/card-media.png"
                  }
                />
              </IonCol>

              <IonCol size="7.5">
                <IonCardHeader>
                  <IonCardSubtitle>{props.category}</IonCardSubtitle>
                  <IonCardTitle>{props.title}</IonCardTitle>
                </IonCardHeader>

                <IonButton className="read-more-btn" fill="clear">
                  read more
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </Link>
    </div>
  );
}
export default Card;
