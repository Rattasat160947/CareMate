<template>
  <div
    class="w-full rounded-lg p-4"
    style="background: var(--c-navy); border: 1px solid var(--c-border)"
  >
    <div class="flex flex-col gap-2">
      <div
        v-for="(row, rowIndex) in currentKeys"
        :key="rowIndex"
        class="flex justify-center gap-1.5"
      >
        <button
          v-for="key in row"
          :key="key"
          @click="emitKey(key)"
          class="key-cap font-medium py-3 px-4 text-lg min-w-[2.8rem]"
        >
          {{ key }}
        </button>
      </div>

      <!-- Bottom row: Shift + Space + Backspace -->
      <div class="flex justify-center gap-1.5">
        <button
          @click="toggleShift"
          class="key-cap py-3 px-4 text-lg font-semibold transition-colors duration-200"
          :style="{
            color: isShifted ? 'var(--c-navy)' : 'var(--c-cyan)',
            background: isShifted ? 'var(--c-cyan)' : 'transparent',
            borderColor: isShifted ? 'var(--c-cyan)' : 'var(--c-border-dim)',
          }"
        >
          ⇧
        </button>
        <button
          @click="emitKey(' ')"
          class="key-cap font-medium py-3 px-6 text-lg grow"
          style="color: var(--c-text-dim)"
        >
          SPACE
        </button>
        <button
          @click="$emit('backspace')"
          class="key-cap py-3 px-5 text-lg font-semibold"
          style="color: var(--c-alert); border-color: rgba(239, 68, 68, 0.3)"
        >
          ⌫
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['keypress', 'backspace'])

const isShifted = ref(false)

const baseKeys = [
  ['ๅ', '/', '_', 'ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช'],
  ['ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล', 'ฃ'],
  ['ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง'],
  ['ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ'],
]

const shiftedKeys = [
  ['+', '๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘', '๙'],
  ['๐', '"', 'ฎ', 'ฑ', 'ธ', 'ํ', '๊', 'ณ', 'ฯ', 'ญ', 'ฐ', ',', 'ฅ'],
  ['ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', '.'],
  ['(', ')', 'ฉ', 'ฮ', 'ฺ', '์', '?', 'ฒ', 'ฬ', 'ฦ'],
]

const currentKeys = computed(() => (isShifted.value ? shiftedKeys : baseKeys))

const toggleShift = () => {
  isShifted.value = !isShifted.value
}

const emitKey = (key) => {
  emit('keypress', key)
  // หากพิมพ์อักษรไปแล้ว 1 ตัว ให้ยกเลิกสถานะ Shift อัตโนมัติ (เหมือนแป้นมือถือ)
  if (isShifted.value && key !== ' ') {
    isShifted.value = false
  }
}
</script>
