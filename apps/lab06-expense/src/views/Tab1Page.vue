<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col>

            <ion-input
              label="ชื่อรายการ"
              label-placement="floating"
              fill="outline"
              v-model="title"
              class="ion-margin-bottom"
            ></ion-input>

            <ion-input
              label="จำนวนเงิน"
              label-placement="floating"
              fill="outline"
              type="number"
              v-model="amount"
              class="ion-margin-bottom"
            ></ion-input>

            <ion-select
              label="ประเภท"
              label-placement="floating"
              fill="outline"
              v-model="type"
              class="ion-margin-bottom"
            >
              <ion-select-option value="income">รายรับ</ion-select-option>
              <ion-select-option value="expense">รายจ่าย</ion-select-option>
            </ion-select>

            <ion-input
              label="หมวดหมู่"
              label-placement="floating"
              fill="outline"
              v-model="category"
              class="ion-margin-bottom"
            ></ion-input>

            <ion-textarea
              label="หมายเหตุ"
              label-placement="floating"
              fill="outline"
              v-model="note"
              class="ion-margin-bottom"
            ></ion-textarea>

            <ion-button
              expand="block"
              color="primary"
              @click="saveExpense"
            >
              บันทึกข้อมูล
            </ion-button>

          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-loading
        :is-open="isLoading"
        message="กำลังบันทึกข้อมูล..."
      ></ion-loading>

      <ion-alert
        :is-open="isError"
        header="เกิดข้อผิดพลาด"
        :message="errorMessage"
        @didDismiss="isError = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonLoading,
  IonAlert,
} from "@ionic/vue";

const router = useRouter();

const title = ref("");
const amount = ref("");
const type = ref("expense");
const category = ref("");
const note = ref("");

const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref("");

const saveExpense = async () => {
  const parsedAmount = Number(amount.value);

  if (
    title.value.trim() === "" ||
    amount.value === "" ||
    isNaN(parsedAmount) ||
    parsedAmount <= 0
  ) {
    isError.value = true;
    errorMessage.value =
      "กรุณากรอกชื่อรายการและจำนวนเงินให้ถูกต้อง";
    return;
  }

  isLoading.value = true;

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value.trim(),
      amount: parsedAmount,
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date(),
    });

    title.value = "";
    amount.value = "";
    category.value = "";
    note.value = "";

    router.push("/tabs/tab1"); 

  } catch (error: any) {
    isError.value = true;
    errorMessage.value =
      error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
ion-input,
ion-select,
ion-textarea {
  --background: #f5f5f5;
  --border-radius: 8px;
}

ion-button {
  --border-radius: 8px;
}
</style>