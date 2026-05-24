<template>
  <div class="flex flex-col items-center w-full gap-6">

    <!-- Section Header -->
    <div class="w-full med-panel px-5 py-3 flex items-center gap-3">
      <div class="w-1 h-6 rounded-full" style="background: var(--c-cyan);" />
      <span class="font-semibold tracking-wider" style="color: var(--c-text-primary); font-size: 1.1rem;">
        ลงทะเบียนผู้ดูแล
      </span>
      <span class="field-label ml-auto">OPERATOR REGISTRATION</span>
    </div>

    <!-- Input -->
    <div class="w-full">
      <div class="field-label mb-2">ชื่อ-นามสกุลผู้ดูแล</div>
      <input
        type="text"
        v-model="name"
        class="med-input"
        placeholder="— ยังไม่ได้ระบุ —"
        readonly
      />
    </div>

    <!-- Keyboard -->
    <VirtualKeyboard @keypress="handleKeypress" @backspace="handleBackspace" />

    <!-- Button -->
    <div class="w-full mt-4">
      <button
        @click="nextScreen"
        :disabled="!name"
        class="btn-clinical btn-primary w-full py-5 text-xl"
      >
        ถัดไป →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCareStore } from '@/stores/useCareStore'
import VirtualKeyboard from '@/components/VirtualKeyboard.vue'

const router = useRouter()
const store  = useCareStore()
const name   = ref(store.operatorName || '')

const handleKeypress  = (key) => { name.value += key }
const handleBackspace = ()    => { name.value = name.value.slice(0, -1) }

const nextScreen = () => {
  store.setOperatorName(name.value)
  router.push('/patient')
}
</script>
