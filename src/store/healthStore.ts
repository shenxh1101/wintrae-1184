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
  TrendDataPoint
} from '@/types'
import {
  mockBloodPressureRecords,
  mockBloodSugarRecords,
  mockSymptomRecords,
  mockDietRecords,
  mockExerciseRecords,
  mockHealthOverview,
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
  healthOverview: HealthOverview
  bloodPressureTrend: TrendDataPoint[]
  bloodSugarTrend: TrendDataPoint[]
  currentMemberId: string
  addBloodPressure: (record: Omit<BloodPressureRecord, 'id'>) => void
  addBloodSugar: (record: Omit<BloodSugarRecord, 'id'>) => void
  addSymptom: (record: Omit<SymptomRecord, 'id'>) => void
  addDiet: (record: Omit<DietRecord, 'id'>) => void
  addExercise: (record: Omit<ExerciseRecord, 'id'>) => void
  toggleReminder: (id: string) => void
  setCurrentMember: (id: string) => void
  deleteBloodPressure: (id: string) => void
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
  healthOverview: mockHealthOverview,
  bloodPressureTrend: mockBloodPressureTrend,
  bloodSugarTrend: mockBloodSugarTrend,
  currentMemberId: 'm1',

  addBloodPressure: (record) => {
    const newRecord: BloodPressureRecord = {
      ...record,
      id: `bp_${Date.now()}`
    }
    set((state) => ({
      bloodPressureRecords: [newRecord, ...state.bloodPressureRecords]
    }))
    console.log('[HealthStore] 新增血压记录', newRecord)
  },

  addBloodSugar: (record) => {
    const newRecord: BloodSugarRecord = {
      ...record,
      id: `bs_${Date.now()}`
    }
    set((state) => ({
      bloodSugarRecords: [newRecord, ...state.bloodSugarRecords]
    }))
    console.log('[HealthStore] 新增血糖记录', newRecord)
  },

  addSymptom: (record) => {
    const newRecord: SymptomRecord = {
      ...record,
      id: `sym_${Date.now()}`
    }
    set((state) => ({
      symptomRecords: [newRecord, ...state.symptomRecords]
    }))
    console.log('[HealthStore] 新增症状记录', newRecord)
  },

  addDiet: (record) => {
    const newRecord: DietRecord = {
      ...record,
      id: `diet_${Date.now()}`
    }
    set((state) => ({
      dietRecords: [newRecord, ...state.dietRecords]
    }))
    console.log('[HealthStore] 新增饮食记录', newRecord)
  },

  addExercise: (record) => {
    const newRecord: ExerciseRecord = {
      ...record,
      id: `ex_${Date.now()}`
    }
    set((state) => ({
      exerciseRecords: [newRecord, ...state.exerciseRecords]
    }))
    console.log('[HealthStore] 新增运动记录', newRecord)
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

  setCurrentMember: (id) => {
    set({ currentMemberId: id })
    console.log('[HealthStore] 切换当前成员', id)
  },

  deleteBloodPressure: (id) => {
    set((state) => ({
      bloodPressureRecords: state.bloodPressureRecords.filter((r) => r.id !== id)
    }))
    console.log('[HealthStore] 删除血压记录', id)
  }
}))
