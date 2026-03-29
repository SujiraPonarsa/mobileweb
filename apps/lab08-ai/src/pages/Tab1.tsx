import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import GeminiVisionApp from "../components/GeminiVision";

export default function Tab1() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gemini Vision</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={true}>
        <GeminiVisionApp />
      </IonContent>
    </IonPage>
  );
}