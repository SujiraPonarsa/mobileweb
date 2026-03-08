<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  IonIcon,
} from "@ionic/vue";
import { mailOutline, logoGoogle, phonePortraitOutline } from "ionicons/icons";

import { authService } from "@/auth/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");
const phone = ref("");
const otp = ref("");
const verificationId = ref<string | null>(null);

// ✅ Google Login
const handleLoginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.push("/tabs/tab1");
  } catch (error) {
    console.error("Google Login Error:", error);
  }
};

// ✅ Email Login (แก้ตรงนี้)
const handleLoginEmail = async () => {
  if (!email.value || !password.value) return;

  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });

    router.push("/tabs/tab1");
  } catch (error) {
    console.error("Email Login Error:", error);
  }
};

// ✅ Send OTP
const handleSendOtp = async () => {
  if (!phone.value) return;

  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });

    verificationId.value = result.verificationId;
    alert("OTP Sent!");
  } catch (error) {
    console.error("Send OTP Error:", error);
  }
};

// ✅ Confirm OTP
const handleConfirmOtp = async () => {
  if (!otp.value || !verificationId.value) return;

  try {
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otp.value,
    });

    router.push("/tabs/tab1");
  } catch (error) {
    console.error("OTP Confirm Error:", error);
  }
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title class="ion-text-center">
              Welcome
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list lines="none">
              <ion-item class="custom-input">
                <ion-input
                  v-model="email"
                  label="Email"
                  label-placement="floating"
                  type="email"
                  clear-input
                />
              </ion-item>

              <ion-item class="custom-input">
                <ion-input
                  v-model="password"
                  label="Password"
                  label-placement="floating"
                  type="password"
                  clear-input
                />
              </ion-item>
            </ion-list>

            <ion-button
              expand="block"
              class="ion-margin-top"
              @click="handleLoginEmail"
            >
              <ion-icon slot="start" :icon="mailOutline" />
              Login with Email
            </ion-button>

            <div class="separator"><span>OR</span></div>

            <ion-button
              expand="block"
              color="danger"
              fill="outline"
              @click="handleLoginGoogle"
            >
              <ion-icon slot="start" :icon="logoGoogle" />
              Login with Google
            </ion-button>

            <div class="separator"><span>OTP Login</span></div>

            <ion-item class="custom-input">
              <ion-input
                v-model="phone"
                label="Phone Number"
                label-placement="floating"
                placeholder="+66812345678"
                type="tel"
                clear-input
              />
            </ion-item>

            <ion-button
              expand="block"
              color="success"
              class="ion-margin-top"
              @click="handleSendOtp"
            >
              <ion-icon slot="start" :icon="phonePortraitOutline" />
              Send OTP
            </ion-button>

            <!-- แสดงช่องกรอก OTP หลังส่งแล้ว -->
            <ion-item
              v-if="verificationId"
              class="custom-input ion-margin-top"
            >
              <ion-input
                v-model="otp"
                label="Enter OTP"
                label-placement="floating"
                type="text"
                clear-input
              />
            </ion-item>

            <ion-button
              v-if="verificationId"
              expand="block"
              color="primary"
              class="ion-margin-top"
              @click="handleConfirmOtp"
            >
              Confirm OTP
            </ion-button>

            <div id="recaptcha-container" class="ion-margin-top"></div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 20px;
}

.custom-input {
  margin-bottom: 10px;
  --background: #f9f9f9;
  --border-radius: 8px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 25px 0;
  color: #888;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.separator span {
  padding: 0 10px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>