<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <div style="padding: 10px 15px;">
        <p>โดย สุจิรา พลอาษา รหัส 663380408-1</p>
      </div>

      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="addNewToGallery()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'; 
import { 
  IonPage, IonHeader, IonFab, IonFabButton, 
  IonIcon, IonToolbar, IonTitle, IonContent,
  
  IonGrid, IonRow, IonCol, IonImg 
} from '@ionic/vue';
import { camera } from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/usePhotoGallery';


const { photos, addNewToGallery, loadSaved } = usePhotoGallery();


onMounted(() => {
  loadSaved();
});
</script>