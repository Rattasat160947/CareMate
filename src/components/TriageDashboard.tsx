import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CloudLightning, Heart, Info, Undo, XOctagon } from 'lucide-react'
import type { Patient, TriageCategory } from '../types'
import { playTapSound, playWarningSound } from '../utils/audio'

interface TriageDashboardProps {
  patient: Patient
  initialData: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
  }
  onBack: () => void
  onSave: (record: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
    triageGrade: TriageCategory
  }) => void
  accentColor: string
}

export default function TriageDashboard({ patient, initialData, onBack, onSave }: TriageDashboardProps) {
  const [systolic, setSystolic] = useState<number | null>(initialData.systolic)
  const [diastolic, setDiastolic] = useState<number | null>(initialData.diastolic)
  const [pulseRate, setPulseRate] = useState<number | null>(initialData.pulseRate)
  const [spo2, setSpo2] = useState<number | null>(initialData.spo2)
  const [temperature, setTemperature] = useState<number | null>(initialData.temperature)

  const getBPStatus = (sys: number | null, dia: number | null) => {
    if (sys === null || dia === null) return { grade: 'NORMAL' as TriageCategory, text: 'ไม่ได้ทำการวัดความดันโลหิต', label: 'ไม่ได้วัดความดัน', bg: 'bg-slate-100/50 dark:bg-slate-800/45', textCol: 'text-slate-400 dark:text-slate-500', ring: 'border-slate-200 dark:border-slate-800', icon: Info }
    if (sys >= 140 || dia >= 90) return { grade: 'ALERT' as TriageCategory, text: 'อันตราย (Hypertension)', label: 'ALERT', bg: 'bg-rose-50 dark:bg-rose-950/40', textCol: 'text-rose-600 dark:text-rose-400', ring: 'border-rose-500', icon: XOctagon }
    if (sys >= 125 || dia >= 80) return { grade: 'WARNING' as TriageCategory, text: 'เฝ้าระวัง (Prehypertension)', label: 'CAUTION', bg: 'bg-amber-50 dark:bg-amber-950/30', textCol: 'text-amber-600 dark:text-amber-400', ring: 'border-amber-400', icon: AlertTriangle }
    return { grade: 'NORMAL' as TriageCategory, text: 'ปกติ (Healthy)', label: 'NORMAL', bg: 'bg-emerald-50 dark:bg-emerald-950/20', textCol: 'text-emerald-600 dark:text-emerald-400', ring: 'border-emerald-500', icon: Check }
  }

  const getPulseStatus = (rate: number | null) => {
    if (rate === null) return { grade: 'NORMAL' as TriageCategory, text: 'ไม่ได้ทำการวัดอัตราการเต้นหัวใจ', label: 'ไม่ได้วัดชีพจร', bg: 'bg-slate-100/50 dark:bg-slate-800/45', textCol: 'text-slate-400 dark:text-slate-500', ring: 'border-slate-200 dark:border-slate-800', icon: Info }
    if (rate < 50 || rate > 115) return { grade: 'ALERT' as TriageCategory, text: 'ชีพจรผิดปกติรุนแรง', label: 'ALERT', bg: 'bg-rose-50 dark:bg-rose-950/40', textCol: 'text-rose-600 dark:text-rose-400', ring: 'border-rose-500', icon: XOctagon }
    if ((rate >= 50 && rate <= 59) || (rate >= 101 && rate <= 115)) return { grade: 'WARNING' as TriageCategory, text: 'ชีพจรผิดปกติเล็กน้อย', label: 'CAUTION', bg: 'bg-amber-50 dark:bg-amber-950/30', textCol: 'text-amber-600 dark:text-amber-400', ring: 'border-amber-400', icon: AlertTriangle }
    return { grade: 'NORMAL' as TriageCategory, text: 'ชีพจรปกติ (Normal)', label: 'NORMAL', bg: 'bg-emerald-50 dark:bg-emerald-950/20', textCol: 'text-emerald-600 dark:text-emerald-400', ring: 'border-emerald-500', icon: Check }
  }

  const getSpO2Status = (pct: number | null) => {
    if (pct === null) return { grade: 'NORMAL' as TriageCategory, text: 'ไม่ได้ทำการวัดระดับออกซิเจน', label: 'ไม่ได้วัดออกซิเจน', bg: 'bg-slate-100/50 dark:bg-slate-800/45', textCol: 'text-slate-400 dark:text-slate-500', ring: 'border-slate-200 dark:border-slate-800', icon: Info }
    if (pct < 93) return { grade: 'ALERT' as TriageCategory, text: 'วิกฤตออกซิเจนต่ำ (Hypoxia)', label: 'ALERT', bg: 'bg-rose-50 dark:bg-rose-950/40', textCol: 'text-rose-600 dark:text-rose-400', ring: 'border-rose-500', icon: XOctagon }
    if (pct >= 93 && pct <= 95) return { grade: 'WARNING' as TriageCategory, text: 'เฝ้าระวังออกซิเจนต่ำ', label: 'CAUTION', bg: 'bg-amber-50 dark:bg-amber-950/30', textCol: 'text-amber-600 dark:text-amber-400', ring: 'border-amber-400', icon: AlertTriangle }
    return { grade: 'NORMAL' as TriageCategory, text: 'ระดับออกซิเจนดีเยี่ยม', label: 'NORMAL', bg: 'bg-emerald-50 dark:bg-emerald-950/20', textCol: 'text-emerald-600 dark:text-emerald-400', ring: 'border-emerald-500', icon: Check }
  }

  const getTempStatus = (temp: number | null) => {
    if (temp === null) return { grade: 'NORMAL' as TriageCategory, text: 'ไม่ได้ทำการวัดอุณหภูมิร่างกาย', label: 'ไม่ได้วัดอุณหภูมิ', bg: 'bg-slate-100/50 dark:bg-slate-800/45', textCol: 'text-slate-400 dark:text-slate-500', ring: 'border-slate-200 dark:border-slate-800', icon: Info }
    if (temp > 38.2 || temp < 35.0) return { grade: 'ALERT' as TriageCategory, text: 'อุณหภูมิวิกฤต (มีไข้สูงมาก)', label: 'ALERT', bg: 'bg-rose-50 dark:bg-rose-950/40', textCol: 'text-rose-600 dark:text-rose-400', ring: 'border-rose-500', icon: XOctagon }
    if (temp >= 37.5 && temp <= 38.2) return { grade: 'WARNING' as TriageCategory, text: 'มีไข้ต่ำ (Low Fever)', label: 'CAUTION', bg: 'bg-amber-50 dark:bg-amber-950/30', textCol: 'text-amber-600 dark:text-amber-400', ring: 'border-amber-400', icon: AlertTriangle }
    return { grade: 'NORMAL' as TriageCategory, text: 'อุณหภูมิปกติ (Normal)', label: 'NORMAL', bg: 'bg-emerald-50 dark:bg-emerald-950/20', textCol: 'text-emerald-600 dark:text-emerald-400', ring: 'border-emerald-500', icon: Check }
  }

  const bpStatus = getBPStatus(systolic, diastolic)
  const pulseStatus = getPulseStatus(pulseRate)
  const spo2Status = getSpO2Status(spo2)
  const tempStatus = getTempStatus(temperature)

  let overallGrade: TriageCategory = 'NORMAL'
  if (bpStatus.grade === 'ALERT' || pulseStatus.grade === 'ALERT' || spo2Status.grade === 'ALERT' || tempStatus.grade === 'ALERT') {
    overallGrade = 'ALERT'
  } else if (bpStatus.grade === 'WARNING' || pulseStatus.grade === 'WARNING' || spo2Status.grade === 'WARNING' || tempStatus.grade === 'WARNING') {
    overallGrade = 'WARNING'
  }

  useEffect(() => {
    if (overallGrade === 'ALERT') {
      playWarningSound()
    }
  }, [overallGrade])

  const handleSaveData = () => {
    playTapSound()
    onSave({ systolic, diastolic, pulseRate, spo2, temperature, triageGrade: overallGrade })
  }

  return (
    <div className="max-w-3xl mx-auto w-full font-sans select-none">
      <div className="flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-xs gap-3 font-sans">
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500 font-mono">
                HN: <span className="text-slate-900 dark:text-white font-bold">{patient.hn}</span> • คนไข้: <span className="text-slate-900 dark:text-white font-bold">{patient.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${overallGrade === 'ALERT' ? 'bg-red-500' : overallGrade === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  ประเมินเบื้องต้น:{' '}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${overallGrade === 'ALERT' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/40' : overallGrade === 'WARNING' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/40' : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/35'}`}>
                    {overallGrade === 'ALERT' ? '🚨 ส่งต่อแพทย์ด่วน' : overallGrade === 'WARNING' ? '⚠️ เฝ้าระวัง' : '✅ ร่างกายปกติ'}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden md:block">{new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })} น.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-white dark:bg-slate-900 border-2 ${bpStatus.ring} rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all duration-200`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">ความดันโลหิต</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Blood Pressure</p>
                </div>
                <div className={`px-2.5 py-1 ${bpStatus.bg} rounded-full flex items-center gap-1 border border-slate-200/30`}>
                  <bpStatus.icon className={`w-3 h-3 ${bpStatus.textCol}`} />
                  <span className={`text-[9px] font-bold ${bpStatus.textCol}`}>{bpStatus.label}</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                  {systolic !== null && diastolic !== null ? (
                    <>
                      {systolic}<span className="text-slate-350 dark:text-slate-600 mx-1.5">/</span>{diastolic}
                    </>
                  ) : (
                    <span className="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight">ไม่ได้ทำการวัดความดันโลหิต</span>
                  )}
                </span>
                {systolic !== null && diastolic !== null && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5">mmHg</span>}
              </div>
              <p className={`text-[11px] font-medium ${bpStatus.textCol} truncate`}>{bpStatus.text}</p>
            </div>

            <div className={`bg-white dark:bg-slate-900 border-2 ${pulseStatus.ring} rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">อัตราการเต้นหัวใจ</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Pulse Rate</p>
                </div>
                <div className={`px-2.5 py-1 ${pulseStatus.bg} rounded-full flex items-center gap-1 border border-slate-200/30`}>
                  <pulseStatus.icon className={`w-3 h-3 ${pulseStatus.textCol}`} />
                  <span className={`text-[9px] font-bold ${pulseStatus.textCol}`}>{pulseStatus.label}</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                  {pulseRate !== null ? pulseRate : <span className="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight">ไม่ได้ทำการวัดอัตราการเต้นหัวใจ</span>}
                </span>
                {pulseRate !== null && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5 font-sans">BPM</span>}
              </div>
              <p className={`text-[11px] font-medium ${pulseStatus.textCol} truncate`}>{pulseStatus.text}</p>
            </div>

            <div className={`bg-white dark:bg-slate-900 border-2 ${spo2Status.ring} rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">ออกซิเจนในเลือด</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Oxygen Saturation</p>
                </div>
                <div className={`px-2.5 py-1 ${spo2Status.bg} rounded-full flex items-center gap-1 border border-slate-200/30`}>
                  <spo2Status.icon className={`w-3 h-3 ${spo2Status.textCol}`} />
                  <span className={`text-[9px] font-bold ${spo2Status.textCol}`}>{spo2Status.label}</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                  {spo2 !== null ? spo2 : <span className="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight">ไม่ได้ทำการวัดระดับออกซิเจน</span>}
                </span>
                {spo2 !== null && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5">%</span>}
              </div>
              <p className={`text-[11px] font-medium ${spo2Status.textCol} truncate`}>{spo2Status.text}</p>
            </div>

            <div className={`bg-white dark:bg-slate-900 border-2 ${tempStatus.ring} rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[160px] transition-all`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">อุณหภูมิร่างกาย</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Temperature</p>
                </div>
                <div className={`px-2.5 py-1 ${tempStatus.bg} rounded-full flex items-center gap-1 border border-slate-200/30`}>
                  <tempStatus.icon className={`w-3 h-3 ${tempStatus.textCol}`} />
                  <span className={`text-[9px] font-bold ${tempStatus.textCol}`}>{tempStatus.label}</span>
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                  {temperature !== null ? temperature : <span className="text-sm sm:text-base font-semibold font-sans text-slate-450 dark:text-slate-500 block py-1.5 leading-tight">ไม่ได้ทำการวัดอุณหภูมิร่างกาย</span>}
                </span>
                {temperature !== null && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 font-mono ml-1.5">°C</span>}
              </div>
              <p className={`text-[11px] font-medium ${tempStatus.textCol} truncate`}>{tempStatus.text}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6">
          <button id="btn-triage-back" onClick={() => {
            playTapSound()
            onBack()
          }} className="sm:col-span-4 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 font-semibold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm border border-slate-200/40 dark:border-slate-700 transition-all active:scale-[0.98] cursor-pointer">
            <Undo className="w-4 h-4" /> ย้อนกลับ (BACK)
          </button>
          <button id="btn-triage-save" onClick={handleSaveData} className="sm:col-span-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer">
            <CloudLightning className="w-4 h-4" /> บันทึกเวชระเบียน & ส่งออก API (SAVE & SEND)
          </button>
        </div>
      </div>
    </div>
  )
}