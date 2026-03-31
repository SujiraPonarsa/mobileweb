<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-y="false">
      <div class="wrap">

        <!-- HEADER -->
        <div class="header">
          <div class="header__info">
            <div class="header__sub">ARM WORKOUT</div>
            <div class="header__title">Lab09 Sensors</div>
          </div>
          <div class="status-pill" :class="'pill--' + (state?.status ?? 'IDLE')">
            <span class="pill-dot"></span>{{ statusLabel }}
          </div>
        </div>

        <!-- HERO COUNTER -->
        <div class="hero">
          <div class="hero__ring" :class="{ pop: isPulsing }">
            <svg class="ring-svg" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="88" fill="none"
                stroke="#1e1e1e" stroke-width="8"/>
              <circle cx="100" cy="100" r="88" fill="none"
                stroke="url(#grad)" stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="`${ringProgress} 553`"
                stroke-dashoffset="138"
                style="transition: stroke-dasharray .4s ease"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ff4500"/>
                  <stop offset="100%" stop-color="#ff8c00"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="hero__inner">
              <div class="hero__num">{{ state?.repDisplay ?? 0 }}</div>
              <div class="hero__lbl">REPS</div>
            </div>
          </div>
        </div>

        <!-- FEEDBACK -->
        <div class="feedback-zone">
          <transition name="fade">
            <div v-if="state?.stats.lastMessage"
                 class="feedback" :class="msgClass">
              {{ state.stats.lastMessage }}
            </div>
          </transition>
        </div>

        <!-- STATS ROW -->
        <div class="stats-row">
          <div class="scard">
            <div class="scard__val">{{ state?.stats.repsTotal ?? 0 }}</div>
            <div class="scard__lbl">TOTAL</div>
          </div>
          <div class="scard scard--accent">
            <div class="scard__val">{{ state?.stats.repsOk ?? 0 }}</div>
            <div class="scard__lbl">CORRECT</div>
          </div>
          <div class="scard scard--dim">
            <div class="scard__val">{{ state?.stats.repsBad ?? 0 }}</div>
            <div class="scard__lbl">WRONG</div>
          </div>
          <div class="scard">
            <div class="scard__val">{{ pctOk }}<span class="scard__unit">%</span></div>
            <div class="scard__lbl">ACCURACY</div>
          </div>
        </div>

        <!-- TEMPO BAR -->
        <div class="tempo-bar">
          <div class="tempo-bar__label">AVG TEMPO</div>
          <div class="tempo-bar__val">{{ avgSec }}<span class="tempo-bar__unit">s / rep</span></div>
        </div>

        <!-- SCORE -->
        <div class="score-row">
          <div class="score-lbl">SCORE</div>
          <div class="score-val">{{ state?.stats.score ?? 0 }}</div>
        </div>

        <!-- BUTTONS -->
        <div class="btns">
          <button class="btn-stop" :disabled="state?.status !== 'RUNNING'" @click="stop">
            STOP
          </button>
          <button class="btn-start" :disabled="state?.status === 'RUNNING'" @click="start">
            START
          </button>
        </div>

        <div class="foot">64XXXXXX · นายชื่อ นามสกุล</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { MotionService }    from "../core/MotionService";
import { TtsService }       from "../core/TtsService";
import { HapticsService }   from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state     = ref<WorkoutState | null>(null);
const isPulsing = ref(false);
const engine    = new ArmWorkoutEngine();
const motion    = new MotionService();
const tts       = new TtsService();
const haptic    = new HapticsService();
const thaiNums  = ["ศูนย์","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า","สิบ"];
let prevRepsOk  = 0;

onMounted(() => {
  engine.onChange((s) => {
    if (s.stats.repsOk > prevRepsOk) {
      prevRepsOk = s.stats.repsOk;
      tts.speak(thaiNums[s.stats.repsOk] ?? `${s.stats.repsOk}`);
      haptic.success();
      isPulsing.value = true;
      setTimeout(() => (isPulsing.value = false), 500);
    } else if (s.stats.lastMessage && s.stats.lastMessage !== "✓ ท่าถูกต้อง") {
      haptic.warning();
    }
    state.value = s;
  });
});

// วง progress ring — สูงสุด 10 รอบ = เต็มวง
const ringProgress = computed(() => {
  const reps = state.value?.repDisplay ?? 0;
  return Math.min(reps / 10, 1) * 553;
});

const statusLabel = computed(() => ({
  IDLE:"READY", RUNNING:"ACTIVE", STOPPED:"DONE", CALIBRATING:"PREP"
}[state.value?.status ?? "IDLE"] ?? "READY"));

const msgClass = computed(() => {
  const m = state.value?.stats.lastMessage ?? "";
  if (m === "✓ ท่าถูกต้อง") return "feedback--ok";
  if (m) return "feedback--warn";
  return "";
});

const avgSec = computed(() =>
  ((state.value?.stats.avgRepMs ?? 0) / 1000).toFixed(1));

const pctOk = computed(() => {
  const t = state.value?.stats.repsTotal ?? 0;
  const o = state.value?.stats.repsOk ?? 0;
  return t === 0 ? 0 : Math.round((o / t) * 100);
});

async function start() {
  prevRepsOk = 0;
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => {
    console.log("ay:", s.ay, "ax:", s.ax, "az:", s.az);
    engine.process(s);
  });
}

async function stop() {
  await motion.stop();
  engine.stop();
  await tts.speak("หยุดแล้ว");
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap');

/* ── BASE ── */
.wrap {
  min-height: 100vh;
  background: #121212;
  display: flex;
  flex-direction: column;
  font-family: 'Barlow', sans-serif;
  color: #fff;
  user-select: none;
}

/* ── HEADER ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;
}

.header__sub {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: #ff5a1f;
  margin-bottom: 2px;
}

.header__title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
}

/* ── STATUS PILL ── */
.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px;
  letter-spacing: 2px;
  padding: 5px 12px;
  border-radius: 100px;
  border: 1px solid #2a2a2a;
  color: #555;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #333;
}

.pill--RUNNING {
  border-color: rgba(255,90,31,.4);
  color: #ff5a1f;
}
.pill--RUNNING .pill-dot {
  background: #ff5a1f;
  animation: blink 1s ease infinite;
}
.pill--STOPPED { color: #facc15; border-color: rgba(250,204,21,.3); }
.pill--STOPPED .pill-dot { background: #facc15; }

@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: .3; }
}

/* ── HERO RING ── */
.hero {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

.hero__ring {
  position: relative;
  width: 210px;
  height: 210px;
  transition: transform .15s ease;
}

.hero__ring.pop { transform: scale(1.05); }

.ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.hero__inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero__num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 90px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  color: #fff;
}

.hero__lbl {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  letter-spacing: 5px;
  color: #ff5a1f;
  margin-top: -4px;
}

/* ── FEEDBACK ── */
.feedback-zone {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
}

.feedback {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px;
  letter-spacing: 1.5px;
  padding: 7px 20px;
  border-radius: 6px;
  text-transform: uppercase;
}

.feedback--ok {
  color: #4ade80;
  background: rgba(74,222,128,.08);
  border: 1px solid rgba(74,222,128,.25);
}

.feedback--warn {
  color: #ff5a1f;
  background: rgba(255,90,31,.08);
  border: 1px solid rgba(255,90,31,.3);
}

.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── STATS ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px 16px;
}

.scard {
  background: #1a1a1a;
  border: 1px solid #242424;
  border-radius: 12px;
  padding: 14px 8px;
  text-align: center;
}

.scard--accent { border-color: rgba(255,90,31,.35); }
.scard--dim    { border-color: rgba(255,60,60,.2); }

.scard__val {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.scard--accent .scard__val { color: #ff5a1f; }
.scard--dim    .scard__val { color: #f87171; }

.scard__unit { font-size: 14px; color: #444; }

.scard__lbl {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
  color: #444;
  margin-top: 4px;
}

/* ── TEMPO BAR ── */
.tempo-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a1a;
  border: 1px solid #242424;
  border-radius: 12px;
  margin: 8px 16px 0;
  padding: 14px 18px;
}

.tempo-bar__label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: #555;
}

.tempo-bar__val {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
}

.tempo-bar__unit {
  font-size: 13px;
  color: #555;
  margin-left: 4px;
}

/* ── SCORE ── */
.score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 16px 0;
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  border-radius: 12px;
  padding: 14px 20px;
}

.score-lbl {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: rgba(255,255,255,.75);
}

.score-val {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1px;
}

/* ── BUTTONS ── */
.btns {
  display: flex;
  gap: 10px;
  padding: 16px 16px 8px;
}

.btn-start, .btn-stop {
  border: none;
  border-radius: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 3px;
  cursor: pointer;
  padding: 16px 0;
  transition: opacity .15s, transform .1s;
}

.btn-start:active, .btn-stop:active { transform: scale(.97); }
.btn-start:disabled, .btn-stop:disabled { opacity: .25; }

.btn-start {
  flex: 3;
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  color: #fff;
}

.btn-stop {
  flex: 1;
  background: #1e1e1e;
  color: #555;
  border: 1px solid #2a2a2a;
}

/* ── FOOTER ── */
.foot {
  text-align: center;
  font-size: 11px;
  color: #2a2a2a;
  padding: 12px 0 20px;
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 1px;
}
</style>