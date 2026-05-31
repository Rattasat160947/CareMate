<template>
  <div class="flex flex-col items-center justify-center gap-8 w-full p-4">
    <!-- SpO2 Display -->
    <div class="w-full max-w-lg">
      <VitalCard
        title="ออกซิเจนในเลือด (SpO₂)"
        :value="currentVitals.spo2"
        unit="%"
        :isAbnormal="currentVitals.spo2 > 0 && currentVitals.spo2 < 95"
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
import { ref, onMounted, onUnmounted } from 'vue'
import VitalCard from '@/components/VitalCard.vue'

const emit = defineEmits(['confirm', 'cancel'])

const currentVitals = ref({
  spo2: 0
})

let mockInterval

onMounted(() => {
  mockInterval = setInterval(() => {
    currentVitals.value.spo2 = 96 + Math.floor(Math.random() * 4)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(mockInterval)
})

const onConfirm = () => {
  emit('confirm', currentVitals.value)
}
</script>
