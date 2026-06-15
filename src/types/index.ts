export type HealthStatus = 'normal' | 'warning' | 'danger'

export type RecordType = 'bloodPressure' | 'bloodSugar' | 'symptom' | 'diet' | 'exercise'

export type ReminderType = 'medication' | 'measure' | 'followup' | 'revisit'

export type FamilyRole = 'patient' | 'spouse' | 'child' | 'parent' | 'other'

export interface BloodPressureRecord {
  id: string
  memberId: string
  systolic: number
  diastolic: number
  heartRate?: number
  time: string
  status: HealthStatus
  note?: string
}

export interface BloodSugarRecord {
  id: string
  memberId: string
  value: number
  period: 'fasting' | 'beforeMeal' | 'afterMeal' | 'beforeSleep'
  time: string
  status: HealthStatus
  note?: string
}

export interface SymptomRecord {
  id: string
  memberId: string
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  time: string
  note?: string
}

export interface DietRecord {
  id: string
  memberId: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  content: string
  time: string
}

export interface ExerciseRecord {
  id: string
  memberId: string
  type: string
  duration: number
  intensity: 'light' | 'moderate' | 'vigorous'
  time: string
  note?: string
}

export interface Medication {
  id: string
  memberId: string
  name: string
  dosage: string
  times: string[]
  reminder: boolean
  startDate: string
  endDate?: string
  note?: string
}

export interface Reminder {
  id: string
  memberId: string
  type: ReminderType
  title: string
  time: string
  completed: boolean
  relatedId?: string
  note?: string
}

export interface FollowupQuestion {
  id: string
  question: string
  type: 'single' | 'multiple' | 'text' | 'number'
  options?: string[]
  required: boolean
}

export interface FollowupRecord {
  id: string
  memberId: string
  title: string
  date: string
  status: 'pending' | 'completed' | 'expired'
  completedDate?: string
  questions: FollowupQuestion[]
  answers?: Record<string, string | string[]>
  doctorAdvice?: string
}

export interface WeeklyReport {
  id: string
  memberId: string
  weekStart: string
  weekEnd: string
  bloodPressureAvg: { systolic: number; diastolic: number }
  bloodSugarAvg: number
  abnormalCount: number
  medicationCompliance: number
  symptoms: string[]
  summary: string
}

export interface FamilyMember {
  id: string
  name: string
  role: FamilyRole
  avatar?: string
  phone: string
  isEmergency: boolean
  relation: string
}

export interface DoctorAdvice {
  id: string
  memberId: string
  doctorName: string
  hospital: string
  date: string
  content: string
  nextVisit?: string
}

export interface HealthOverview {
  todayRecords: number
  pendingReminders: number
  abnormalCount: number
  nextVisit?: string
  medicationTaken: number
  medicationTotal: number
}

export interface TrendDataPoint {
  date: string
  value: number
  value2?: number
}
