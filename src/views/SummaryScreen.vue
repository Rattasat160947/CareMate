<template>
  <div class="flex flex-col items-center w-full gap-6">

    <!-- Section Header -->
    <div class="w-full med-panel px-5 py-3 flex items-center gap-3">
      <div class="w-1 h-6 rounded-full" style="background: var(--c-cyan);" />
      <span class="font-semibold tracking-wider" style="color: var(--c-text-primary); font-size: 1.1rem;">
        สรุปผลการวัด
      </span>
    </div>

    <!-- Info row: Operator + Patient -->
    <div class="w-full grid grid-cols-2 gap-4">
      <div class="med-panel px-5 py-4">
        <div class="field-label mb-1">ผู้ดูแล (Operator)</div>
        <div class="font-semibold" style="font-size: 1.1rem; color: var(--c-text-primary);">
          {{ store.operatorName }}
        </div>
      </div>
      <div class="med-panel px-5 py-4" v-if="patient">
        <div class="field-label mb-1">ผู้ป่วย (Patient)</div>
        <div class="flex items-center gap-3">
          <span class="font-semibold" style="font-size: 1.1rem; color: var(--c-text-primary);">
            {{ patient.first_name }} {{ patient.last_name }}
          </span>
          <span
            class="px-2 py-0.5 rounded"
            style="background: var(--c-navy-light); font-family: var(--font-mono); font-size: 0.8rem; color: var(--c-cyan); border: 1px solid var(--c-border);"
          >
            {{ patient.patient_id }}
          </span>
        </div>
      </div>
    </div>

    <!-- Vitals grid -->
    <div class="grid grid-cols-2 gap-4 w-full">

      <!-- BP -->
      <div class="med-panel-raised p-5 flex items-center justify-between">
        <div>
          <div class="field-label mb-1">ความดันโลหิต</div>
          <div class="field-label" style="font-size: 0.6rem; color: var(--c-text-dim);">BLOOD PRESSURE</div>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="vital-value" style="font-size: 2.4rem; color: var(--c-text-primary);">
            {{ measurements.systolic }}/{{ measurements.diastolic }}
          </span>
          <span class="field-label ml-1">mmHg</span>
        </div>
      </div>

      <!-- HR -->
      <div class="med-panel-raised p-5 flex items-center justify-between">
        <div>
          <div class="field-label mb-1">อัตราการเต้นหัวใจ</div>
          <div class="field-label" style="font-size: 0.6rem; color: var(--c-text-dim);">HEART RATE</div>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="vital-value" style="font-size: 2.4rem; color: var(--c-text-primary);">
            {{ measurements.heart_rate }}
          </span>
          <span class="field-label ml-1">BPM</span>
        </div>
      </div>

      <!-- SpO2 -->
      <div class="med-panel-raised p-5 flex items-center justify-between">
        <div>
          <div class="field-label mb-1">ออกซิเจนในเลือด</div>
          <div class="field-label" style="font-size: 0.6rem; color: var(--c-text-dim);">SpO₂</div>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="vital-value" style="font-size: 2.4rem; color: var(--c-text-primary);">
            {{ measurements.spo2 }}
          </span>
          <span class="field-label ml-1">%</span>
        </div>
      </div>

      <!-- Temp -->
      <div class="med-panel-raised p-5 flex items-center justify-between">
        <div>
          <div class="field-label mb-1">อุณหภูมิร่างกาย</div>
          <div class="field-label" style="font-size: 0.6rem; color: var(--c-text-dim);">TEMPERATURE</div>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="vital-value" style="font-size: 2.4rem; color: var(--c-text-primary);">
            {{ measurements.temperature }}
          </span>
          <span class="field-label ml-1">°C</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="w-full flex gap-3">
      <button
        @click="router.push('/dashboard')"
        :disabled="isSubmitting"
        class="btn-clinical btn-secondary py-5 px-8 text-xl"
      >
        วัดใหม่
      </button>
      <button
        @click="submitData"
        :disabled="isSubmitting"
        class="btn-clinical flex-1 py-5 text-xl"
        :class="submitStatus === 'error' ? 'btn-warn' : 'btn-confirm'"
        :style="submitStatus === 'error' ? 'background: var(--c-warn); color: #000;' : ''"
      >
        {{
          isSubmitting
            ? '⟳  กำลังบันทึก...'
            : submitStatus === 'error'
              ? '⟳  ลองส่งข้อมูลอีกครั้ง'
              : 'บันทึกข้อมูล (SUBMIT)'
        }}
      </button>
    </div>

    <!-- Modal Popup -->
    <Teleport to="body">
      <div
        v-if="showPopup"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);"
      >
        <div
          class="med-panel-raised p-10 rounded-xl max-w-md w-full text-center mx-4"
          style="border: 1px solid var(--c-border);"
        >
          <template v-if="submitStatus === 'success'">
            <div style="font-size: 3.5rem; color: var(--c-normal);">✓</div>
            <h3 class="font-bold mt-4 mb-2" style="font-size: 1.8rem; color: var(--c-text-primary);">
              บันทึกสำเร็จ
            </h3>
            <p class="field-label mt-1">ข้อมูลถูกส่งเข้าระบบเรียบร้อยแล้ว</p>
          </template>
          <template v-else>
            <div style="font-size: 3.5rem; color: var(--c-alert);">⚠</div>
            <h3 class="font-bold mt-4 mb-2" style="font-size: 1.8rem; color: var(--c-alert);">
              ส่งข้อมูลล้มเหลว
            </h3>
            <p style="font-size: 0.95rem; color: var(--c-text-secondary);">
              ระบบได้พักข้อมูลไว้แล้ว สามารถกด Retry เพื่อส่งใหม่
            </p>
          </template>
          <button
            @click="closePopup"
            class="btn-clinical btn-primary mt-8 px-10 py-4 text-lg"
          >
            ตกลง
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCareStore } from '@/stores/useCareStore'

const router      = useRouter()
const store       = useCareStore()
const patient     = store.patient
const measurements = store.measurements

const isSubmitting  = ref(false)
const submitStatus  = ref('')
const showPopup     = ref(false)

const submitData = async () => {
  isSubmitting.value = true
  submitStatus.value = ''

  const payload = {
    operator_name: store.operatorName,
    patient_id:    patient?.patient_id || 'UNKNOWN',
    timestamp:     new Date().toISOString(),
    measurements,
  }

  try {
    // ห้ามลบส่วนนี้ — ใช้สำหรับจำลองการส่งข้อมูลไปยัง API จริง
    // const res = await fetch('http://backend-url.com/api/measurement', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })

    // if (!res.ok) throw new Error('API Error')

    // submitStatus.value = 'success'
    // showPopup.value = true
    // isSubmitting.value = false

    setTimeout(() => {
      if (Math.random() > 0.8) throw new Error('Mock Network Error')
      submitStatus.value = 'success'
      showPopup.value    = true
      isSubmitting.value = false
    }, 1000)
  } catch (err) {
    console.error(err)
    store.cacheSubmission(payload)
    submitStatus.value = 'error'
    showPopup.value    = true
    isSubmitting.value = false
  }
}

const closePopup = () => {
  showPopup.value = false
  if (submitStatus.value === 'success') {
    store.resetSession()
    router.push('/patient')
  }
}
</script>
