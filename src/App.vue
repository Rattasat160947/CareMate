<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-6 scanline"
    style="background: var(--c-navy);"
  >

    <!-- Top Header Bar -->
    <div
      class="w-full max-w-4xl flex items-center justify-between mb-5 px-1"
    >
      <!-- Logo / System name -->
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded flex items-center justify-center text-lg font-bold"
          style="background: var(--c-cyan); color: var(--c-navy);"
        >+</div>
        <div>
          <div
            class="font-bold tracking-widest"
            style="font-family: var(--font-ui); font-size: 1.1rem; color: var(--c-text-primary); letter-spacing: 0.12em;"
          >
            CAREMATE MONITOR
          </div>
        </div>
      </div>

    </div>

    <!-- Main Content Card -->
    <div
      class="w-full max-w-4xl p-8 rounded-xl"
      style="
        background: var(--c-panel);
        border: 1px solid var(--c-border);
        box-shadow: 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
      "
    >
      <RouterView />
    </div>
  </div>
</template>
