<template>
  <div
    class="rounded-lg p-4 inline-block w-72"
    style="background: var(--c-navy); border: 1px solid var(--c-border);"
  >
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="num in [1,2,3,4,5,6,7,8,9]"
        :key="num"
        @click="$emit('keypress', String(num))"
        class="key-cap font-bold py-5 text-2xl"
      >
        {{ num }}
      </button>

      <!-- P- prefix shortcut -->
      <button
        @click="$emit('keypress', 'P-')"
        class="key-cap py-5 text-base font-bold"
        style="color: var(--c-cyan); border-color: rgba(0,200,224,0.3);"
      >
        P-
      </button>

      <!-- 0 -->
      <button
        @click="$emit('keypress', '0')"
        class="key-cap font-bold py-5 text-2xl"
      >
        0
      </button>

      <!-- Backspace -->
      <button
        @click="$emit('backspace')"
        class="key-cap py-5 text-xl font-bold"
        style="color: var(--c-alert); border-color: rgba(239,68,68,0.3);"
      >
        ⌫
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['keypress', 'backspace'])
</script>
