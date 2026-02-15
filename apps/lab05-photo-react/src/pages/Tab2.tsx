import { camera } from 'ionicons/icons';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonFab, 
  IonFabButton, 
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  // ดึง photos และ addNewToGallery มาใช้งาน
  const { photos, addNewToGallery } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-left">
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Photo Gallery</div>
            <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>
              Lab 05 - โดย สุจิรา พลอาษา รหัส 663380408-1
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* --- ส่วนการแสดงผลแบบ Grid --- */}
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" size-md="4" key={index}>
                <IonImg 
                  src={photo.webviewPath} 
                  style={{ borderRadius: '8px', border: '1px solid #ddd' }} 
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* ปุ่มถ่ายรูป */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;