import type { Reminder, Medication } from '@/types'

export const mockMedications: Medication[] = [
  {
    id: 'med1',
    name: '硝苯地平缓释片',
    dosage: '20mg',
    times: ['08:00', '20:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '降压药，饭后服用'
  },
  {
    id: 'med2',
    name: '二甲双胍',
    dosage: '500mg',
    times: ['08:00', '12:00', '18:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '降糖药，饭前服用'
  },
  {
    id: 'med3',
    name: '阿司匹林肠溶片',
    dosage: '100mg',
    times: ['08:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '抗血小板，饭后服用'
  },
  {
    id: 'med4',
    name: '硝酸甘油',
    dosage: '0.5mg',
    times: [],
    reminder: false,
    startDate: '2026-01-01',
    note: '急救药，胸闷时舌下含服'
  }
]

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    type: 'medication',
    title: '硝苯地平缓释片 20mg',
    time: '2026-06-15 08:00',
    completed: true,
    relatedId: 'med1'
  },
  {
    id: 'rem2',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 08:00',
    completed: true,
    relatedId: 'med2'
  },
  {
    id: 'rem3',
    type: 'medication',
    title: '阿司匹林肠溶片 100mg',
    time: '2026-06-15 08:00',
    completed: false,
    relatedId: 'med3'
  },
  {
    id: 'rem4',
    type: 'measure',
    title: '测量血压',
    time: '2026-06-15 08:00',
    completed: true
  },
  {
    id: 'rem5',
    type: 'measure',
    title: '测量血糖（空腹）',
    time: '2026-06-15 07:30',
    completed: true
  },
  {
    id: 'rem6',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 12:00',
    completed: false,
    relatedId: 'med2'
  },
  {
    id: 'rem7',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 18:00',
    completed: false,
    relatedId: 'med2'
  },
  {
    id: 'rem8',
    type: 'medication',
    title: '硝苯地平缓释片 20mg',
    time: '2026-06-15 20:00',
    completed: false,
    relatedId: 'med1'
  },
  {
    id: 'rem9',
    type: 'measure',
    title: '测量血压',
    time: '2026-06-15 20:00',
    completed: false
  },
  {
    id: 'rem10',
    type: 'revisit',
    title: '复诊提醒 - 心内科',
    time: '2026-06-20 09:00',
    completed: false,
    note: '市第一人民医院，张医生'
  },
  {
    id: 'rem11',
    type: 'followup',
    title: '月度随访问卷',
    time: '2026-06-16 10:00',
    completed: false
  }
]
