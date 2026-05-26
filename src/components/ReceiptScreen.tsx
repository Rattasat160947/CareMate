import { useEffect, useState } from 'react'
import { ArrowRight, FileText, Printer, ShieldCheck } from 'lucide-react'
import type { Patient, VitalRecord } from '../types'
import { playSuccessSound, playTapSound } from '../utils/audio'

interface ReceiptScreenProps {
  patient: Patient
  record: VitalRecord
  onDone: () => void
}

export default function ReceiptScreen({ patient, record, onDone }: ReceiptScreenProps) {
  const [isSending, setIsSending] = useState(true)
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSending(false)
      setSendSuccess(true)
      playSuccessSound()
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  const handleDone = () => {
    playTapSound()
    onDone()
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm font-sans flex flex-col justify-between select-none">
      <div className="text-center py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-emerald-100 dark:border-emerald-900/40">
          <ShieldCheck className="w-9 h-9 text-emerald-500" />
        </div>

        {isSending ? (
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 bg-sky-500 rounded-full animate-bounce" />
              กำลังส่งข้อมูลเข้าสู่คลาวด์สาธารณสุข...
            </h2>
            <p className="text-xs text-slate-500">Secure API connection encrypting payload packages...</p>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col items-center font-sans">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">ส่งเวชระเบียนสัญญาณชีพสําเร็จแล้ว!</h2>
            <p className="text-xs text-emerald-500 font-medium">บันทึกประวัติเข้าระบบกลาง (HIE Database) เรียบร้อย</p>
          </div>
        )}
      </div>

      <div className="my-6 flex justify-center">
        <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-inner max-w-sm w-full">
          <div className="flex justify-between items-center mb-4 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-xs uppercase tracking-wider">เวชระเบียนย่อ (Triage Slip)</span>
            </div>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-400 font-mono px-2 py-0.5 rounded">#{record.id}</span>
          </div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between"><span className="text-slate-400">ชื่อคนไข้ (Patient Name):</span><span className="font-semibold text-slate-800 dark:text-slate-100">{patient.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">เลขประจำตัว (HN):</span><span className="font-mono text-slate-800 dark:text-slate-100">{patient.hn}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">หมู่ที่รับผิดชอบ:</span><span className="text-slate-800 dark:text-slate-100">{patient.villageNo}</span></div>
            {record.examinerName && (
              <div className="flex justify-between"><span className="text-slate-400">ผู้ทำการคัดกรอง:</span><span className="font-semibold text-sky-600 dark:text-sky-400">{record.examinerName}</span></div>
            )}
            <div className="flex justify-between text-[11px] border-b border-dashed border-slate-100 dark:border-slate-800 pb-2"><span className="text-slate-400">เวลาคัดกรอง:</span><span className="font-mono text-slate-800 dark:text-slate-100">{new Date(record.timestamp).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })} น.</span></div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'ความดันโลหิต (BP)', val: record.systolic !== null && record.diastolic !== null ? `${record.systolic} / ${record.diastolic}` : 'ไม่ได้ทำการวัดความดันโลหิต', unit: record.systolic !== null && record.diastolic !== null ? 'mmHg' : '' },
              { label: 'อัตราชีพจร (Pulse)', val: record.pulseRate !== null ? record.pulseRate : 'ไม่ได้ทำการวัดอัตราการเต้นหัวใจ', unit: record.pulseRate !== null ? 'BPM' : '' },
              { label: 'ความอิ่มตัว SpO2', val: record.spo2 !== null ? record.spo2 : 'ไม่ได้ทำการวัดระดับออกซิเจน', unit: record.spo2 !== null ? '%' : '' },
              { label: 'อุณหภูมิกาย (Temp)', val: record.temperature !== null ? record.temperature : 'ไม่ได้ทำการวัดอุณหภูมิร่างกาย', unit: record.temperature !== null ? '°C' : '' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">{item.label}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {item.val} <span className="text-[10px] font-normal text-slate-500 dark:text-slate-500">{item.unit}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">สรุปเกณฑ์ประเด็น:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${record.triageGrade === 'ALERT' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' : record.triageGrade === 'WARNING' ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'}`}>
              {record.triageGrade === 'ALERT' ? 'ALERT (แดงวิกฤต)' : record.triageGrade === 'WARNING' ? 'CAUTION (ส้มเฝ้า)' : 'NORMAL (เขียวปกติ)'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5 flex justify-center">
        <button id="btn-print-slip" onClick={() => { playTapSound(); alert('เครื่องพิมพ์สติกเกอร์เทอร์มอลไม่พ่วงเชื่อมต่อ (จำลองความต้องการใช้จริง)') }} className="w-full max-w-sm py-3 px-4 rounded-xl border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
          <Printer className="w-4 h-4 text-sky-500" /> พิมพ์สลิปด่วน  (Print Slip)
        </button>
      </div>

      <button id="btn-triage-done" onClick={handleDone} className="py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl shadow hover:shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer">
        <span>เสร็จสิ้นและตรวจคัดกรองคนไข้รายต่อไป</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}