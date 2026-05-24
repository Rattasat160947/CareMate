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
          <div class="field-label" style="font-size: 0.6rem;">VITAL SIGNS SYSTEM</div>
        </div>
      </div>

      <!-- Status pill -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded"
        style="background: var(--c-panel); border: 1px solid var(--c-border);"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 live-indicator" />
        <span class="field-label" style="color: #34d399; font-size: 0.65rem;">SYSTEM ONLINE</span>
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

    <!-- Footer -->
    <div class="mt-4 field-label" style="font-size: 0.6rem; opacity: 0.3;">
      CareMate Medical Systems · Confidential Patient Data
    </div>

  </div>
</template>
