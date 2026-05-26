import type { Examiner, Patient, VitalRecord } from '../types'

export const mockExaminers: Examiner[] = [
  {
    id: '1-1004-99882-12-1',
    name: 'อสม. สมหมาย รักดี',
    villageNo: 'หมู่ที่ 3 บ้านดอนกลาง',
    role: 'อสม. ชำนาญการพิเศษ',
  },
  {
    id: '1-2005-88331-54-2',
    name: 'อสม. วิชุดา นามดี',
    villageNo: 'หมู่ที่ 1 บ้านป่าแฝก',
    role: 'อสม. ประจำชุมชน',
  },
  {
    id: '1-3004-77221-99-3',
    name: 'อสม. อนันต์ รักหมู่บ้าน',
    villageNo: 'หมู่ที่ 5 บ้านหนองเกด',
    role: 'อสม. ประจำชุมชน',
  },
  {
    id: '1-4003-66112-88-4',
    name: 'อสม. สุจิตร ศรีสุข',
    villageNo: 'ชุมชนพัฒนาสุข',
    role: 'อสม. แกนนำนวัตกรรม',
  },
]

export const mockPatients: Patient[] = [
  {
    id: '3-1004-00219-51-1',
    name: 'คุณยายสมศรี อุ่นใจ',
    age: 72,
    gender: 'หญิง',
    hn: 'HN-2569-014',
    villageNo: 'หมู่ที่ 3 บ้านดอนกลาง',
  },
  {
    id: '3-4509-00123-11-2',
    name: 'นายสองเมือง รักสงบ',
    age: 58,
    gender: 'ชาย',
    hn: 'HN-2569-078',
    villageNo: 'หมู่ที่ 1 บ้านป่าแฝก',
  },
  {
    id: '3-1008-00987-44-6',
    name: 'เด็กชายกวินทร์ แสนดี',
    age: 9,
    gender: 'ชาย',
    hn: 'HN-2569-152',
    villageNo: 'หมู่ที่ 3 บ้านดอนกลาง',
  },
  {
    id: '3-8402-00561-22-3',
    name: 'นางวิภาวรรณ ชัยชนะ',
    age: 45,
    gender: 'หญิง',
    hn: 'HN-2569-041',
    villageNo: 'หมู่ที่ 5 บ้านหนองเกด',
  },
]

export const initialHistory: VitalRecord[] = [
  {
    id: 'rec-001',
    patientId: '3-1004-00219-51-1',
    patientName: 'คุณยายสมศรี อุ่นใจ',
    timestamp: '2026-05-25T09:30:00Z',
    systolic: 138,
    diastolic: 85,
    pulseRate: 76,
    spo2: 97,
    temperature: 36.8,
    triageGrade: 'WARNING',
    isSynced: true,
    notes: 'คุณยายมีอาการเวียนศีรษะเล็กน้อย แนะนำให้นอนพัก',
  },
  {
    id: 'rec-002',
    patientId: '3-4509-00123-11-2',
    patientName: 'นายสองเมือง รักสงบ',
    timestamp: '2026-05-24T08:15:00Z',
    systolic: 118,
    diastolic: 76,
    pulseRate: 68,
    spo2: 99,
    temperature: 36.4,
    triageGrade: 'NORMAL',
    isSynced: true,
    notes: 'ปกติ ร่างกายแข็งแรงดี',
  },
  {
    id: 'rec-003',
    patientId: '3-1008-00987-44-6',
    patientName: 'เด็กชายกวินทร์ แสนดี',
    timestamp: '2026-05-23T14:20:00Z',
    systolic: 122,
    diastolic: 79,
    pulseRate: 98,
    spo2: 95,
    temperature: 38.6,
    triageGrade: 'ALERT',
    isSynced: false,
    notes: 'มีไข้สูง ตัวร้อน คอแดง',
  },
]