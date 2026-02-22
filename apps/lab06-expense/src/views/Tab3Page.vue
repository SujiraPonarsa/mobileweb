<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab2"></ion-back-button>
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input label="ชื่อรายการ" label-placement="floating" v-model="expense.title"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input label="จำนวนเงิน" label-placement="floating" type="number" v-model="expense.amount"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-select label="ประเภท" v-model="expense.type">
            <ion-select-option value="income">รายรับ</ion-select-option>
            <ion-select-option value="expense">รายจ่าย</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-input label="หมวดหมู่" label-placement="floating" v-model="expense.category"></ion-input>
        </ion-item>

        <ion-item>
          <ion-textarea label="หมายเหตุ" label-placement="floating" v-model="expense.note"></ion-textarea>
        </ion-item>
      </ion-list>

      <div class="ion-margin-top">
        <ion-button expand="block" @click="updateExpense">อัปเดตข้อมูล</ion-button>
        
        <ion-button expand="block" color="danger" fill="outline" @click="confirmDelete">
          ลบรายการนี้
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase';

import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, 
  IonSelect, IonSelectOption, IonButton, IonList, IonItem, 
  IonButtons, IonBackButton, IonTextarea, alertController 
} from '@ionic/vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const expense = ref({
  title: '',
  amount: 0,
  type: 'expense',
  category: '',
  note: ''
});

onMounted(async () => {
  if (id) {
    const docRef = doc(db, "expenses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      expense.value = docSnap.data() as any;
    }
  }
});

const updateExpense = async () => {
  try {
    const docRef = doc(db, "expenses", id);
    await updateDoc(docRef, {
      title: expense.value.title,
      amount: Number(expense.value.amount),
      type: expense.value.type,
      category: expense.value.category,
      note: expense.value.note
    });
    router.push('/tabs/tab2');
  } catch (error) {
    console.error("Error updating document:", error);
  }
};


const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? ข้อมูลจะถูกลบถาวร',
    buttons: [
      {
        text: 'ยกเลิก',
        role: 'cancel'
      },
      {
        text: 'ลบ',
        role: 'destructive',
        handler: async () => {
          try {
            
            await deleteDoc(doc(db, "expenses", id));
            
            router.push('/tabs/tab2');
          } catch (error) {
            console.error("Error deleting document:", error);
          }
        }
      }
    ]
  });

  await alert.present();
};
</script>