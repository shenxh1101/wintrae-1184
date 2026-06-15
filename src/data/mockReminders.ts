import type { Reminder, Medication } from '@/types'

export const mockMedications: Medication[] = [
  {
    id: 'med1',
    name: '硝苯地平缓释片',
    dosage: '20mg',
    times: ['08:00', '20:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '降压药，饭后服用',
    memberId: 'm1'
  },
  {
    id: 'med2',
    name: '二甲双胍',
    dosage: '500mg',
    times: ['08:00', '12:00', '18:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '降糖药，饭前服用',
    memberId: 'm1'
  },
  {
    id: 'med3',
    name: '阿司匹林肠溶片',
    dosage: '100mg',
    times: ['08:00'],
    reminder: true,
    startDate: '2026-01-01',
    note: '抗血小板，饭后服用',
    memberId: 'm1'
  },
  {
    id: 'med4',
    name: '硝酸甘油',
    dosage: '0.5mg',
    times: [],
    reminder: false,
    startDate: '2026-01-01',
    note: '急救药，胸闷时舌下含服',
    memberId: 'm2'
  }
]

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    memberId: 'm1',
    type: 'medication',
    title: '硝苯地平缓释片 20mg',
    time: '2026-06-15 08:00',
    completed: true,
    relatedId: 'med1'
  },
  {
    id: 'rem2',
    memberId: 'm1',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 08:00',
    completed: true,
    relatedId: 'med2'
  },
  {
    id: 'rem3',
    memberId: 'm1',
    type: 'medication',
    title: '阿司匹林肠溶片 100mg',
    time: '2026-06-15 08:00',
    completed: false,
    relatedId: 'med3'
  },
  {
    id: 'rem4',
    memberId: 'm1',
    type: 'measure',
    title: '测量血压（早）',
    time: '2026-06-15 08:00',
    completed: true
  },
  {
    id: 'rem_measure_bs_fasting',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（空腹）',
    time: '2026-06-15 07:30',
    completed: true
  },
  {
    id: 'rem_measure_bs_afterBreakfast',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（早餐后）',
    time: '2026-06-15 09:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_afterLunch',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（午餐后）',
    time: '2026-06-15 13:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_beforeSleep',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（睡前）',
    time: '2026-06-15 22:00',
    completed: false
  },
  {
    id: 'rem6',
    memberId: 'm1',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 12:00',
    completed: false,
    relatedId: 'med2'
  },
  {
    id: 'rem7',
    memberId: 'm1',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 18:00',
    completed: false,
    relatedId: 'med2'
  },
  {
    id: 'rem8',
    memberId: 'm1',
    type: 'medication',
    title: '硝苯地平缓释片 20mg',
    time: '2026-06-15 20:00',
    completed: false,
    relatedId: 'med1'
  },
  {
    id: 'rem9',
    memberId: 'm1',
    type: 'measure',
    title: '测量血压（晚）',
    time: '2026-06-15 20:00',
    completed: false
  },
  {
    id: 'rem10',
    memberId: 'm1',
    type: 'revisit',
    title: '复诊提醒 - 心内科',
    time: '2026-06-20 09:00',
    completed: false,
    note: '市第一人民医院，张医生'
  },
  {
    id: 'rem11',
    memberId: 'm1',
    type: 'followup',
    title: '月度随访问卷',
    time: '2026-06-16 10:00',
    completed: false
  },
  {
    id: 'rem12',
    memberId: 'm2',
    type: 'revisit',
    title: '复诊提醒 - 内分泌科',
    time: '2026-06-18 14:00',
    completed: false,
    note: '市中医院，李医生'
  },
  {
    id: 'rem13',
    memberId: 'm2',
    type: 'medication',
    title: '二甲双胍 500mg',
    time: '2026-06-15 08:00',
    completed: false,
    relatedId: 'med2'
  },
  {
    id: 'rem_measure_bp_m2_morning',
    memberId: 'm2',
    type: 'measure',
    title: '测量血压（早）',
    time: '2026-06-15 08:00',
    completed: false
  },
  {
    id: 'rem_measure_bp_m2_night',
    memberId: 'm2',
    type: 'measure',
    title: '测量血压（晚）',
    time: '2026-06-15 20:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_fasting',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（空腹）',
    time: '2026-06-15 07:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_afterBreakfast',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（早餐后）',
    time: '2026-06-15 09:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_afterLunch',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（午餐后）',
    time: '2026-06-15 13:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_beforeSleep',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（睡前）',
    time: '2026-06-15 22:00',
    completed: false
  },
  {
    id: 'rem_measure_bp_m1_morning_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血压（早）',
    time: '2026-06-16 08:00',
    completed: false
  },
  {
    id: 'rem_measure_bp_m1_night_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血压（晚）',
    time: '2026-06-16 20:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m1_fasting_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（空腹）',
    time: '2026-06-16 07:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m1_afterBreakfast_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（早餐后）',
    time: '2026-06-16 09:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m1_afterLunch_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（午餐后）',
    time: '2026-06-16 13:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m1_beforeSleep_tomorrow',
    memberId: 'm1',
    type: 'measure',
    title: '测量血糖（睡前）',
    time: '2026-06-16 22:00',
    completed: false
  },
  {
    id: 'rem_measure_bp_m2_morning_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血压（早）',
    time: '2026-06-16 08:00',
    completed: false
  },
  {
    id: 'rem_measure_bp_m2_night_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血压（晚）',
    time: '2026-06-16 20:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_fasting_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（空腹）',
    time: '2026-06-16 07:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_afterBreakfast_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（早餐后）',
    time: '2026-06-16 09:30',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_afterLunch_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（午餐后）',
    time: '2026-06-16 13:00',
    completed: false
  },
  {
    id: 'rem_measure_bs_m2_beforeSleep_tomorrow',
    memberId: 'm2',
    type: 'measure',
    title: '测量血糖（睡前）',
    time: '2026-06-16 22:00',
    completed: false
  }
]
