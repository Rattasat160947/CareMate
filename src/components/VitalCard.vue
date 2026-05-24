<template>
  <div
    :class="[
      'relative flex flex-col p-6 rounded-lg transition-all duration-300',
      isAbnormal
        ? 'border border-red-500/60 status-alert'
        : 'border border-emerald-500/30 status-normal',
    ]"
    :style="{
      background: isAbnormal ? 'var(--c-alert-bg)' : 'var(--c-normal-bg)',
    }"
  >
    <!-- Label row -->
    <div class="flex items-center justify-between mb-3">
      <span class="field-label">{{ title }}</span>
      <span
        :class="[
          'w-2 h-2 rounded-full',
          isAbnormal ? 'bg-red-400 live-indicator' : 'bg-emerald-400 live-indicator',
        ]"
      />
    </div>

    <!-- Value -->
    <div class="flex items-baseline gap-2 mt-1">
      <!-- Alert icon -->
      <span
        v-if="isAbnormal"
        class="text-red-400 vital-value"
        style="font-size: 2rem;"
      >⚠</span>

      <span
        class="vital-value"
        :class="isAbnormal ? 'text-red-300' : 'text-emerald-300'"
        style="font-size: 3.5rem;"
      >{{ value }}</span>

      <span
        class="field-label ml-1"
        :style="{ color: isAbnormal ? '#f87171' : '#34d399' }"
      >{{ unit }}</span>
    </div>

    <!-- Status bar -->
    <div
      :class="[
        'absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg',
        isAbnormal ? 'bg-red-500' : 'bg-emerald-500',
      ]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  unit: String,
  isAbnormal: {
    type: Boolean,
    default: false,
  },
})
</script>
