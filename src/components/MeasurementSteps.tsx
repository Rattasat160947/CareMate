import { useEffect, useState } from 'react'
import { Activity, AlertCircle, ArrowRight, CheckCircle, Clock, Heart, Sparkles, Thermometer } from 'lucide-react'
import type { Patient } from '../types'
import { playHeartbeatSound, playOximeterSound, playSuccessSound, playTapSound } from '../utils/audio'

interface MeasurementStepsProps {
  patient: Patient
  onCompleted: (results: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
  }) => void
  onCancel: () => void
  accentColor: string
}

export default function MeasurementSteps({ patient, onCompleted, onCancel }: MeasurementStepsProps) {
  const [step, setStep] = useState<'dashboard' | 'bp' | 'spo2' | 'temp'>('dashboard')
  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [completedTests, setCompletedTests] = useState({ bp: false, spo2: false, temp: false })
  const [cuffPressure, setCuffPressure] = useState(0)
  const [pulseRate, setPulseRate] = useState<number>(72)
  const [systolic, setSystolic] = useState<number>(118)
  const [diastolic, setDiastolic] = useState<number>(78)
  const [spo2, setSpo2] = useState<number>(98)
  const [temperature, setTemperature] = useState<number>(36.6)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (simState === 'running') {
      if (step === 'bp') {
        setProgress(0)
        let currentPressure = 0
        let phase: 'inflating' | 'deflating' = 'inflating'

        const runBP = () => {
          if (phase === 'inflating') {
            currentPressure += 12
            setCuffPressure(currentPressure)
            setProgress(Math.min(50, (currentPressure / 160) * 50))

            if (currentPressure >= 160) {
              phase = 'deflating'
              currentPressure = 160
            }
            timer = setTimeout(runBP, 80)
          } else {
            currentPressure -= 6
            setCuffPressure(currentPressure)
            setProgress(50 + Math.min(50, ((160 - currentPressure) / 100) * 50))

            if (currentPressure > 60 && currentPressure < 140 && currentPressure % 14 === 0) {
              playHeartbeatSound(true)
            }

            if (currentPressure <= 60) {
              playSuccessSound()
              const finalSys = Math.floor(Math.random() * 25) + 110
              const finalDia = Math.floor(Math.random() * 15) + 70
              const finalPulse = Math.floor(Math.random() * 15) + 65

              setSystolic(finalSys)
              setDiastolic(finalDia)
              setPulseRate(finalPulse)
              setCuffPressure(0)
              setSimState('done')
              setProgress(100)
              setCompletedTests((prev) => ({ ...prev, bp: true }))
            } else {
              timer = setTimeout(runBP, 120)
            }
          }
        }

        timer = setTimeout(runBP, 100)
      } else if (step === 'spo2') {
        setProgress(0)
        let count = 0

        const runSpO2 = () => {
          count += 2
          setProgress(count)

          if (count % 20 === 0) {
            playOximeterSound(98)
          }

          if (count >= 100) {
            playSuccessSound()
            const finalSpo2 = Math.floor(Math.random() * 4) + 96
            setSpo2(finalSpo2)
            setSimState('done')
            setCompletedTests((prev) => ({ ...prev, spo2: true }))
          } else {
            timer = setTimeout(runSpO2, 60)
          }
        }

        timer = setTimeout(runSpO2, 100)
      } else if (step === 'temp') {
        setProgress(0)
        let count = 0

        const runTemp = () => {
          count += 5
          setProgress(count)
          if (count % 25 === 0) {
            playTapSound()
          }
          if (count >= 100) {
            playSuccessSound()
            const finalTemp = parseFloat((Math.random() * 1.2 + 36.2).toFixed(1))
            setTemperature(finalTemp)
            setSimState('done')
            setCompletedTests((prev) => ({ ...prev, temp: true }))
          } else {
            timer = setTimeout(runTemp, 80)
          }
        }

        timer = setTimeout(runTemp, 100)
      }
    }

    return () => {
      clearTimeout(timer)
    }
  }, [simState, step])

  const handleStartSimulation = () => {
    playTapSound()
    setSimState('running')
  }

  const saveAndReturnToDashboard = () => {
    playTapSound()
    setStep('dashboard')
    setSimState('idle')
    setProgress(0)
  }

  const handleProceedToSummary = () => {
    playTapSound()
    onCompleted({
      systolic: completedTests.bp ? systolic : null,
      diastolic: completedTests.bp ? diastolic : null,
      pulseRate: completedTests.bp ? pulseRate : null,
      spo2: completedTests.spo2 ? spo2 : null,
      temperature: completedTests.temp ? temperature : null,
    })
  }

  const isAnyTestCompleted = completedTests.bp || completedTests.spo2 || completedTests.temp
  const isAllTestsCompleted = completedTests.bp && completedTests.spo2 && completedTests.temp

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-none min-h-[550px] flex flex-col justify-between font-sans transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5 select-none">
          <div className="text-left">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">กำลังคัดกรองสัญญาณชีพ & ตรวจร่างกาย</p>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-1.5 leading-none">
              {patient.name} <span className="text-slate-400 font-normal">({patient.gender}, อายุ {patient.age} ปี)</span>
            </h2>
          </div>

          <div className="flex gap-2">
            {step !== 'dashboard' && (
              <button
                id="btn-back-to-selection"
                onClick={() => {
                  playTapSound()
                  setStep('dashboard')
                  setSimState('idle')
                }}
                className="text-xs text-slate-600 dark:text-slate-400 font-medium px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all select-none"
              >
                ← ย้อนกลับหน้ารวม
              </button>
            )}
            <button
              id="btn-cancel-measurement"
              onClick={() => {
                playTapSound()
                onCancel()
              }}
              className="text-xs text-rose-500 font-semibold px-3.5 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all select-none"
            >
              ยกเลิกคัดกรอง
            </button>
          </div>
        </div>
      </div>

      <div className="my-auto py-2">
        {step === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${completedTests.bp ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40 shadow-sm' : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-sky-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-rose-100/60 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Activity className="w-5.5 h-5.5" />
                  </div>
                  {completedTests.bp ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> วัดเสร็จแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">รอดำเนินการ</span>
                  )}
                </div>

                <div className="my-5">
                  <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">ความดันโลหิต & ชีพจร</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Blood Pressure & Pulse</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    {completedTests.bp ? (
                      <div>
                        <span className="text-4xl sm:text-5xl font-mono font-black text-rose-500 tracking-tight">
                          {systolic}/{diastolic}
                        </span>
                        <span className="text-xs text-slate-400 font-mono ml-1">mmHg</span>
                        <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-semibold mt-2 flex items-center gap-1.5 bg-rose-50/50 dark:bg-rose-950/20 px-2.5 py-1 rounded-xl w-max">
                          <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> ชีพจร {pulseRate} <span className="text-xs font-normal">bpm</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-3xl font-mono font-bold text-slate-300 dark:text-slate-700">-- / -- mmHg</span>
                    )}
                  </div>
                </div>

                <button
                  id="btn-select-bp"
                  onClick={() => {
                    playTapSound()
                    setStep('bp')
                    setSimState('idle')
                    setProgress(0)
                  }}
                  className={`w-full py-4 text-sm sm:text-base font-extrabold rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-95 duration-150 ${completedTests.bp ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10'}`}
                >
                  {completedTests.bp ? 'ตรวจซ้ำอีกครั้ง' : 'เริ่มตรวจวัดความดัน'}
                </button>
              </div>

              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${completedTests.spo2 ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40 shadow-sm' : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-sky-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-sky-100/60 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Heart className="w-5.5 h-5.5" />
                  </div>
                  {completedTests.spo2 ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> วัดเสร็จแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">รอดำเนินการ</span>
                  )}
                </div>

                <div className="my-5">
                  <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">ออกซิเจนในเลือด</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">SpO2 (Oxygen Saturation)</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    {completedTests.spo2 ? (
                      <div>
                        <span className="text-4xl sm:text-5xl font-mono font-black text-sky-500 tracking-tight">{spo2}</span>
                        <span className="text-xl font-bold ml-1 text-sky-500">%</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-mono font-bold text-slate-300 dark:text-slate-700">-- %</span>
                    )}
                  </div>
                </div>

                <button
                  id="btn-select-spo2"
                  onClick={() => {
                    playTapSound()
                    setStep('spo2')
                    setSimState('idle')
                    setProgress(0)
                  }}
                  className={`w-full py-4 text-sm sm:text-base font-extrabold rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-95 duration-150 ${completedTests.spo2 ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200' : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sky-500/10'}`}
                >
                  {completedTests.spo2 ? 'ตรวจซ้ำอีกครั้ง' : 'เริ่มตรวจวัด SpO2'}
                </button>
              </div>

              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${completedTests.temp ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40 shadow-sm' : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-sky-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 rounded-xl">
                    <Thermometer className="w-5.5 h-5.5" />
                  </div>
                  {completedTests.temp ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> วัดเสร็จแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">รอดำเนินการ</span>
                  )}
                </div>

                <div className="my-5">
                  <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">อุณหภูมิร่างกาย</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Body Temperature</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    {completedTests.temp ? (
                      <div>
                        <span className="text-4xl sm:text-5xl font-mono font-black text-amber-500 tracking-tight">{temperature}</span>
                        <span className="text-xl font-bold ml-1 text-amber-500">°C</span>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-2 bg-emerald-500/10 px-2.5 py-1 rounded-xl w-max">อุณหภูมิร่างกายปกติ</div>
                      </div>
                    ) : (
                      <span className="text-3xl font-mono font-bold text-slate-300 dark:text-slate-700">-- °C</span>
                    )}
                  </div>
                </div>

                <button
                  id="btn-select-temp"
                  onClick={() => {
                    playTapSound()
                    setStep('temp')
                    setSimState('idle')
                    setProgress(0)
                  }}
                  className={`w-full py-4 text-sm sm:text-base font-extrabold rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-95 duration-150 ${completedTests.temp ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/10'}`}
                >
                  {completedTests.temp ? 'สแกนซ้ำอีกครั้ง' : 'เริ่มตรวจวัดอุณหภูมิ'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-805 flex flex-col items-center">
              {isAnyTestCompleted ? (
                <div className="w-full text-center">
                  <button
                    id="btn-confirm-measurements"
                    onClick={handleProceedToSummary}
                    className={`px-8 py-4 text-base font-extrabold rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 w-full max-w-lg mx-auto cursor-pointer ${isAllTestsCompleted ? 'bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-500/10' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                  >
                    {isAllTestsCompleted ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        สแกนครบถ้วน: สรุปผลคัดกรองสัญญาณชีพ
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        ประเมินผลคัดกรอง {[completedTests.bp, completedTests.spo2, completedTests.temp].filter(Boolean).length}/3 รายการสำเร็จ
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">คุณจบนารายการตรวจแล้ว สามารถคลิกเพื่อส่งมอบผลการคัดกรองไปยังฐานข้อมูลวินิจฉัยโรค</p>
                </div>
              ) : (
                <div className="w-full text-center py-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 max-w-lg">
                  <p className="text-xs text-slate-450 font-semibold flex items-center justify-center gap-1.5 text-amber-500">
                    <AlertCircle className="w-4 h-4" /> กรุณาเริ่มวัดผลอย่างน้อย 1 รายการเพื่อดำเนินการต่อ
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : step === 'bp' ? (
          <div className="text-center max-w-lg w-full mx-auto">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-100 dark:border-rose-900/50">
              <Activity className="w-10 h-10 text-rose-500 animate-pulse" />
            </div>

            {simState === 'idle' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">วัดความดันโลหิตและชีพจร (Blood Pressure & Pulse)</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">สวมปลอกแขนคัฟฟ์ที่ต้นแขนซ้ายของคนไข้ในระดับเดียวกับขั้วหัวใจ จากนั้นกดปุ่มและตรวจจับสัญญาณเต้นชีพจรพร้อมกันทันที</p>
                <button id="btn-run-bp-sim" onClick={handleStartSimulation} className="flex-1 py-5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-95 duration-150 cursor-pointer">
                  เริ่มตรวจวัดความดันโลหิตและชีพจรทันที
                </button>
              </div>
            ) : simState === 'running' ? (
              <div className="space-y-4 w-full select-none">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{cuffPressure > 140 ? 'กำลังค่อยๆ รัดกระชับสายปลอกคัฟฟ์แขน...' : 'ประดับการไหลเวียนโลหิตและตรวจหาชีพจร...'}</h3>
                <div className="text-6xl font-mono font-bold text-rose-500 tracking-tight flex items-baseline justify-center gap-1.5 digital-glow">
                  {cuffPressure}
                  <span className="text-xs font-sans text-slate-450 font-normal">mmHg</span>
                </div>
                <div className="w-full max-w-md mx-auto h-3 bg-slate-150 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/55 dark:border-slate-800">
                  <div className="h-full bg-rose-500 transition-all duration-150 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[11px] text-slate-450 flex items-center justify-center gap-1 font-medium animate-pulse">
                  <Clock className="w-3.5 h-3.5 animate-spin text-rose-450" /> รักษาความนิ่งของอุปกรณ์ และห้ามคนไข้เคลื่อนไหวเพื่อค่าที่เสถียรที่สุด
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <p className="text-lg sm:text-2xl font-black text-emerald-500 flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" /> ตรวจวัดความดันและชีพจรเสร็จสิ้นร่วมกัน
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-slate-850 p-6">
                  <div className="text-center px-4">
                    <p className="text-base text-slate-550 dark:text-slate-405 font-bold uppercase tracking-wide">ความดันโลหิต (SYS / DIA)</p>
                    <p className="text-5xl sm:text-6xl font-mono font-black text-rose-500 mt-2 tracking-tight">
                      {systolic} <span className="text-2xl font-normal text-slate-400">/</span> {diastolic}
                    </p>
                    <p className="text-[12px] text-slate-400 font-bold font-mono mt-1">mmHg</p>
                  </div>
                  <div className="hidden sm:block w-px h-20 bg-slate-200 dark:bg-slate-800" />
                  <div className="text-center px-4">
                    <p className="text-base text-slate-550 dark:text-slate-405 font-bold uppercase tracking-wide">ชีพจร (Pulse Rate)</p>
                    <p className="text-5xl sm:text-6xl font-mono font-black text-rose-500 mt-2 tracking-tight">{pulseRate}</p>
                    <p className="text-[12px] text-slate-400 font-bold font-mono mt-1">bpm</p>
                  </div>
                </div>

                <button id="btn-bp-save" onClick={saveAndReturnToDashboard} className="px-8 py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto w-full max-w-xs">
                  <CheckCircle className="w-4 h-4" /> บันทึกค่าและนำกลับหน้ารวม
                </button>
              </div>
            )}
          </div>
        ) : step === 'spo2' ? (
          <div className="text-center max-w-lg w-full mx-auto">
            <div className="w-20 h-20 bg-sky-50 dark:bg-sky-950/60 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sky-100 dark:border-sky-900/50">
              <Heart className="w-10 h-10 text-sky-500 animate-pulse" />
            </div>

            {simState === 'idle' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">ตรวจปริมาณออกซิเจนในเลือด (SpO2)</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">หนีบเครื่องตรวจวัดสัญญาณชีพเข้าที่นิ้วชี้ข้างซ้ายกระชับของคนไข้ เพื่อวิเคราะห์ระดับออกซิเจนที่ปลายนิ้ว</p>
                <button id="btn-run-spo2-sim" onClick={handleStartSimulation} className="px-10 py-5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-95 duration-150 cursor-pointer w-full max-w-sm mx-auto">
                  เริ่มตรวจวัด SpO2 และชีพจรทันที
                </button>
              </div>
            ) : simState === 'running' ? (
              <div className="space-y-4 w-full select-none">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse text-sky-500">
                  <Sparkles className="w-4 h-4 text-sky-400" /> เลนส์เลเซอร์ทำงาน ค้นหาระดับความอิ่มตัวของออกซิเจน...
                </h3>
                <div className="py-6 space-y-4">
                  <div className="w-full max-w-md mx-auto h-3 bg-slate-150 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/55 dark:border-slate-800">
                    <div className="h-full bg-sky-500 transition-all duration-150 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-center text-sm font-semibold text-sky-500 dark:text-sky-450 animate-pulse flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> ค้นหาและคำนวณระดับความอิ่มตัวของออกซิเจนสะสม... {progress}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg sm:text-2xl font-black text-emerald-500 flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" /> สแกนออกซิเจนปลายนิ้วสำเร็จ
                </p>
                <div className="flex items-center justify-center gap-6 py-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 max-w-sm mx-auto">
                  <div className="text-center w-full">
                    <p className="text-base text-slate-550 dark:text-slate-405 font-bold uppercase tracking-wide">ปริมาณออกซิเจนในเลือด (SpO2)</p>
                    <p className="text-6xl sm:text-7xl font-mono font-black text-sky-500 mt-2 tracking-tight">
                      {spo2} <span className="text-3xl font-bold font-sans text-sky-500">%</span>
                    </p>
                  </div>
                </div>

                <button id="btn-spo2-save" onClick={saveAndReturnToDashboard} className="px-8 py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto w-full max-w-xs">
                  <CheckCircle className="w-4 h-4" /> บันทึกค่าและนำกลับหน้ารวม
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center max-w-lg w-full mx-auto">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/65 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-100 dark:border-amber-900/50">
              <Thermometer className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>

            {simState === 'idle' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">ตรวจอุณหภูมิร่างกาย (Temperature)</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">หันอินฟราเรดเซนเซอร์เข้าหาหน้าผากคนไข้ระยะ 2–5 เซนติเมตร จากนั้นกดปุ่ม "ตรวจสแกนหน้าผาก" เพื่อรับรังสีอุ่นธรรมชาติ</p>
                <button id="btn-run-temp-sim" onClick={handleStartSimulation} className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-95 duration-150 cursor-pointer max-w-sm w-full mx-auto">
                  เริ่มตรวจวัดอุณหภูมิร่างกายทันที
                </button>
              </div>
            ) : simState === 'running' ? (
              <div className="space-y-4 w-full text-center select-none">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse text-amber-500">
                  <Thermometer className="w-4 h-4 text-amber-500" /> กำลังสแกนหน้าผากและรับช่วงคลื่นความร้อนสะท้อนอินฟราเรด...
                </h3>
                <div className="w-28 h-28 mx-auto border-4 border-amber-500 rounded-full relative overflow-hidden flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 shadow-inner">
                  <div className="absolute w-full h-1 bg-amber-400 top-0 left-0 animate-bounce shadow-[0_0_8px_rgba(245,158,11,1)]" />
                  <Thermometer className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-450">กรุณาอยู่กับที่เดิมและอย่าขยับศีรษะคนไข้ช่วงเวลาสแกน...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <p className="text-lg sm:text-2xl font-black text-emerald-500 flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" /> สแกนอุณหภูมิทางหน้าผากเรียบร้อย
                </p>
                <div className="flex items-center justify-center gap-6 py-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-slate-850 p-6 max-w-sm mx-auto">
                  <div className="text-center w-full">
                    <p className="text-base text-slate-550 dark:text-slate-405 font-bold uppercase tracking-wide">อุณหภูมิร่างกาย (Temperature)</p>
                    <p className="text-6xl sm:text-7xl font-mono font-black text-amber-500 mt-2 tracking-tight">
                      {temperature} <span className="text-3xl font-bold font-sans text-amber-500">°C</span>
                    </p>
                  </div>
                </div>

                <button id="btn-temp-save" onClick={saveAndReturnToDashboard} className="px-8 py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto w-full max-w-xs">
                  <CheckCircle className="w-4 h-4" /> บันทึกค่าและนำกลับหน้ารวม
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}