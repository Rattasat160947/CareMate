<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { CloudLightning, Undo } from 'lucide-vue-next'
import type { Patient, TriageCategory } from '../types'

const props = defineProps<{
  patient: Patient
  initialData: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
  }
  accentColor: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (
    e: 'save',
    record: {
      systolic: number | null
      diastolic: number | null
      pulseRate: number | null
      spo2: number | null
      temperature: number | null
      triageGrade: TriageCategory
    },
  ): void
}>()

const systolic = ref(props.initialData.systolic)
const diastolic = ref(props.initialData.diastolic)
const pulseRate = ref(props.initialData.pulseRate)
const spo2 = ref(props.initialData.spo2)
const temperature = ref(props.initialData.temperature)

const handleSaveData = () => {
  emit('save', {
    systolic: systolic.value,
    diastolic: diastolic.value,
    pulseRate: pulseRate.value,
    spo2: spo2.value,
    temperature: temperature.value,
    triageGrade: 'NORMAL',
  })
}

const handleBack = () => {
  emit('back')
}

const currentTime = ref(
  new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
)
let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }, 1000)
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="max-w-3xl mx-auto w-full font-sans select-none">
    <div class="flex flex-col justify-between">
      <div class="space-y-4">
        <div
          class="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-xs gap-3 font-sans"
        >
          <div class="flex items-center gap-2">
            <p class="text-xs text-slate-500 font-mono">
              HN: <span class="text-slate-900 dark:text-white font-bold">{{ patient.hn }}</span> •
              คนไข้:
              <span class="text-slate-900 dark:text-white font-bold">{{ patient.name }}</span>
            </p>
          </div>
          <p class="text-xs text-slate-400 font-mono hidden md:block">{{ currentTime }} น.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div
            class="bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all duration-200 border-slate-200 dark:border-slate-800"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4
                  class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  ความดันโลหิต
                </h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Blood Pressure</p>
              </div>
            </div>
            <div class="my-2">
              <span
                class="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight"
              >
                <template v-if="systolic !== null && diastolic !== null">
                  {{ systolic }}<span class="text-slate-350 dark:text-slate-600 mx-1.5">/</span
                  >{{ diastolic }}
                </template>
                <template v-else>
                  <span
                    class="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight"
                    >ไม่ได้ทำการวัดความดันโลหิต</span
                  >
                </template>
              </span>
              <span
                v-if="systolic !== null && diastolic !== null"
                class="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5"
                >mmHg</span
              >
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all border-slate-200 dark:border-slate-800"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4
                  class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  อัตราการเต้นหัวใจ
                </h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Pulse Rate</p>
              </div>
            </div>
            <div class="my-2">
              <span
                class="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight"
              >
                <template v-if="pulseRate !== null">
                  {{ pulseRate }}
                </template>
                <template v-else>
                  <span
                    class="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight"
                    >ไม่ได้ทำการวัดอัตราการเต้นหัวใจ</span
                  >
                </template>
              </span>
              <span
                v-if="pulseRate !== null"
                class="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5 font-sans"
                >BPM</span
              >
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all border-slate-200 dark:border-slate-800"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4
                  class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  ออกซิเจนในเลือด
                </h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Oxygen Saturation</p>
              </div>
            </div>
            <div class="my-2">
              <span
                class="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight"
              >
                <template v-if="spo2 !== null">
                  {{ spo2 }}
                </template>
                <template v-else>
                  <span
                    class="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight"
                    >ไม่ได้ทำการวัดระดับออกซิเจน</span
                  >
                </template>
              </span>
              <span
                v-if="spo2 !== null"
                class="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5"
                >%</span
              >
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all border-slate-200 dark:border-slate-800"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4
                  class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  อุณหภูมิร่างกาย
                </h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Temperature</p>
              </div>
            </div>
            <div class="my-2">
              <span
                class="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight"
              >
                <template v-if="temperature !== null">
                  {{ temperature }}
                </template>
                <template v-else>
                  <span
                    class="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight"
                    >ไม่ได้ทำการวัดอุณหภูมิร่างกาย</span
                  >
                </template>
              </span>
              <span
                v-if="temperature !== null"
                class="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5"
                >°C</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
        <button
          id="btn-triage-back"
          @click="handleBack"
          class="sm:col-span-4 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 font-semibold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm border border-slate-200/40 dark:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Undo class="w-4 h-4" /> ย้อนกลับ (BACK)
        </button>
        <button
          id="btn-triage-save"
          @click="handleSaveData"
          class="sm:col-span-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <CloudLightning class="w-4 h-4" /> บันทึกเวชระเบียน & ส่งออก API (SAVE & SEND)
        </button>
      </div>
    </div>
  </div>
</template>
