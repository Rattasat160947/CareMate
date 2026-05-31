<template>
  <div class="flex flex-col items-center w-full gap-6">

    <!-- Section Header -->
    <div class="w-full med-panel px-5 py-3 flex items-center gap-3">
      <div class="w-1 h-6 rounded-full" style="background: var(--c-cyan);" />
      <span class="font-semibold tracking-wider" style="color: var(--c-text-primary); font-size: 1.1rem;">
        ค้นหาข้อมูลผู้ป่วย
      </span>
    </div>

    <!-- Main content: numpad + patient panel -->
    <div class="flex w-full gap-6">

      <!-- Left: Numpad + ID input -->
      <div class="flex flex-col items-center gap-4" style="min-width: 280px;">
        <div class="w-full">
          <div class="field-label mb-2">รหัสผู้ป่วย (Patient ID)</div>
          <input
            type="text"
            v-model="patientId"
            class="med-input"
            placeholder="— — — — —"
            readonly
          />
        </div>

        <VirtualNumpad @keypress="handleKeypress" @backspace="handleBackspace" />

        <button
          @click="fetchPatient"
          :disabled="!patientId || isLoading"
          class="btn-clinical w-full py-4 text-lg"
          style="background: var(--c-cyan-dim); color: #fff;"
        >
          {{ isLoading ? '⟳  กำลังค้นหา...' : 'ค้นหา' }}
        </button>
      </div>

      <!-- Right: Patient info card -->
      <div class="flex-1 med-panel-raised rounded-lg p-6 flex flex-col justify-center">
        <template v-if="patientData">
          <div class="field-label mb-4" style="color: var(--c-cyan);">ข้อมูลผู้ป่วย</div>
          <div class="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div class="field-label mb-1">รหัสผู้ป่วย</div>
              <div class="vital-value" style="font-size: 1.4rem; color: var(--c-cyan);">
                {{ patientData.patient_id }}
              </div>
            </div>
            <div>
              <div class="field-label mb-1">อายุ</div>
              <div class="vital-value" style="font-size: 1.4rem; color: var(--c-text-primary);">
                {{ patientData.age }} ปี
              </div>
            </div>
            <div>
              <div class="field-label mb-1">ชื่อ-นามสกุล</div>
              <div style="font-size: 1.2rem; font-weight: 600; color: var(--c-text-primary);">
                {{ patientData.first_name }} {{ patientData.last_name }}
              </div>
            </div>
            <div>
              <div class="field-label mb-1">เพศ</div>
              <div style="font-size: 1.2rem; color: var(--c-text-primary);">
                {{ patientData.gender }}
              </div>
            </div>
          </div>

          <!-- Confirm strip -->
          <div
            class="mt-6 px-4 py-2 rounded flex items-center gap-2"
            style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3);"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400" />
            <span style="font-size: 0.85rem; color: #34d399;">พบข้อมูลผู้ป่วยแล้ว — กด ยืนยัน เพื่อเริ่มวัด</span>
          </div>
        </template>

        <template v-else-if="error">
          <div class="flex flex-col items-center justify-center h-full gap-3">
            <span style="font-size: 2.5rem; color: var(--c-alert);">⚠</span>
            <span style="font-size: 1.1rem; font-weight: 600; color: var(--c-alert);">{{ error }}</span>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <span style="font-size: 3rem;">🔍</span>
            <span style="font-size: 0.95rem; color: var(--c-text-secondary);">
              ระบุรหัสผู้ป่วยและกดค้นหา
            </span>
          </div>
        </template>
      </div>
    </div>

    <!-- Nav Buttons -->
    <div class="w-full flex gap-3">
      <button
        @click="router.push('/')"
        class="btn-clinical btn-secondary py-5 px-8 text-xl"
      >
        ← ย้อนกลับ
      </button>
      <button
        @click="startMeasurement"
        :disabled="!patientData"
        class="btn-clinical btn-confirm flex-1 py-5 text-xl"
      >
        ยืนยัน &amp; เริ่มวัด
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCareStore } from '@/stores/useCareStore'
import VirtualNumpad from '@/components/VirtualNumpad.vue'

const router     = useRouter()
const store      = useCareStore()
const patientId  = ref('')
const patientData = ref(null)
const isLoading  = ref(false)
const error      = ref('')

const handleKeypress  = (key) => { patientId.value += key }
const handleBackspace = ()    => { patientId.value = patientId.value.slice(0, -1) }

const fetchPatient = async () => {
  isLoading.value  = true
  error.value      = ''
  patientData.value = null

  try {
    // ห้ามลบส่วนนี้ — ใช้สำหรับจำลองการดึง API จริง
    // const res = await fetch(`http://backend-url.com/api/patient/${patientId.value}`)
    // if (!res.ok) throw new Error('ไม่พบข้อมูล')

    // patientData.value = await res.json()
    // isLoading.value = false
    setTimeout(() => {
      if (patientId.value === 'P-10023' || patientId.value === '10023') {
        patientData.value = {
          patient_id: 'P-10023',
          first_name: 'สมชาย',
          last_name:  'ใจดี',
          age:        65,
          gender:     'Male',
        }
      } else {
        error.value = 'ไม่พบข้อมูลผู้ป่วยในระบบ'
      }
      isLoading.value = false
    }, 500)
  } catch (err) {
    console.error(err)
    error.value     = 'ไม่สามารถเชื่อมต่อ Server ได้'
    isLoading.value = false
  }
}

const startMeasurement = () => {
  store.setPatient(patientData.value)
  router.push('/dashboard')
}
</script>
