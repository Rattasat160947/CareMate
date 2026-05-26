import { useEffect, useState } from 'react'
import { Activity, Battery, HeartHandshake, History, Volume2, VolumeX, Wifi } from 'lucide-react'
import ExaminerSelector from './components/ExaminerSelector'
import HistoryLogs from './components/HistoryLogs'
import MeasurementSteps from './components/MeasurementSteps'
import PatientSelector from './components/PatientSelector'
import ReceiptScreen from './components/ReceiptScreen'
import TriageDashboard from './components/TriageDashboard'
import { initialHistory, mockPatients } from './data/patients'
import { playTapSound, setAudioEnabled } from './utils/audio'
import type { Examiner, Patient, StepperState, TriageCategory, VitalRecord } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'history'>('triage')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [audioFeedback, setAudioFeedback] = useState(true)
  const [records, setRecords] = useState<VitalRecord[]>(initialHistory)
  const [stepper, setStepper] = useState<StepperState>({
    currentStep: 'examiner',
    activeExaminer: null,
    activePatient: null,
    systolic: null,
    diastolic: null,
    pulseRate: null,
    spo2: null,
    temperature: null,
  })
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const handleSelectExaminer = (examiner: Examiner) => {
    setStepper((prev) => ({
      ...prev,
      activeExaminer: examiner,
      currentStep: 'patient',
    }))
  }

  const handleSelectPatient = (patient: Patient) => {
    setStepper((prev) => ({
      ...prev,
      activePatient: patient,
      currentStep: 'blood_pressure',
    }))
  }

  const handleFinishMeasurements = (vitals: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
  }) => {
    setStepper((prev) => ({
      ...prev,
      systolic: vitals.systolic,
      diastolic: vitals.diastolic,
      pulseRate: vitals.pulseRate,
      spo2: vitals.spo2,
      temperature: vitals.temperature,
      currentStep: 'summary',
    }))
  }

  const handleCancelMeasurements = () => {
    setStepper((prev) => ({
      ...prev,
      currentStep: 'patient',
      activePatient: null,
      systolic: null,
      diastolic: null,
      pulseRate: null,
      spo2: null,
      temperature: null,
    }))
  }

  const handleSaveAndTransmit = (recordData: {
    systolic: number | null
    diastolic: number | null
    pulseRate: number | null
    spo2: number | null
    temperature: number | null
    triageGrade: TriageCategory
  }) => {
    if (!stepper.activePatient) return

    const newRecord: VitalRecord = {
      id: `rec-${Math.floor(Math.random() * 90000) + 10000}`,
      patientId: stepper.activePatient.id,
      patientName: stepper.activePatient.name,
      examinerName: stepper.activeExaminer?.name || 'อสม. ยังไม่ได้ระบุในระบบ',
      timestamp: new Date().toISOString(),
      systolic: recordData.systolic,
      diastolic: recordData.diastolic,
      pulseRate: recordData.pulseRate,
      spo2: recordData.spo2,
      temperature: recordData.temperature,
      triageGrade: recordData.triageGrade,
      notes:
        recordData.triageGrade === 'ALERT'
          ? 'พบภาวะชีพจรสุ่มเสี่ยงสูง ส่งเรื่องรายงานแพทย์ รพ.สต. เพื่อดูแลใกล้ชิด'
          : recordData.triageGrade === 'WARNING'
            ? 'เฝ้าระวังอาการชั่วคราว นัดติดตามใน 15 นาที'
            : 'ร่างกายแข็งแรง ชีพจรสมดุลดี',
      isSynced: true,
    }

    setRecords((prev) => [newRecord, ...prev])
    setStepper((prev) => ({ ...prev, currentStep: 'receipt' }))
  }

  const handleFinishReceiptFlow = () => {
    setStepper((prev) => ({
      ...prev,
      currentStep: 'patient',
      activePatient: null,
      systolic: null,
      diastolic: null,
      pulseRate: null,
      spo2: null,
      temperature: null,
    }))
  }

  const handleStartNewMeasurement = (patientId: string, patientName: string) => {
    let patient = mockPatients.find((item) => item.id === patientId)
    if (!patient) {
      patient = {
        id: patientId,
        hn: patientId.replace('rec-', '').slice(0, 6),
        name: patientName,
        age: 50,
        gender: 'ชาย',
        villageNo: 'หมู่ 2',
      }
    }

    setStepper((prev) => ({
      ...prev,
      activePatient: patient || null,
      currentStep: 'blood_pressure',
      systolic: null,
      diastolic: null,
      pulseRate: null,
      spo2: null,
      temperature: null,
    }))
    setActiveTab('triage')
  }

  const handleClearAllLogs = () => {
    setRecords([])
  }

  const handleTabSwitch = (tab: 'triage' | 'history') => {
    playTapSound()
    setActiveTab(tab)
  }

  const toggleSettingsAudio = () => {
    playTapSound()
    const nextVal = !audioFeedback
    setAudioFeedback(nextVal)
    setAudioEnabled(nextVal)
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col justify-between`}>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-sm shadow-sky-400/20">
            <HeartHandshake className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              ระบบตรวจคัดกรอง อสม. Smart Monitor <span>TH</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) บ้านดอนกลาง • เขตภาคเหนือที่ 1</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs select-none">
          <div className="flex items-center gap-1 text-emerald-500">
            <Wifi className="w-4 h-4" />
            <span className="font-semibold text-[10px] tracking-wider font-mono">5G CONNECTED</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Battery className="w-4.5 h-4.5" />
            <span className="font-bold text-[10px] font-mono">100%</span>
          </div>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />
          <button
            id="btn-quick-sound-toggle"
            onClick={toggleSettingsAudio}
            title={audioFeedback ? 'กดเพื่อปิดเสียงปิ๊บสัมผัสปุ่ม' : 'กดเพื่อเปิดเสียงปิ๊บสัมผัสปุ่ม'}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {audioFeedback ? <Volume2 className="w-4 h-4 text-sky-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-slate-800 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold text-slate-750 dark:text-slate-300">
            {currentTime || '--:--:--'}
          </div>
        </div>
      </header>

      <main className="grow max-w-7xl w-full mx-auto px-6 py-6 transition-all duration-300">
        <div className="flex gap-2.5 mb-7 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-850 shadow-xs max-w-sm mx-auto select-none">
          <button
            id="tab-triage-station"
            onClick={() => handleTabSwitch('triage')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'triage' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-950/40'}`}
          >
            <Activity className="w-4 h-4" />
            ทำการตรวจวัด
          </button>
          <button
            id="tab-history-logs"
            onClick={() => handleTabSwitch('history')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-950/40'}`}
          >
            <History className="w-4 h-4" />
            รายการตรวจทั้งหมด
          </button>
        </div>

        <div className="animate-fade-in duration-300">
          {activeTab === 'triage' && (
            <>
              {stepper.currentStep === 'examiner' && <ExaminerSelector onSelect={handleSelectExaminer} accentColor="bg-sky-500" />}

              {stepper.currentStep === 'patient' && (
                <PatientSelector
                  onSelect={handleSelectPatient}
                  activeExaminerName={stepper.activeExaminer?.name}
                  onBack={() => {
                    playTapSound()
                    setStepper((prev) => ({
                      ...prev,
                      currentStep: 'examiner',
                      activePatient: null,
                    }))
                  }}
                  accentColor="bg-sky-500"
                />
              )}

              {(stepper.currentStep === 'blood_pressure' || stepper.currentStep === 'spo2' || stepper.currentStep === 'temperature') && stepper.activePatient && (
                <MeasurementSteps patient={stepper.activePatient} onCancel={handleCancelMeasurements} onCompleted={handleFinishMeasurements} accentColor="sky" />
              )}

              {stepper.currentStep === 'summary' && stepper.activePatient && (
                <TriageDashboard
                  patient={stepper.activePatient}
                  initialData={{
                    systolic: stepper.systolic,
                    diastolic: stepper.diastolic,
                    pulseRate: stepper.pulseRate,
                    spo2: stepper.spo2,
                    temperature: stepper.temperature,
                  }}
                  onBack={handleCancelMeasurements}
                  onSave={handleSaveAndTransmit}
                  accentColor="sky"
                />
              )}

              {stepper.currentStep === 'receipt' && stepper.activePatient && <ReceiptScreen patient={stepper.activePatient} record={records[0]} onDone={handleFinishReceiptFlow} />}
            </>
          )}

          {activeTab === 'history' && <HistoryLogs logs={records} onStartNewMeasurement={handleStartNewMeasurement} onClearAllLogs={handleClearAllLogs} accentColor="sky" />}
        </div>
      </main>
    </div>
  )
}