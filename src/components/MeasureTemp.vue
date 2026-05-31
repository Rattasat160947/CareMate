<template>
  <div class="flex flex-col items-center justify-center gap-8 w-full p-4">
    <!-- Temp Display -->
    <div class="w-full max-w-lg">
      <VitalCard
        title="อุณหภูมิร่างกาย"
        :value="currentVitals.temperature"
        unit="°C"
        :isAbnormal="currentVitals.temperature > 37.5 || currentVitals.temperature < 36.0"
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
  temperature: 36.0
})

let mockInterval

onMounted(() => {
  mockInterval = setInterval(() => {
    currentVitals.value.temperature = +(36.2 + Math.random() * 0.5).toFixed(1)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(mockInterval)
})

const onConfirm = () => {
  emit('confirm', currentVitals.value)
}
</script>
