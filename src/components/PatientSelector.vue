<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Delete, Plus, Search, ShieldAlert, User } from 'lucide-vue-next'
import { mockPatients } from '../data/patients'
import type { Patient } from '../types'
import { playTapSound } from '../utils/audio'

const props = defineProps<{
  activeExaminerName?: string
  accentColor: string
}>()

const emit = defineEmits<{
  (e: 'select', patient: Patient): void
  (e: 'back'): void
}>()

const clearSearch = () => {
  playTapSound()
  searchText.value = ''
}

const searchText = ref('')
const selectedPatientId = ref<string | null>(null)

const filteredPatients = computed(() =>
  mockPatients.filter(
    (patient) =>
      patient.name.includes(searchText.value) ||
      patient.id.includes(searchText.value) ||
      patient.hn.includes(searchText.value),
  ),
)

const handleSelectPatient = (id: string) => {
  playTapSound()
  selectedPatientId.value = id
}

const startMeasurement = () => {
  playTapSound()
  const selected = mockPatients.find((patient) => patient.id === selectedPatientId.value)
  if (selected) emit('select', selected)
}

const handleKeypadPress = (value: string) => {
  playTapSound()
  if (searchText.value.length < 13) searchText.value += value
}

const handleKeypadDelete = () => {
  playTapSound()
  searchText.value = searchText.value.slice(0, -1)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
    <div
      class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800"
        >
          <div>
            <h2
              class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <User class="text-sky-500 w-5 h-5" />
              ระบุตัวตน / เลือกรายชื่อผู้รับบริการ
            </h2>
            <p class="text-xs text-slate-500 mt-1 font-sans">
              <template v-if="activeExaminerName">
                เจ้าหน้าที่ผู้ตรวจบันทึก:
                <span class="font-semibold text-sky-600 dark:text-sky-400">{{
                  activeExaminerName
                }}</span>
              </template>
              <template v-else>
                คัดกรองสัญญาณชีพง่ายๆ สไตล์ Medical Minimalism สำหรับ อสม.
              </template>
            </p>
          </div>
          <button
            v-if="$attrs.onBack"
            id="btn-change-examiner"
            @click="emit('back')"
            class="self-start sm:self-auto px-3.5 py-1.8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px] rounded-xl transition-all cursor-pointer active:scale-95 border border-slate-200/40 dark:border-slate-700/40"
          >
            ← เปลี่ยนผู้ตรวจ (อสม.)
          </button>
        </div>

        <div class="space-y-4">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="patient-search-input"
              type="text"
              placeholder="ค้นหาด้วย ชื่อ, สกุล หรือ เลขบัตร 13 หลัก..."
              class="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              v-model="searchText"
            />
            <button
              v-if="searchText"
              @click="clearSearch"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div class="max-h-[310px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
            <template v-if="filteredPatients.length > 0">
              <div
                v-for="patient in filteredPatients"
                :key="patient.id"
                :id="`patient-card-${patient.id}`"
                @click="handleSelectPatient(patient.id)"
                :class="[
                  'p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center',
                  selectedPatientId === patient.id
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-800 hover:bg-slate-100/50',
                ]"
              >
                <div class="space-y-1">
                  <p
                    class="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5"
                  >
                    {{ patient.name }}
                    <span
                      class="text-xs px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-normal"
                      >อายุ {{ patient.age }} ปี • {{ patient.gender }}</span
                    >
                  </p>
                  <p class="text-xs text-slate-500 font-mono">ID: {{ patient.id }}</p>
                  <p class="text-[11px] text-slate-400">
                    {{ patient.hn }} • {{ patient.villageNo }}
                  </p>
                </div>
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    selectedPatientId === patient.id
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-350 dark:border-slate-700',
                  ]"
                >
                  <div
                    v-if="selectedPatientId === patient.id"
                    class="w-2 h-2 rounded-full bg-white animate-pulse"
                  />
                </div>
              </div>
            </template>
            <div
              v-else
              class="text-center py-12 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
            >
              <ShieldAlert class="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p class="text-sm">ไม่พบข้อมูลผู้ป่วยที่พิมพ์หา</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          id="btn-goto-measurements"
          @click="startMeasurement"
          :disabled="!selectedPatientId"
          :class="[
            'w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98]',
            selectedPatientId
              ? 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer hover:shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
          ]"
        >
          <span>เริ่มตรวจคัดกรองสัญญาณชีพคนไข้</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div
      class="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div class="mb-4">
          <h3
            class="font-semibold text-slate-800 dark:text-white text-xs text-center uppercase tracking-wider mb-1"
          >
            แผงแป้นตัวเลขสัมผัส (Touch Numeric Keypad)
          </h3>
          <p class="text-[10px] text-slate-500 text-center">
            ออกแบบรองรับการใช้งานบนหน้าจอสัมผัสติดหัวเตียง หรือแท็บเล็ต อสม.
          </p>
        </div>

        <div
          class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center mb-4"
        >
          <p class="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
            ตัวเลขค้นหาด่วน
          </p>
          <p
            class="text-xl font-mono font-bold tracking-wider text-slate-800 dark:text-slate-100 min-h-7"
          >
            {{ searchText || '—' }}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2.5">
          <button
            v-for="number in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
            :key="number"
            :id="`keypad-${number}`"
            @click="handleKeypadPress(number)"
            class="py-4.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-mono font-semibold text-lg border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xs active:scale-90 transition-all flex items-center justify-center cursor-pointer"
          >
            {{ number }}
          </button>

          <button
            id="keypad-clear"
            @click="clearSearch"
            class="py-4.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium text-xs border border-rose-200/50 dark:border-rose-900/40 rounded-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            CLEAR
          </button>

          <button
            id="keypad-0"
            @click="handleKeypadPress('0')"
            class="py-4.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-mono font-semibold text-lg border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xs active:scale-90 transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          <button
            id="keypad-delete"
            @click="handleKeypadDelete"
            class="py-4.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-semibold text-sm border border-slate-200 dark:border-slate-700 rounded-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        class="bg-sky-50/50 dark:bg-sky-950/25 border border-sky-100/50 dark:border-sky-900/30 rounded-2xl p-4 text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed"
      >
        <p class="font-semibold text-sky-800 dark:text-sky-400 mb-1 flex items-center gap-1.5">
          <Plus class="w-3.5 h-3.5" />คำแนะนำสำหรับ อสม.
        </p>
        แตะเลือกคนไข้จากรายชื่อในฐาน แล้วป้อนรหัส ID ด้วยปุ่มสัมผัสขนาดใหญ่ด้านบน เพื่อความสะดวก
        รวดเร็ว และลดความผิดพลาดในการกรอกข้อมูล
      </div>
    </div>
  </div>
</template>
