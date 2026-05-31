<template>
  <div class="flex flex-col items-center justify-center gap-8 w-full p-4">
    <!-- BP Display -->
    <div
      :class="[
        'relative p-8 rounded-lg transition-all duration-300 flex flex-col justify-center items-center text-center w-full max-w-lg',
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
          <div class="field-label mb-2 text-xl font-semibold">ความดันโลหิต (SYS / DIA)</div>
          <div class="flex items-baseline justify-center gap-3">
            <span v-if="isPressureAbnormal" class="text-red-400" style="font-size: 2.5rem">⚠</span>
            <span
              class="vital-value font-bold"
              :class="isPressureAbnormal ? 'text-red-300' : 'text-emerald-300'"
              style="font-size: 5rem"
            >
              {{ currentVitals.systolic }}
            </span>
            <span style="font-size: 3rem; color: var(--c-text-dim)">/</span>
            <span
              class="vital-value font-bold"
              :class="isPressureAbnormal ? 'text-red-300' : 'text-emerald-300'"
              style="font-size: 5rem"
            >
              {{ currentVitals.diastolic }}
            </span>
            <span
              class="field-label ml-3 text-xl"
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

    <!-- HR Display -->
    <div class="w-full max-w-lg">
      <VitalCard
        title="อัตราการเต้นหัวใจ"
        :value="currentVitals.heart_rate"
        unit="BPM"
        :isAbnormal="currentVitals.heart_rate > 100 || (currentVitals.heart_rate < 60 && currentVitals.heart_rate > 0)"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-4 w-full max-w-lg mt-4">
      <button @click="$emit('cancel')" class="flex-1 py-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-xl tracking-wide transition-colors">
        กลับ
      </button>
      <button @click="onConfirm" class="flex-1 py-4 btn-clinical btn-confirm text-xl tracking-wide">
        บันทึกค่า
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import VitalCard from '@/components/VitalCard.vue'

const emit = defineEmits(['confirm', 'cancel'])

const currentVitals = ref({
  systolic: 0,
  diastolic: 0,
  heart_rate: 0
})

let mockInterval

const isPressureAbnormal = computed(
  () => currentVitals.value.systolic > 140 || currentVitals.value.diastolic > 90
)

onMounted(() => {
  mockInterval = setInterval(() => {
    currentVitals.value.systolic = 110 + Math.floor(Math.random() * 20)
    currentVitals.value.diastolic = 70 + Math.floor(Math.random() * 15)
    currentVitals.value.heart_rate = 65 + Math.floor(Math.random() * 10)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(mockInterval)
})

const onConfirm = () => {
  emit('confirm', currentVitals.value)
}
</script>
