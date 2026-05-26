import { useState } from 'react'
import { ArrowRight, Delete, Search, ShieldAlert, UserCheck } from 'lucide-react'
import { mockExaminers } from '../data/patients'
import type { Examiner } from '../types'
import { playTapSound } from '../utils/audio'

interface ExaminerSelectorProps {
  onSelect: (examiner: Examiner) => void
  accentColor: string
}

export default function ExaminerSelector({ onSelect }: ExaminerSelectorProps) {
  const [searchText, setSearchText] = useState('')
  const [selectedExaminerId, setSelectedExaminerId] = useState<string | null>(null)

  const filteredExaminers = mockExaminers.filter(
    (examiner) => examiner.name.includes(searchText) || examiner.id.includes(searchText) || examiner.villageNo.includes(searchText),
  )

  const handleSelectExaminer = (id: string) => {
    playTapSound()
    setSelectedExaminerId(id)
  }

  const handleProceed = () => {
    playTapSound()
    const selected = mockExaminers.find((examiner) => examiner.id === selectedExaminerId)
    if (selected) onSelect(selected)
  }

  const handleKeypadPress = (value: string) => {
    playTapSound()
    if (searchText.length < 13) setSearchText((prev) => prev + value)
  }

  const handleKeypadDelete = () => {
    playTapSound()
    setSearchText((prev) => prev.slice(0, -1))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans">
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="text-sky-500 w-5 h-5 animate-pulse" />
                ระบุตัวตนผู้ตรวจ (อสม. ประจำการ)
              </h2>
              <p className="text-xs text-slate-500 mt-1">กรุณาระบุตัวตนของเจ้าหน้าที่ อสม. ผู้บันทึกตรวจก่อนเริ่มขั้นตอนถัดไป</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="examiner-search-input"
                type="text"
                placeholder="ค้นหาด้วย ชื่อ อสม. หรือป้อนเลขบัตรประชาชน..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              {searchText && (
                <button
                  onClick={() => {
                    playTapSound()
                    setSearchText('')
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
                >
                  ล้างข้อมูล
                </button>
              )}
            </div>

            <div className="max-h-[310px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
              {filteredExaminers.length > 0 ? (
                filteredExaminers.map((examiner) => {
                  const isSelected = selectedExaminerId === examiner.id
                  return (
                    <div
                      key={examiner.id}
                      id={`examiner-card-${examiner.id}`}
                      onClick={() => handleSelectExaminer(examiner.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500 shadow-sm' : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-800 hover:bg-slate-100/50'}`}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          {examiner.name}
                          <span className="text-xs px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-normal">{examiner.role}</span>
                        </p>
                        <p className="text-xs text-slate-500 font-mono">ID: {examiner.id}</p>
                        <p className="text-[11px] text-slate-400">{examiner.villageNo}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-350 dark:border-slate-700'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm">ไม่พบข้อมูลรายชื่อ อสม. ที่พิมพ์หา</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            id="btn-goto-patient"
            onClick={handleProceed}
            disabled={!selectedExaminerId}
            className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98] ${selectedExaminerId ? 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer hover:shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
          >
            <span>ยืนยันผู้ตรวจ และเข้าสู่ขั้นตอนการเลือกคนไข้</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white text-xs text-center uppercase tracking-wider mb-1">แผงแป้นตัวเลขสัมผัส (Touch Numeric Keypad)</h3>
            <p className="text-[10px] text-slate-500 text-center">ออกแบบรองรับการยืนยันตัวตน อสม. ด้วยรหัสส่วนตัวหรือค้นเลขประจำตัว</p>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center mb-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">ตัวเลขรหัสค้นหาด่วน</p>
            <p className="text-xl font-mono font-bold tracking-wider text-slate-800 dark:text-slate-100 min-h-7">{searchText || '—'}</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((number) => (
              <button
                key={number}
                id={`keypad-${number}`}
                onClick={() => handleKeypadPress(number)}
                className="py-4.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-mono font-semibold text-lg border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xs active:scale-90 transition-all flex items-center justify-center cursor-pointer"
              >
                {number}
              </button>
            ))}

            <button
              id="keypad-clear"
              onClick={() => {
                playTapSound()
                setSearchText('')
              }}
              className="py-4.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium text-xs border border-rose-200/50 dark:border-rose-900/40 rounded-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              CLEAR
            </button>

            <button
              id="keypad-0"
              onClick={() => handleKeypadPress('0')}
              className="py-4.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-mono font-semibold text-lg border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xs active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            >
              0
            </button>

            <button
              id="keypad-delete"
              onClick={handleKeypadDelete}
              className="py-4.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-semibold text-sm border border-slate-200 dark:border-slate-700 rounded-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-sky-50/50 dark:bg-sky-950/25 border border-sky-100/50 dark:border-sky-900/30 rounded-2xl p-4 text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          <p className="font-semibold text-sky-800 dark:text-sky-400 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />คำแนะนำสำหรับผู้ปฏิบัติการ
          </p>
          แตะเลือก อสม. จากหน้าจอ หรือป้อนรหัส ID ด้วยแป้นสัมผัสด้านบน เพื่อใช้ระบุผู้ทำการบันทึกข้อมูล และยืนยันลิขสิทธิ์ความรับผิดชอบผลการตรวจวัด
        </div>
      </div>
    </div>
  )
}