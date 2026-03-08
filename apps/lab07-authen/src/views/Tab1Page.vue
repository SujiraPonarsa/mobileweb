<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAvatar,
} from "@ionic/vue";

import { authService } from "@/auth/auth-service";
import type { AuthUser } from "@/auth/auth-interface";

const user = ref<AuthUser | null>(null);
const router = useRouter();

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.push("/login");
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="user">

        <!-- ✅ รูปโปรไฟล์ -->
        <div style="display:flex;justify-content:center;margin-bottom:20px;">
          <ion-avatar style="width:120px;height:120px;">
            <!-- ถ้ามีรูปจาก Google -->
            <img
              v-if="user.photoUrl"
              :src="user.photoUrl"
            />

            <!-- ถ้าไม่มีรูป ใช้ avatar auto -->
            <img
              v-else
              :src="`https://ui-avatars.com/api/?name=${user.displayName || 'User'}`"
            />
          </ion-avatar>
        </div>

        <ion-card>
          <ion-card-header>
            <ion-card-title>User Information</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p><strong>UID:</strong> {{ user.uid }}</p>
            <p><strong>Email:</strong> {{ user.email || '-' }}</p>
            <p><strong>Phone:</strong> {{ user.phoneNumber || '-' }}</p>
            <p><strong>Name:</strong> {{ user.displayName || '-' }}</p>
          </ion-card-content>
        </ion-card>

        <ion-button
          expand="block"
          color="danger"
          class="ion-margin-top"
          @click="logout"
        >
          LOGOUT
        </ion-button>

      </div>

      <div v-else>
        Loading user data...
      </div>

    </ion-content>
  </ion-page>
</template>