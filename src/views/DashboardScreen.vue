<template>
  <div class="flex flex-col w-full gap-6">
    <!-- Header Bar -->
    <div class="med-panel flex items-center justify-between px-5 py-3">
      <div class="flex items-center gap-3">
        <!-- Live dot (only show when measuring) -->
        <span v-if="currentMeasureMode" class="w-2.5 h-2.5 rounded-full bg-emerald-400 live-indicator" />
        <span class="field-label" style="color: var(--c-cyan)">{{ headerText }}</span>
      </div>

      <div v-if="patient" class="flex items-center gap-4">
        <div class="text-right">
          <div class="field-label">ผู้ป่วย</div>
          <div class="font-semibold" style="color: var(--c-text-primary); font-size: 1rem">
            {{ patient.first_name }} {{ patient.last_name }}
          </div>
        </div>
        <div
          class="px-3 py-1 rounded"
          style="background: var(--c-navy-light); border: 1px solid var(--c-border)"
        >
          <span class="vital-value" style="font-size: 0.9rem; color: var(--c-cyan)">
            {{ patient.patient_id }}
          </span>
        </div>
      </div>
    </div>

    <!-- MAIN DASHBOARD -->
    <div v-if="!currentMeasureMode" class="flex flex-col gap-6 w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- BP & HR Card -->
        <div class="med-panel p-6 flex flex-col gap-4 rounded-lg items-center text-center cursor-pointer transition-all border border-transparent hover:border-cyan-500"
             @click="currentMeasureMode = 'bphr'" style="background: var(--c-navy-light)">
          <div class="field-label text-xl font-semibold mb-2">ความดันโลหิต & อัตราการเต้นหัวใจ</div>
          <div v-if="vitals.systolic > 0" class="text-emerald-300 font-bold" style="font-size: 2.5rem; line-height: 1.2;">
            {{ vitals.systolic }}<span style="font-size: 1.5rem">/</span>{{ vitals.diastolic }}
            <div class="text-sm font-normal" style="color: var(--c-text-dim)">mmHg</div>
            <div class="mt-2">{{ vitals.heart_rate }} <span class="text-sm font-normal" style="color: var(--c-text-dim)">BPM</span></div>
          </div>
          <div v-else class="text-gray-400 opacity-50 flex flex-col justify-center items-center h-full" style="font-size: 2.5rem; line-height: 1.2;">
            -- / --
          </div>
          <button class="mt-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg w-full text-lg mt-4">เริ่มวัด</button>
        </div>

        <!-- SpO2 Card -->
        <div class="med-panel p-6 flex flex-col gap-4 rounded-lg items-center text-center cursor-pointer transition-all border border-transparent hover:border-cyan-500"
             @click="currentMeasureMode = 'spo2'" style="background: var(--c-navy-light)">
          <div class="field-label text-xl font-semibold mb-2">ออกซิเจนในเลือด (SpO₂)</div>
          <div v-if="vitals.spo2 > 0" class="text-emerald-300 font-bold flex flex-col justify-center items-center h-full" style="font-size: 3.5rem; line-height: 1.2;">
            {{ vitals.spo2 }} <span class="text-sm font-normal" style="color: var(--c-text-dim)">%</span>
          </div>
          <div v-else class="text-gray-400 opacity-50 flex flex-col justify-center items-center h-full" style="font-size: 3.5rem; line-height: 1.2;">
            --
          </div>
          <button class="mt-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg w-full text-lg mt-4">เริ่มวัด</button>
        </div>

        <!-- Temp Card -->
        <div class="med-panel p-6 flex flex-col gap-4 rounded-lg items-center text-center cursor-pointer transition-all border border-transparent hover:border-cyan-500"
             @click="currentMeasureMode = 'temp'" style="background: var(--c-navy-light)">
          <div class="field-label text-xl font-semibold mb-2">อุณหภูมิร่างกาย</div>
          <div v-if="vitals.temperature > 0" class="text-emerald-300 font-bold flex flex-col justify-center items-center h-full" style="font-size: 3.5rem; line-height: 1.2;">
            {{ vitals.temperature }} <span class="text-sm font-normal" style="color: var(--c-text-dim)">°C</span>
          </div>
          <div v-else class="text-gray-400 opacity-50 flex flex-col justify-center items-center h-full" style="font-size: 3.5rem; line-height: 1.2;">
            --
          </div>
          <button class="mt-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg w-full text-lg mt-4">เริ่มวัด</button>
        </div>
      </div>

      <!-- Action Button -->
      <!-- Only enable if at least one measurement is taken -->
      <button
        @click="finishMeasurement"
        class="btn-clinical btn-confirm w-full py-5 text-2xl tracking-widest"
        :disabled="!hasAnyMeasurement"
        :style="{ opacity: hasAnyMeasurement ? 1 : 0.5, cursor: hasAnyMeasurement ? 'pointer' : 'not-allowed' }"
      >
        สรุปผล &amp; ถัดไป
      </button>
    </div>

    <!-- MEASUREMENT VIEWS -->
    <div v-else class="w-full grow flex flex-col items-center justify-center">
      <MeasureBpHr v-if="currentMeasureMode === 'bphr'" @confirm="onConfirmBpHr" @cancel="currentMeasureMode = null" />
      <MeasureSpo2 v-if="currentMeasureMode === 'spo2'" @confirm="onConfirmSpo2" @cancel="currentMeasureMode = null" />
      <MeasureTemp v-if="currentMeasureMode === 'temp'" @confirm="onConfirmTemp" @cancel="currentMeasureMode = null" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCareStore } from '@/stores/useCareStore'
import MeasureBpHr from '@/components/MeasureBpHr.vue'
import MeasureSpo2 from '@/components/MeasureSpo2.vue'
import MeasureTemp from '@/components/MeasureTemp.vue'

const router = useRouter()
const store = useCareStore()
const patient = store.patient

const vitals = ref({
  systolic: 0,
  diastolic: 0,
  heart_rate: 0,
  spo2: 0,
  temperature: 0,
})

const currentMeasureMode = ref(null) // null | 'bphr' | 'spo2' | 'temp'

const headerText = computed(() => {
  if (currentMeasureMode.value === 'bphr') return 'กำลังวัดความดันและส่วนสูง'
  if (currentMeasureMode.value === 'spo2') return 'กำลังวัดออกซิเจนในเลือด'
  if (currentMeasureMode.value === 'temp') return 'กำลังวัดอุณหภูมิ'
  return 'เลือกรายการที่ต้องการวัด'
})

const hasAnyMeasurement = computed(() => {
  return vitals.value.systolic > 0 || vitals.value.spo2 > 0 || vitals.value.temperature > 0
})

const onConfirmBpHr = (data) => {
  vitals.value.systolic = data.systolic
  vitals.value.diastolic = data.diastolic
  vitals.value.heart_rate = data.heart_rate
  currentMeasureMode.value = null
}

const onConfirmSpo2 = (data) => {
  vitals.value.spo2 = data.spo2
  currentMeasureMode.value = null
}

const onConfirmTemp = (data) => {
  vitals.value.temperature = data.temperature
  currentMeasureMode.value = null
}

const finishMeasurement = () => {
  if (!hasAnyMeasurement.value) return
  store.setMeasurements(vitals.value)
  router.push('/summary')
}
</script>
