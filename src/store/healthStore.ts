import { create } from 'zustand'
import type {
  BloodPressureRecord,
  BloodSugarRecord,
  SymptomRecord,
  DietRecord,
  ExerciseRecord,
  Medication,
  Reminder,
  FollowupRecord,
  WeeklyReport,
  FamilyMember,
  DoctorAdvice,
  HealthOverview,
  TrendDataPoint,
  RecordType
} from '@/types'
import {
  mockBloodPressureRecords,
  mockBloodSugarRecords,
  mockSymptomRecords,
  mockDietRecords,
  mockExerciseRecords,
  mockBloodPressureTrend,
  mockBloodSugarTrend,
  mockDoctorAdvices,
  mockWeeklyReports
} from '@/data/mockHealthData'
import { mockMedications, mockReminders } from '@/data/mockReminders'
import { mockFollowups } from '@/data/mockFollowups'
import { mockFamilyMembers } from '@/data/mockFamilyMembers'

interface HealthState {
  bloodPressureRecords: BloodPressureRecord[]
  bloodSugarRecords: BloodSugarRecord[]
  symptomRecords: SymptomRecord[]
  dietRecords: DietRecord[]
  exerciseRecords: ExerciseRecord[]
  medications: Medication[]
  reminders: Reminder[]
  followups: FollowupRecord[]
  weeklyReports: WeeklyReport[]
  familyMembers: FamilyMember[]
  doctorAdvices: DoctorAdvice[]
  bloodPressureTrend: TrendDataPoint[]
  bloodSugarTrend: TrendDataPoint[]
  currentMemberId: string
  recordInitialTab: RecordType | null

  setCurrentMember: (id: string) => void
  setRecordInitialTab: (tab: RecordType | null) => void

  currentBloodPressureRecords: () => BloodPressureRecord[]
  currentBloodSugarRecords: () => BloodSugarRecord[]
  currentSymptomRecords: () => SymptomRecord[]
  currentDietRecords: () => DietRecord[]
  currentExerciseRecords: () => ExerciseRecord[]
  currentMedications: () => Medication[]
  currentReminders: () => Reminder[]
  currentFollowups: () => FollowupRecord[]
  currentWeeklyReports: () => WeeklyReport[]
  currentDoctorAdvices: () => DoctorAdvice[]

  addBloodPressure: (record: Omit<BloodPressureRecord, 'id' | 'memberId'>) => void
  addBloodSugar: (record: Omit<BloodSugarRecord, 'id' | 'memberId'>) => void
  addSymptom: (record: Omit<SymptomRecord, 'id' | 'memberId'>) => void
  addDiet: (record: Omit<DietRecord, 'id' | 'memberId'>) => void
  addExercise: (record: Omit<ExerciseRecord, 'id' | 'memberId'>) => void
  addReminder: (record: Omit<Reminder, 'id' | 'memberId'>) => void
  addMedication: (record: Omit<Medication, 'id' | 'memberId'>) => void
  submitFollowup: (id: string, answers: Record<string, string | string[]>) => void
  toggleReminder: (id: string) => void
  toggleMedicationReminder: (id: string) => void
  deleteMedication: (id: string) => void
  deleteBloodPressure: (id: string) => void
  deleteBloodSugar: (id: string) => void
  getHealthOverview: () => HealthOverview
}

export const useHealthStore = create<HealthState>((set, get) => ({
  bloodPressureRecords: mockBloodPressureRecords,
  bloodSugarRecords: mockBloodSugarRecords,
  symptomRecords: mockSymptomRecords,
  dietRecords: mockDietRecords,
  exerciseRecords: mockExerciseRecords,
  medications: mockMedications,
  reminders: mockReminders,
  followups: mockFollowups,
  weeklyReports: mockWeeklyReports,
  familyMembers: mockFamilyMembers,
  doctorAdvices: mockDoctorAdvices,
  bloodPressureTrend: mockBloodPressureTrend,
  bloodSugarTrend: mockBloodSugarTrend,
  currentMemberId: 'm1',
  recordInitialTab: null,

  setCurrentMember: (id) => {
    set({ currentMemberId: id })
    console.log('[HealthStore] 切换当前成员', id)
  },

  setRecordInitialTab: (tab) => set({ recordInitialTab: tab }),

  currentBloodPressureRecords: () => {
    const { bloodPressureRecords, currentMemberId } = get()
    return bloodPressureRecords.filter((r) => r.memberId === currentMemberId)
  },

  currentBloodSugarRecords: () => {
    const { bloodSugarRecords, currentMemberId } = get()
    return bloodSugarRecords.filter((r) => r.memberId === currentMemberId)
  },

  currentSymptomRecords: () => {
    const { symptomRecords, currentMemberId } = get()
    return symptomRecords.filter((r) => r.memberId === currentMemberId)
  },

  currentDietRecords: () => {
    const { dietRecords, currentMemberId } = get()
    return dietRecords.filter((r) => r.memberId === currentMemberId)
  },

  currentExerciseRecords: () => {
    const { exerciseRecords, currentMemberId } = get()
    return exerciseRecords.filter((r) => r.memberId === currentMemberId)
  },

  currentMedications: () => {
    const { medications, currentMemberId } = get()
    return medications.filter((m) => m.memberId === currentMemberId)
  },

  currentReminders: () => {
    const { reminders, currentMemberId } = get()
    return reminders.filter((r) => r.memberId === currentMemberId)
  },

  currentFollowups: () => {
    const { followups, currentMemberId } = get()
    return followups.filter((f) => f.memberId === currentMemberId)
  },

  currentWeeklyReports: () => {
    const { weeklyReports, currentMemberId } = get()
    return weeklyReports.filter((w) => w.memberId === currentMemberId)
  },

  currentDoctorAdvices: () => {
    const { doctorAdvices, currentMemberId } = get()
    return doctorAdvices.filter((d) => d.memberId === currentMemberId)
  },

  addBloodPressure: (record) => {
    const newRecord: BloodPressureRecord = {
      ...record,
      id: `bp_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      bloodPressureRecords: [newRecord, ...state.bloodPressureRecords]
    }))
    console.log('[HealthStore] 新增血压记录', newRecord)
  },

  addBloodSugar: (record) => {
    const newRecord: BloodSugarRecord = {
      ...record,
      id: `bs_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      bloodSugarRecords: [newRecord, ...state.bloodSugarRecords]
    }))
    console.log('[HealthStore] 新增血糖记录', newRecord)
  },

  addSymptom: (record) => {
    const newRecord: SymptomRecord = {
      ...record,
      id: `sym_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      symptomRecords: [newRecord, ...state.symptomRecords]
    }))
    console.log('[HealthStore] 新增症状记录', newRecord)
  },

  addDiet: (record) => {
    const newRecord: DietRecord = {
      ...record,
      id: `diet_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      dietRecords: [newRecord, ...state.dietRecords]
    }))
    console.log('[HealthStore] 新增饮食记录', newRecord)
  },

  addExercise: (record) => {
    const newRecord: ExerciseRecord = {
      ...record,
      id: `ex_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      exerciseRecords: [newRecord, ...state.exerciseRecords]
    }))
    console.log('[HealthStore] 新增运动记录', newRecord)
  },

  addReminder: (record) => {
    const newRecord: Reminder = {
      ...record,
      id: `rem_${Date.now()}`,
      memberId: get().currentMemberId
    }
    set((state) => ({
      reminders: [...state.reminders, newRecord].sort((a, b) => a.time.localeCompare(b.time))
    }))
    console.log('[HealthStore] 新增提醒', newRecord)
  },

  addMedication: (record) => {
    const newId = `med_${Date.now()}`
    const memberId = get().currentMemberId
    const newMed: Medication = {
      ...record,
      id: newId,
      memberId
    }

    const newReminders: Reminder[] = []
    if (record.reminder && record.times && record.times.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      record.times.forEach((time, index) => {
        newReminders.push({
          id: `rem_${Date.now()}_${index}`,
          memberId,
          type: 'medication',
          title: `${record.name} ${record.dosage}`,
          time: `${today} ${time}`,
          completed: false,
          relatedId: newId,
          note: record.note ? `剂量：${record.dosage}` : undefined
        })
      })
    }

    set((state) => ({
      medications: [...state.medications, newMed],
      reminders: [...state.reminders, ...newReminders].sort((a, b) => a.time.localeCompare(b.time))
    }))

    console.log('[HealthStore] 新增用药', newMed.name, '及', newReminders.length, '条提醒')
  },

  submitFollowup: (id, answers) => {
    set((state) => ({
      followups: state.followups.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'completed',
              completedDate: new Date().toISOString().split('T')[0],
              answers
            }
          : f
      )
    }))
    const followup = get().followups.find((f) => f.id === id)
    console.log('[HealthStore] 提交随访问卷', id, followup?.status)
  },

  toggleReminder: (id) => {
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    }))
    const reminder = get().reminders.find((r) => r.id === id)
    console.log('[HealthStore] 切换提醒状态', id, reminder?.completed)
  },

  toggleMedicationReminder: (id) => {
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? { ...m, reminder: !m.reminder } : m
      )
    }))
    const med = get().medications.find((m) => m.id === id)
    console.log('[HealthStore] 切换用药提醒开关', id, med?.reminder)
  },

  deleteMedication: (id) => {
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
      reminders: state.reminders.filter((r) => r.relatedId !== id)
    }))
    console.log('[HealthStore] 删除用药', id)
  },

  deleteBloodPressure: (id) => {
    set((state) => ({
      bloodPressureRecords: state.bloodPressureRecords.filter((r) => r.id !== id)
    }))
    console.log('[HealthStore] 删除血压记录', id)
  },

  deleteBloodSugar: (id) => {
    set((state) => ({
      bloodSugarRecords: state.bloodSugarRecords.filter((r) => r.id !== id)
    }))
    console.log('[HealthStore] 删除血糖记录', id)
  },

  getHealthOverview: () => {
    const {
      currentBloodPressureRecords,
      currentBloodSugarRecords,
      currentSymptomRecords,
      currentDietRecords,
      currentExerciseRecords,
      currentReminders,
      currentMedications,
      currentDoctorAdvices
    } = get()

    const bpRecords = currentBloodPressureRecords()
    const bsRecords = currentBloodSugarRecords()
    const symRecords = currentSymptomRecords()
    const dietRecords = currentDietRecords()
    const exRecords = currentExerciseRecords()
    const reminderList = currentReminders()
    const meds = currentMedications()
    const advices = currentDoctorAdvices()

    const today = new Date().toISOString().split('T')[0]
    const isToday = (time: string) => time.startsWith(today)

    const todayRecords = [
      ...bpRecords.filter((r) => isToday(r.time)),
      ...bsRecords.filter((r) => isToday(r.time)),
      ...symRecords.filter((r) => isToday(r.time)),
      ...dietRecords.filter((r) => isToday(r.time)),
      ...exRecords.filter((r) => isToday(r.time))
    ].length

    const pendingReminders = reminderList.filter((r) => isToday(r.time) && !r.completed).length

    const abnormalCount = [
      ...bpRecords.filter((r) => r.status !== 'normal'),
      ...bsRecords.filter((r) => r.status !== 'normal')
    ].length

    const nextVisit = advices.find((a) => a.nextVisit)?.nextVisit

    const todayMedReminders = reminderList.filter(
      (r) => r.type === 'medication' && isToday(r.time)
    )
    const medicationTaken = todayMedReminders.filter((r) => r.completed).length
    const medicationTotal = todayMedReminders.length || meds.reduce((sum, m) => sum + m.times.length, 0)

    return {
      todayRecords,
      pendingReminders,
      abnormalCount,
      nextVisit,
      medicationTaken,
      medicationTotal
    }
  }
}))
