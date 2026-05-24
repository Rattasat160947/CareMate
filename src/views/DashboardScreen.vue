<template>
  <div class="flex flex-col w-full gap-6">
    <!-- Header Bar -->
    <div class="med-panel flex items-center justify-between px-5 py-3">
      <div class="flex items-center gap-3">
        <!-- Live dot -->
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 live-indicator" />
        <span class="field-label" style="color: var(--c-cyan)">กำลังวัดสัญญาณชีพ</span>
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

    <!-- Main Vitals Grid -->
    <div class="grid grid-cols-2 gap-4 w-full">
      <!-- Blood Pressure -->
      <div
        :class="[
          'relative p-6 rounded-lg transition-all duration-300 flex flex-col justify-center items-center text-center',
          isPressureAbnormal ? 'status-alert' : 'status-normal',
        ]"
        :style="{
          background: isPressureAbnormal ? 'var(--c-alert-bg)' : 'var(--c-normal-bg)',
          border: isPressureAbnormal
            ? '1px solid rgba(239,68,68,0.6)'
            : '1px solid rgba(16,185,129,0.3)',
        }"
      >
        <div class="flex flex-col items-center justify-center w-full">
          <div>
            <div class="field-label mb-2 font-semibold">ความดันโลหิต (SYS / DIA)</div>
            <div class="flex items-baseline justify-center gap-3">
              <span v-if="isPressureAbnormal" class="text-red-400" style="font-size: 2rem">⚠</span>
              <span
                class="vital-value font-bold"
                :class="isPressureAbnormal ? 'text-red-300' : 'text-emerald-300'"
                style="font-size: 4rem"
              >
                {{ vitals.systolic }}
              </span>
              <span style="font-size: 2.5rem; color: var(--c-text-dim)">/</span>
              <span
                class="vital-value font-bold"
                :class="isPressureAbnormal ? 'text-red-300' : 'text-emerald-300'"
                style="font-size: 4rem"
              >
                {{ vitals.diastolic }}
              </span>
              <span
                class="field-label ml-2 font-normal"
                :style="{ color: isPressureAbnormal ? '#f87171' : '#34d399' }"
                >mmHg</span
              >
            </div>
          </div>
        </div>
        <div
          :class="[
            'absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg',
            isPressureAbnormal ? 'bg-red-500' : 'bg-emerald-500',
          ]"
        />
      </div>

      <!-- Heart Rate -->
      <VitalCard
        title="อัตราการเต้นหัวใจ"
        :value="vitals.heart_rate"
        unit="BPM"
        :isAbnormal="vitals.heart_rate > 100 || (vitals.heart_rate < 60 && vitals.heart_rate > 0)"
      />

      <!-- SpO2 -->
      <VitalCard
        title="ออกซิเจนในเลือด (SpO₂)"
        :value="vitals.spo2"
        unit="%"
        :isAbnormal="vitals.spo2 < 95 && vitals.spo2 > 0"
      />

      <!-- Temperature -->
      <VitalCard
        title="อุณหภูมิร่างกาย"
        :value="vitals.temperature"
        unit="°C"
        :isAbnormal="vitals.temperature > 37.5 || vitals.temperature < 36.0"
      />
    </div>

    <!-- Action Button -->
    <button
      @click="finishMeasurement"
      class="btn-clinical btn-confirm w-full py-5 text-2xl tracking-widest"
    >
      สรุปผล &amp; หยุดวัด
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCareStore } from '@/stores/useCareStore'
import VitalCard from '@/components/VitalCard.vue'

const router = useRouter()
const store = useCareStore()
const patient = store.patient

const vitals = ref({
  systolic: 0,
  diastolic: 0,
  heart_rate: 0,
  spo2: 0,
  temperature: 36.0,
})

const currentTime = ref('')
const currentDate = ref('')

let mockInterval
let clockInterval

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  currentDate.value = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)

  mockInterval = setInterval(() => {
    vitals.value.systolic = 110 + Math.floor(Math.random() * 20)
    vitals.value.diastolic = 70 + Math.floor(Math.random() * 15)
    vitals.value.heart_rate = 65 + Math.floor(Math.random() * 10)
    vitals.value.spo2 = 96 + Math.floor(Math.random() * 4)
    vitals.value.temperature = +(36.2 + Math.random() * 0.5).toFixed(1)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(mockInterval)
  clearInterval(clockInterval)
})

const isPressureAbnormal = computed(
  () => vitals.value.systolic > 140 || vitals.value.diastolic > 90,
)

const finishMeasurement = () => {
  store.setMeasurements(vitals.value)
  router.push('/summary')
}
</script>
