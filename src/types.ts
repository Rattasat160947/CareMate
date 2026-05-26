export interface Patient {
  id: string
  name: string
  age: number
  gender: 'ชาย' | 'หญิง' | 'อื่นๆ'
  hn: string
  villageNo: string
}

export interface Examiner {
  id: string
  name: string
  villageNo: string
  role: string
}

export interface VitalRecord {
  id: string
  patientId: string
  patientName: string
  examinerName?: string
  timestamp: string
  systolic: number | null
  diastolic: number | null
  pulseRate: number | null
  spo2: number | null
  temperature: number | null
  triageGrade: 'NORMAL' | 'WARNING' | 'ALERT'
  notes?: string
  isSynced: boolean
}

export interface StepperState {
  currentStep: 'examiner' | 'patient' | 'blood_pressure' | 'spo2' | 'temperature' | 'summary' | 'receipt'
  activeExaminer: Examiner | null
  activePatient: Patient | null
  systolic: number | null
  diastolic: number | null
  pulseRate: number | null
  spo2: number | null
  temperature: number | null
}

export type TriageCategory = 'NORMAL' | 'WARNING' | 'ALERT'