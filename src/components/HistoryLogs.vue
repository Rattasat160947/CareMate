<script setup lang="ts">
import { ref, computed } from 'vue'
import { BarChart, RefreshCw, Search, ShieldAlert, TrendingUp } from 'lucide-vue-next'
import type { VitalRecord } from '../types'
import { playTapSound } from '../utils/audio'

interface HistoryLogsProps {
  logs: VitalRecord[]
  onStartNewMeasurement: (patientId: string, patientName: string) => void
  onClearAllLogs: () => void
  accentColor: string
}

const props = defineProps<HistoryLogsProps>()

const handleRestart = (log: VitalRecord) => {
  playTapSound()
  props.onStartNewMeasurement(log.patientId, log.patientName)
}

const searchTerm = ref('')
const gradeFilter = ref<'ALL' | 'NORMAL' | 'WARNING' | 'ALERT'>('ALL')

const filteredLogs = computed(() => {
  return props.logs.filter((log) => {
    const matchesSearch =
      log.patientName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      log.patientId.includes(searchTerm.value) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.value.toLowerCase()))

    if (gradeFilter.value === 'ALL') return matchesSearch
    return matchesSearch && log.triageGrade === gradeFilter.value
  })
})

const totalCount = computed(() => props.logs.length)
const normalCount = computed(() => props.logs.filter((log) => log.triageGrade === 'NORMAL').length)
const warningCount = computed(
  () => props.logs.filter((log) => log.triageGrade === 'WARNING').length,
)
const alertCount = computed(() => props.logs.filter((log) => log.triageGrade === 'ALERT').length)

const normalPct = computed(() =>
  totalCount.value ? Math.round((normalCount.value / totalCount.value) * 100) : 0,
)
const warningPct = computed(() =>
  totalCount.value ? Math.round((warningCount.value / totalCount.value) * 100) : 0,
)
const alertPct = computed(() =>
  totalCount.value ? Math.round((alertCount.value / totalCount.value) * 100) : 0,
)

const setGradeFilter = (id: string) => {
  playTapSound()
  gradeFilter.value = id as any
}
</script>

<template>
  <div class="space-y-6 font-sans">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 select-none">
      <div
        class="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4"
      >
        <div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <BarChart class="w-4 h-4 text-sky-500" /> อัตราสัดส่วนกลุ่มความเสี่ยงคนไข้ (Triage
            Assessment Bar)
          </h3>
          <p class="text-[11px] text-slate-400 mt-0.5">
            แถบสีสะท้อนภาพรวมประชากรคนไข้ในคุ้ม ดูผลสรุปได้ทันทีไม่ต้องไล่เส้นกราฟ
          </p>
        </div>

        <div
          class="w-full h-8 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200/50 dark:border-slate-800"
        >
          <div
            v-if="normalPct > 0"
            class="bg-emerald-500 hover:opacity-95 transition-all text-white font-mono font-extrabold text-xs flex items-center justify-center cursor-pointer"
            :style="{ width: `${normalPct}%` }"
            :title="`ปกติ: ${normalCount} ราย (${normalPct}%)`"
          >
            <template v-if="normalPct >= 10">{{ normalPct }}%</template>
          </div>
          <div
            v-if="warningPct > 0"
            class="bg-amber-400 hover:opacity-95 transition-all text-slate-900 font-mono font-extrabold text-xs flex items-center justify-center cursor-pointer border-l border-white/20"
            :style="{ width: `${warningPct}%` }"
            :title="`เฝ้าระวัง: ${warningCount} ราย (${warningPct}%)`"
          >
            <template v-if="warningPct >= 10">{{ warningPct }}%</template>
          </div>
          <div
            v-if="alertPct > 0"
            class="bg-rose-500 hover:opacity-95 transition-all text-white font-mono font-extrabold text-xs flex items-center justify-center cursor-pointer border-l border-white/20"
            :style="{ width: `${alertPct}%` }"
            :title="`วิกฤต: ${alertCount} ราย (${alertPct}%)`"
          >
            <template v-if="alertPct >= 10">{{ alertPct }}%</template>
          </div>
          <div
            v-if="totalCount === 0"
            class="w-full text-center text-slate-400 dark:text-slate-650 text-xs py-2"
          >
            ยังไม่มีข้อมูลตรวจคัดกรองในสาระระบบ
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2.5 pt-1 text-center">
          <div
            class="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400"
          >
            <p class="text-[10px] font-bold">🟢 ปกติ (Normal)</p>
            <p class="font-mono text-xs font-extrabold mt-0.5">{{ normalCount }} ราย</p>
          </div>
          <div
            class="bg-amber-100/30 border border-amber-400/20 px-3 py-1.5 rounded-xl text-amber-600 dark:text-amber-400"
          >
            <p class="text-[10px] font-bold">🟡 เฝ้าระวัง (Caution)</p>
            <p class="font-mono text-xs font-extrabold mt-0.5">{{ warningCount }} ราย</p>
          </div>
          <div
            class="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 font-medium"
          >
            <p class="text-[10px] font-bold">🔴 ส่งต่อด่วน (Alert)</p>
            <p class="font-mono text-xs font-extrabold mt-0.5">{{ alertCount }} ราย</p>
          </div>
        </div>
      </div>

      <div
        class="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between select-none"
      >
        <div>
          <p class="text-xs text-slate-450 uppercase tracking-widest font-bold">
            การคัดกรองสัญญาณชีพ
          </p>
          <h3 class="text-3xl font-mono font-black text-slate-900 dark:text-white mt-1">
            {{ totalCount }}
            <span class="text-xs font-sans text-slate-400 font-normal">เคสทั้งหมด</span>
          </h3>
          <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
            อัตราการคัดกรองเชิงรุกของชุมชนอสม.
            เพื่อช่วยยับยั้งโรคความดันโลหิตสูงและเบาหวานในพื้นที่หมู่บ้าน
          </p>
        </div>

        <div
          class="flex items-center gap-1.5 text-[10px] text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-xl mt-4 border border-emerald-500/10"
        >
          <TrendingUp class="w-3.5 h-3.5" />
          <span>อสม. ลงคัดกรองครอบคลุมประชากรเป้าหมายแล้ว 88%</span>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
    >
      <div class="flex flex-col xl:flex-row gap-4 items-center justify-between mb-5 select-none">
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
          <div class="relative w-full sm:max-w-xs shrink-0">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อคนไข้ หรือ ข้อมูลตรวจ..."
              class="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
              v-model="searchTerm"
            />
          </div>

          <div class="flex gap-2 w-full overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              v-for="filter in [
                { id: 'ALL', label: `ทั้งหมด (${totalCount})` },
                { id: 'NORMAL', label: 'ปกติ 🟢' },
                { id: 'WARNING', label: 'เฝ้าระวัง 🟡' },
                { id: 'ALERT', label: 'วิกฤตด่วน 🔴' },
              ]"
              :key="filter.id"
              @click="setGradeFilter(filter.id)"
              :class="`px-3.5 py-2 text-[11px] font-semibold rounded-xl min-w-17.5 whitespace-nowrap transition-all cursor-pointer ${gradeFilter === filter.id ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-300' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border border-slate-200 dark:border-slate-800'}`"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr
              class="border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-wider text-[10px] font-medium select-none"
            >
              <th class="py-3 px-3">ชื่อคนไข้ / รายงาน</th>
              <th class="py-3 px-3">เวลาตรวจวัด</th>
              <th class="py-3 px-3">ความดัน (BP)</th>
              <th class="py-3 px-3">ออกซิเจน (SpO2)</th>
              <th class="py-3 px-3">อุณหภูมิ (Temp)</th>
              <th class="py-3 px-3">ผลคัดกรอง</th>
              <th class="py-3 px-3 text-center">ซิงก์ API</th>
              <th class="py-3 px-3 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
            <template v-if="filteredLogs.length > 0">
              <tr
                v-for="log in filteredLogs"
                :key="log.id"
                :id="`log-row-${log.id}`"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all"
              >
                <td class="py-4 px-3">
                  <div class="space-y-0.5">
                    <p class="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {{ log.patientName }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-mono">
                      ID: {{ log.patientId }}
                      <template v-if="log.examinerName">
                        • ผู้ตรวจ: {{ log.examinerName }}</template
                      >
                    </p>
                    <p
                      v-if="log.notes"
                      class="text-[10px] text-sky-600 dark:text-sky-400 italic bg-sky-50/50 dark:bg-sky-950/20 px-2 py-0.5 rounded w-max"
                    >
                      📝 {{ log.notes }}
                    </p>
                  </div>
                </td>
                <td class="py-4 px-3 text-slate-450 font-mono">
                  {{
                    new Date(log.timestamp).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                    })
                  }}
                  •
                  {{
                    new Date(log.timestamp).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    }) + ' น.'
                  }}
                </td>
                <td class="py-4 px-3 font-mono font-semibold">
                  <template v-if="log.systolic !== null && log.diastolic !== null">
                    {{ log.systolic }} / {{ log.diastolic }}
                    <span class="text-[9px] text-slate-400">mmHg</span>
                  </template>
                  <template v-else>
                    <span
                      class="text-slate-400 dark:text-slate-500 font-sans font-normal text-xs leading-tight"
                      >ไม่ได้ทำการวัดความดันโลหิต</span
                    >
                  </template>
                </td>
                <td class="py-4 px-3 font-mono font-semibold">
                  <template v-if="log.spo2 !== null">
                    {{ log.spo2 }} <span class="text-[9px] text-slate-400">%</span>
                  </template>
                  <template v-else>
                    <span
                      class="text-slate-400 dark:text-slate-500 font-sans font-normal text-xs leading-tight"
                      >ไม่ได้ทำการวัดระดับออกซิเจน</span
                    >
                  </template>
                </td>
                <td class="py-4 px-3 font-mono font-semibold">
                  <template v-if="log.temperature !== null">
                    {{ log.temperature }} <span class="text-[9px] text-slate-400">°C</span>
                  </template>
                  <template v-else>
                    <span
                      class="text-slate-400 dark:text-slate-500 font-sans font-normal text-xs leading-tight"
                      >ไม่ได้ทำการวัดอุณหภูมิร่างกาย</span
                    >
                  </template>
                </td>
                <td class="py-4 px-3">
                  <span
                    :class="`px-2 py-0.5 rounded-full text-[9px] font-bold ${log.triageGrade === 'ALERT' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : log.triageGrade === 'WARNING' ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400'}`"
                  >
                    {{
                      log.triageGrade === 'ALERT'
                        ? '🔴 วิกฤต (ALERT)'
                        : log.triageGrade === 'WARNING'
                          ? '🟡 เฝ้าระวัง (CH)'
                          : '🟢 ปกติ (NL)'
                    }}
                  </span>
                </td>
                <td class="py-4 px-3 text-center">
                  <span
                    :class="`px-2 py-0.5 rounded text-[9.5px] font-mono ${log.isSynced ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-450'}`"
                  >
                    {{ log.isSynced ? 'Synced ✓' : 'Local ✎' }}
                  </span>
                </td>
                <td class="py-4 px-3 text-right">
                  <button
                    @click="handleRestart(log)"
                    class="p-1.5 px-3 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/20 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto font-bold"
                    title="เริ่มวัดค่าใหม่สำหรับคนไข้ท่านนี้"
                  >
                    <RefreshCw class="w-3.5 h-3.5" />
                    <span class="text-[10px] font-bold">เริ่มวัดค่าใหม่</span>
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="8" class="text-center py-14 text-slate-400 dark:text-slate-600">
                  <ShieldAlert class="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  ไม่มีเวชระเบียนที่สอดคล้องกับตัวกรองค้นหาที่ท่านเลือก
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
