<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Activity, Battery, HeartHandshake, History, Volume2, VolumeX, Wifi } from 'lucide-vue-next'

import ExaminerSelector from './components/ExaminerSelector.vue'
import HistoryLogs from './components/HistoryLogs.vue'
import MeasurementSteps from './components/MeasurementSteps.vue'
import PatientSelector from './components/PatientSelector.vue'
import ReceiptScreen from './components/ReceiptScreen.vue'
import TriageDashboard from './components/TriageDashboard.vue'

import { initialHistory, mockPatients } from './data/patients'
import { playTapSound, setAudioEnabled } from './utils/audio'
import type { Examiner, Patient, StepperState, TriageCategory, VitalRecord } from './types'

const activeTab = ref<'triage' | 'history'>('triage')
const theme = ref<'light' | 'dark'>('light')
const audioFeedback = ref(true)
const records = ref<VitalRecord[]>(Array.isArray(initialHistory) ? [...initialHistory] : [])

const stepper = ref<StepperState>({
  currentStep: 'examiner',
  activeExaminer: null,
  activePatient: null,
  systolic: null,
  diastolic: null,
  pulseRate: null,
  spo2: null,
  temperature: null,
})

const currentTime = ref('')
let timer: number

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

onMounted(() => {
  records.value = initialHistory || []
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  window.clearInterval(timer)
})

watch(
  theme,
  (newTheme) => {
    const root = window.document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  },
  { immediate: true },
)

const handleSelectExaminer = (examiner: Examiner) => {
  stepper.value.activeExaminer = examiner
  stepper.value.currentStep = 'patient'
}

const handleSelectPatient = (patient: Patient) => {
  stepper.value.activePatient = patient
  stepper.value.currentStep = 'blood_pressure'
}

const handleFinishMeasurements = (vitals: {
  systolic: number | null
  diastolic: number | null
  pulseRate: number | null
  spo2: number | null
  temperature: number | null
}) => {
  stepper.value.systolic = vitals.systolic
  stepper.value.diastolic = vitals.diastolic
  stepper.value.pulseRate = vitals.pulseRate
  stepper.value.spo2 = vitals.spo2
  stepper.value.temperature = vitals.temperature
  stepper.value.currentStep = 'summary'
}

const handleCancelMeasurements = () => {
  stepper.value.currentStep = 'patient'
  stepper.value.activePatient = null
  stepper.value.systolic = null
  stepper.value.diastolic = null
  stepper.value.pulseRate = null
  stepper.value.spo2 = null
  stepper.value.temperature = null
}

const handleSaveAndTransmit = (recordData: {
  systolic: number | null
  diastolic: number | null
  pulseRate: number | null
  spo2: number | null
  temperature: number | null
  triageGrade: TriageCategory
}) => {
  if (!stepper.value.activePatient) return

  const newRecord: VitalRecord = {
    id: `rec-${Math.floor(Math.random() * 90000) + 10000}`,
    patientId: stepper.value.activePatient.id,
    patientName: stepper.value.activePatient.name,
    examinerName: stepper.value.activeExaminer?.name || 'อสม. ยังไม่ได้ระบุในระบบ',
    timestamp: new Date().toISOString(),
    systolic: recordData.systolic,
    diastolic: recordData.diastolic,
    pulseRate: recordData.pulseRate,
    spo2: recordData.spo2,
    temperature: recordData.temperature,
    triageGrade: recordData.triageGrade,
    notes:
      recordData.triageGrade === 'ALERT'
        ? 'พบภาวะชีพจรสุ่มเสี่ยงสูง ส่งเรื่องรายงานแพทย์ รพ.สต. เพื่อดูแลใกล้ชิด'
        : recordData.triageGrade === 'WARNING'
          ? 'เฝ้าระวังอาการชั่วคราว นัดติดตามใน 15 นาที'
          : 'ร่างกายแข็งแรง ชีพจรสมดุลดี',
    isSynced: true,
  }

  records.value = [newRecord, ...records.value]
  stepper.value.currentStep = 'receipt'
}

const handleFinishReceiptFlow = () => {
  stepper.value.currentStep = 'patient'
  stepper.value.activePatient = null
  stepper.value.systolic = null
  stepper.value.diastolic = null
  stepper.value.pulseRate = null
  stepper.value.spo2 = null
  stepper.value.temperature = null
}

const handleStartNewMeasurement = (patientId: string, patientName: string) => {
  let patient = mockPatients.find((item) => item.id === patientId)
  if (!patient) {
    patient = {
      id: patientId,
      hn: patientId.replace('rec-', '').slice(0, 6),
      name: patientName,
      age: 50,
      gender: 'ชาย',
      villageNo: 'หมู่ 2',
    }
  }

  stepper.value.activePatient = patient || null
  stepper.value.currentStep = 'blood_pressure'
  stepper.value.systolic = null
  stepper.value.diastolic = null
  stepper.value.pulseRate = null
  stepper.value.spo2 = null
  stepper.value.temperature = null
  activeTab.value = 'triage'
}

const handleClearAllLogs = () => {
  records.value = []
}

const handleTabSwitch = (tab: 'triage' | 'history') => {
  playTapSound()
  activeTab.value = tab
}

const toggleSettingsAudio = () => {
  playTapSound()
  const nextVal = !audioFeedback.value
  audioFeedback.value = nextVal
  setAudioEnabled(nextVal)
}
</script>

<template>
  <div
    :class="[
      'min-h-screen transition-all duration-300 flex flex-col justify-between',
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900',
    ]"
  >
    <header
      class="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-sm shadow-sky-400/20"
        >
          <HeartHandshake class="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1
            class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none"
          >
            ระบบตรวจคัดกรอง อสม. Smart Monitor <span>TH</span>
          </h1>
          <p class="text-[10px] text-slate-400 mt-1 font-sans">
            โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) บ้านดอนกลาง • เขตภาคเหนือที่ 1
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4 text-xs select-none">
        <div class="flex items-center gap-1 text-emerald-500">
          <Wifi class="w-4 h-4" />
          <span class="font-semibold text-[10px] tracking-wider font-mono">5G CONNECTED</span>
        </div>
        <div class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Battery class="w-4.5 h-4.5" />
          <span class="font-bold text-[10px] font-mono">100%</span>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-800" />
        <button
          id="btn-quick-sound-toggle"
          @click="toggleSettingsAudio"
          :title="
            audioFeedback ? 'กดเพื่อปิดเสียงปิ๊บสัมผัสปุ่ม' : 'กดเพื่อเปิดเสียงปิ๊บสัมผัสปุ่ม'
          "
          class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          <Volume2 v-if="audioFeedback" class="w-4 h-4 text-sky-500" />
          <VolumeX v-else class="w-4 h-4 text-slate-400" />
        </button>
        <div
          class="bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold text-slate-750 dark:text-slate-300"
        >
          {{ currentTime || '--:--:--' }}
        </div>
      </div>
    </header>

    <main class="grow max-w-7xl w-full mx-auto px-6 py-6 transition-all duration-300">
      <div
        class="flex gap-2.5 mb-7 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-850 shadow-xs max-w-sm mx-auto select-none"
      >
        <button
          id="tab-triage-station"
          @click="handleTabSwitch('triage')"
          :class="[
            'flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer',
            activeTab === 'triage'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-950/40',
          ]"
        >
          <Activity class="w-4 h-4" />
          ทำการตรวจวัด
        </button>
        <button
          id="tab-history-logs"
          @click="handleTabSwitch('history')"
          :class="[
            'flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer',
            activeTab === 'history'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-950/40',
          ]"
        >
          <History class="w-4 h-4" />
          รายการตรวจทั้งหมด
        </button>
      </div>

      <div class="animate-fade-in duration-300">
        <template v-if="activeTab === 'triage'">
          <ExaminerSelector
            v-if="stepper.currentStep === 'examiner'"
            @select="handleSelectExaminer"
            accentColor="bg-sky-500"
          />

          <PatientSelector
            v-if="stepper.currentStep === 'patient'"
            @select="handleSelectPatient"
            :activeExaminerName="stepper.activeExaminer?.name"
            @back="
              () => {
                playTapSound()
                stepper.currentStep = 'examiner'
                stepper.activePatient = null
              }
            "
            accentColor="bg-sky-500"
          />

          <MeasurementSteps
            v-if="
              (stepper.currentStep === 'blood_pressure' ||
                stepper.currentStep === 'spo2' ||
                stepper.currentStep === 'temperature') &&
              stepper.activePatient
            "
            :patient="stepper.activePatient"
            @cancel="handleCancelMeasurements"
            @completed="handleFinishMeasurements"
            accentColor="sky"
          />

          <TriageDashboard
            v-if="stepper.currentStep === 'summary' && stepper.activePatient"
            :patient="stepper.activePatient"
            :initialData="{
              systolic: stepper.systolic,
              diastolic: stepper.diastolic,
              pulseRate: stepper.pulseRate,
              spo2: stepper.spo2,
              temperature: stepper.temperature,
            }"
            @back="handleCancelMeasurements"
            @save="handleSaveAndTransmit"
            accentColor="sky"
          />

          <ReceiptScreen
            v-if="stepper.currentStep === 'receipt' && stepper.activePatient"
            :patient="stepper.activePatient"
            :record="records[0]"
            @done="handleFinishReceiptFlow"
          />
        </template>

        <template v-if="activeTab === 'history'">
          <HistoryLogs
            :logs="records"
            @startNewMeasurement="handleStartNewMeasurement"
            @clearAllLogs="handleClearAllLogs"
            accentColor="sky"
          />
        </template>
      </div>
    </main>
  </div>
</template>
