<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCareStore } from '../stores/useCareStore'

const emit = defineEmits(['next', 'back'])
const store = useCareStore()

type Status = 'IDLE' | 'MEASURING' | 'DONE'

const bpStatus = ref<Status>('IDLE')
const spo2Status = ref<Status>('IDLE')
const tempStatus = ref<Status>('IDLE')

// Mock measurement processes
const measureBP = () => {
  bpStatus.value = 'MEASURING'
  setTimeout(() => {
    store.setMeasurements({
      blood_pressure: { systolic: 120, diastolic: 80, unit: 'mmHg' },
      heart_rate: { value: 75, unit: 'bpm' },
    })
    bpStatus.value = 'DONE'
  }, 3000)
}

const measureSpo2 = () => {
  spo2Status.value = 'MEASURING'
  setTimeout(() => {
    store.setMeasurements({
      spo2: { value: 98, unit: '%' },
    })
    spo2Status.value = 'DONE'
  }, 2000)
}

const measureTemp = () => {
  tempStatus.value = 'MEASURING'
  setTimeout(() => {
    store.setMeasurements({
      temperature: { value: 36.5, unit: '°C' },
    })
    tempStatus.value = 'DONE'
  }, 1500)
}

const allDone = computed(
  () => bpStatus.value === 'DONE' && spo2Status.value === 'DONE' && tempStatus.value === 'DONE',
)

const patientName = computed(() => store.patient?.patient_name || 'ไม่ระบุ')
</script>

<template>
  <div class="w-full flex flex-col items-center gap-6 h-full pb-4">
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-2 shrink-0">
      <button @click="emit('back')" class="btn-clinical btn-secondary px-8 py-4 text-xl rounded-xl">
        กลับ
      </button>
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-800">ศูนย์กลางการวัดค่า (Measurement Hub)</h2>
        <p class="text-xl text-[color:var(--c-text-dim)] font-medium mt-1">
          ผู้ป่วย: {{ patientName }}
        </p>
      </div>
      <div class="px-8 py-4 opacity-0 pointer-events-none">กลับ</div>
      <!-- Spacer -->
    </div>

    <!-- 3 Big Cards -->
    <div class="flex-1 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1: BP & HR -->
      <div
        :class="[
          'rounded-3xl p-6 flex flex-col justify-between border-4 transition-all',
          bpStatus === 'DONE'
            ? 'bg-[#d1fae5] border-[#10b981]'
            : bpStatus === 'MEASURING'
              ? 'bg-sky-50 border-sky-400 animate-pulse'
              : 'bg-white border-slate-200',
        ]"
      >
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-2">ความดันโลหิตและชีพจร</h3>
          <p class="text-lg text-slate-500 mb-6">Blood Pressure & Heart Rate</p>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <template v-if="bpStatus === 'IDLE'">
            <div
              class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"
            >
              <span class="text-5xl">❤️</span>
            </div>
            <p class="text-2xl text-slate-400 font-bold">ยังไม่ได้วัด</p>
          </template>

          <template v-else-if="bpStatus === 'MEASURING'">
            <div class="text-6xl animate-bounce mb-4">🩺</div>
            <p class="text-3xl text-sky-600 font-bold">กำลังวัด...</p>
          </template>

          <template v-else>
            <div class="text-5xl font-mono font-bold text-teal-700 mb-2">
              {{ store.measurements.blood_pressure.systolic }}/{{
                store.measurements.blood_pressure.diastolic
              }}
              <span class="text-2xl text-teal-600 ml-1">mmHg</span>
            </div>
            <div class="text-4xl font-mono font-bold text-rose-500 mt-4">
              {{ store.measurements.heart_rate.value }}
              <span class="text-2xl text-rose-400 ml-1">bpm</span>
            </div>
          </template>
        </div>

        <button
          v-if="bpStatus !== 'MEASURING'"
          @click="measureBP"
          :class="[
            'w-full py-5 text-2xl font-bold rounded-2xl mt-6',
            bpStatus === 'DONE' ? 'bg-teal-600 text-white' : 'bg-[#0d9488] text-white',
          ]"
        >
          {{ bpStatus === 'DONE' ? 'วัดใหม่อีกครั้ง' : 'เริ่มวัด' }}
        </button>
      </div>

      <!-- Card 2: SpO2 -->
      <div
        :class="[
          'rounded-3xl p-6 flex flex-col justify-between border-4 transition-all',
          spo2Status === 'DONE'
            ? 'bg-[#d1fae5] border-[#10b981]'
            : spo2Status === 'MEASURING'
              ? 'bg-amber-50 border-amber-400 animate-pulse'
              : 'bg-white border-slate-200',
        ]"
      >
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-2">ออกซิเจนในเลือด</h3>
          <p class="text-lg text-slate-500 mb-6">SpO2</p>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <template v-if="spo2Status === 'IDLE'">
            <div
              class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"
            >
              <span class="text-5xl">🩸</span>
            </div>
            <p class="text-2xl text-slate-400 font-bold">ยังไม่ได้วัด</p>
          </template>

          <template v-else-if="spo2Status === 'MEASURING'">
            <div class="text-6xl animate-bounce mb-4">🩸</div>
            <p class="text-3xl text-amber-600 font-bold">กำลังวัด...</p>
          </template>

          <template v-else>
            <div class="text-[5rem] font-mono font-bold text-teal-700 leading-none">
              {{ store.measurements.spo2.value }}
              <span class="text-4xl text-teal-600">%</span>
            </div>
          </template>
        </div>

        <button
          v-if="spo2Status !== 'MEASURING'"
          @click="measureSpo2"
          :class="[
            'w-full py-5 text-2xl font-bold rounded-2xl mt-6',
            spo2Status === 'DONE' ? 'bg-teal-600 text-white' : 'bg-[#0d9488] text-white',
          ]"
        >
          {{ spo2Status === 'DONE' ? 'วัดใหม่อีกครั้ง' : 'เริ่มวัด' }}
        </button>
      </div>

      <!-- Card 3: Temperature -->
      <div
        :class="[
          'rounded-3xl p-6 flex flex-col justify-between border-4 transition-all',
          tempStatus === 'DONE'
            ? 'bg-[#d1fae5] border-[#10b981]'
            : tempStatus === 'MEASURING'
              ? 'bg-purple-50 border-purple-400 animate-pulse'
              : 'bg-white border-slate-200',
        ]"
      >
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-2">อุณหภูมิร่างกาย</h3>
          <p class="text-lg text-slate-500 mb-6">Temperature</p>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <template v-if="tempStatus === 'IDLE'">
            <div
              class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"
            >
              <span class="text-5xl">🌡️</span>
            </div>
            <p class="text-2xl text-slate-400 font-bold">ยังไม่ได้วัด</p>
          </template>

          <template v-else-if="tempStatus === 'MEASURING'">
            <div class="text-6xl animate-bounce mb-4">🌡️</div>
            <p class="text-3xl text-purple-600 font-bold">กำลังวัด...</p>
          </template>

          <template v-else>
            <div class="text-[5rem] font-mono font-bold text-teal-700 leading-none">
              {{ store.measurements.temperature.value }}
              <span class="text-4xl text-teal-600">°C</span>
            </div>
          </template>
        </div>

        <button
          v-if="tempStatus !== 'MEASURING'"
          @click="measureTemp"
          :class="[
            'w-full py-5 text-2xl font-bold rounded-2xl mt-6',
            tempStatus === 'DONE' ? 'bg-teal-600 text-white' : 'bg-[#0d9488] text-white',
          ]"
        >
          {{ tempStatus === 'DONE' ? 'วัดใหม่อีกครั้ง' : 'เริ่มวัด' }}
        </button>
      </div>
    </div>

    <!-- Final Submit Action -->
    <div class="w-full max-w-6xl mt-4 shrink-0">
      <button
        @click="emit('next')"
        :disabled="!allDone"
        class="w-full py-6 text-3xl font-bold rounded-2xl transition-all shadow-xl"
        :class="
          allDone
            ? 'bg-[#10b981] text-white hover:bg-emerald-600 shadow-emerald-500/40'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed hidden'
        "
      >
        สรุปผลและส่งข้อมูล
      </button>
      <div
        v-if="!allDone"
        class="w-full py-6 text-2xl font-bold rounded-2xl bg-slate-200 text-slate-500 text-center border-2 border-dashed border-slate-300"
      >
        กรุณาวัดค่าให้ครบทั้ง 3 รายการ
      </div>
    </div>
  </div>
</template>
