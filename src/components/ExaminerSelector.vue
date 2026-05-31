<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
    <div
      class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div
          class="flex justify-between items-center mb-5 pb-4 border-b border-slate-100 dark:border-slate-800"
        >
          <div>
            <h2
              class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <UserCheck class="text-sky-500 w-5 h-5" />
              ระบุตัวตนผู้ตรวจ
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              กรุณาระบุตัวตนของเจ้าหน้าที่ ผู้บันทึกตรวจก่อนเริ่มขั้นตอนถัดไป
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="examiner-search-input"
              type="text"
              placeholder="ค้นหาด้วย ชื่อหรือป้อนเลขบัตรประชาชน..."
              class="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              v-model="searchText"
            />
            <button
              v-if="searchText"
              @click="clearSearchText"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div class="max-h-[310px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
            <template v-if="filteredExaminers.length > 0">
              <div
                v-for="examiner in filteredExaminers"
                :key="examiner.id"
                :id="`examiner-card-${examiner.id}`"
                @click="handleSelectExaminer(examiner.id)"
                :class="[
                  'p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center',
                  selectedExaminerId === examiner.id
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-800 hover:bg-slate-100/50',
                ]"
              >
                <div class="space-y-1">
                  <p
                    class="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5"
                  >
                    {{ examiner.name }}
                    <span
                      class="text-xs px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-normal"
                      >{{ examiner.role }}</span
                    >
                  </p>
                  <p class="text-xs text-slate-500 font-mono">ID: {{ examiner.id }}</p>
                  <p class="text-[11px] text-slate-400">{{ examiner.villageNo }}</p>
                </div>
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    selectedExaminerId === examiner.id
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-350 dark:border-slate-700',
                  ]"
                >
                  <div
                    v-if="selectedExaminerId === examiner.id"
                    class="w-2 h-2 rounded-full bg-white"
                  />
                </div>
              </div>
            </template>
            <div
              v-else
              class="text-center py-12 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
            >
              <ShieldAlert class="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p class="text-sm">ไม่พบข้อมูลรายชื่อที่พิมพ์หา</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          id="btn-goto-patient"
          @click="handleProceed"
          :disabled="!selectedExaminerId"
          :class="[
            'w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98]',
            selectedExaminerId
              ? 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer hover:shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed',
          ]"
        >
          <span>ยืนยันผู้ตรวจ และเข้าสู่ขั้นตอนการเลือกคนไข้</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div
      class="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div class="mb-4">

          <p class="text-[10px] text-slate-500 text-center">
            ออกแบบรองรับการยืนยันตัวตนด้วยรหัสส่วนตัวหรือค้นเลขประจำตัว
          </p>
        </div>

        <div
          class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center mb-4"
        >
          <p class="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
            รหัสผู้ตรวจ
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
            @click="clearSearchText"
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


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Delete, Search, ShieldAlert, UserCheck } from 'lucide-vue-next'
import { mockExaminers } from '../data/patients'
import type { Examiner } from '../types'

defineProps<{
  accentColor?: string
}>()

const emit = defineEmits<{
  (e: 'select', examiner: Examiner): void
}>()

const searchText = ref('')
const selectedExaminerId = ref<string | null>(null)

const filteredExaminers = computed(() => {
  return mockExaminers.filter(
    (examiner) =>
      examiner.name.includes(searchText.value) ||
      examiner.id.includes(searchText.value) ||
      examiner.villageNo.includes(searchText.value),
  )
})

const handleSelectExaminer = (id: string) => {
  selectedExaminerId.value = id
}

const handleProceed = () => {
  const selected = mockExaminers.find((examiner) => examiner.id === selectedExaminerId.value)
  if (selected) {
    emit('select', selected)
  }
}

const handleKeypadPress = (value: string) => {
  if (searchText.value.length < 13) {
    searchText.value += value
  }
}

const handleKeypadDelete = () => {
  searchText.value = searchText.value.slice(0, -1)
}

const clearSearchText = () => {
  searchText.value = ''
}
</script>
