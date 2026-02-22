<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      
      <ion-card class="summary-card">
        <ion-card-content>

          <div class="summary-box income">
            <h2>รายรับ</h2>
            <p>฿ {{ totalIncome.toLocaleString() }}</p>
          </div>

          <div class="summary-box expense">
            <h2>รายจ่าย</h2>
            <p>฿ {{ totalExpense.toLocaleString() }}</p>
          </div>

          <div class="summary-box balance">
            <h2>คงเหลือ</h2>
            <p>฿ {{ (totalIncome - totalExpense).toLocaleString() }}</p>
          </div>

        </ion-card-content>
      </ion-card>

    
      <ion-list>

        <ion-item
          v-for="item in expenses"
          :key="item.id"
          :router-link="'/tabs/tab3/'+ item.id"
          class="expense-item"
          button
          @click="goToEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }}</p>
          </ion-label>

          <div
            slot="end"
            :class="item.type === 'income' ? 'income-text' : 'expense-text'"
          >
            {{ item.type === 'income' ? '+' : '-' }}
            ฿ {{ item.amount.toLocaleString() }}
          </div>

        </ion-item>

      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/vue";

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
}

const router = useRouter();
const expenses = ref<Expense[]>([]);

onMounted(() => {
  const q = query(
    collection(db, "expenses"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, "id">),
    }));
  });
});

const goToEdit = (id: string) => {
  router.push(`/tabs/tab3/${id}`);
};

const totalIncome = computed(() =>
  expenses.value
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount), 0)
);

const totalExpense = computed(() =>
  expenses.value
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + Number(e.amount), 0)
);
</script>

<style scoped>
.summary-card {
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.summary-box {
  text-align: center;
  margin-bottom: 15px;
}

.summary-box h2 {
  font-size: 14px;
  margin: 0;
  color: #888;
}

.summary-box p {
  font-size: 20px;
  font-weight: bold;
  margin: 5px 0 0;
}

.income p {
  color: #2dd36f;
}

.expense p {
  color: #eb445a;
}

.balance p {
  color: #3880ff;
}

.expense-item {
  --border-radius: 12px;
  margin-bottom: 10px;
  --background: #f8f9fa;
}

.income-text {
  color: #2dd36f;
  font-weight: bold;
}

.expense-text {
  color: #eb445a;
  font-weight: bold;
}
</style>