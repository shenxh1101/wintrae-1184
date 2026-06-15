import type {
  BloodPressureRecord,
  BloodSugarRecord,
  SymptomRecord,
  DietRecord,
  ExerciseRecord,
  HealthOverview,
  TrendDataPoint,
  DoctorAdvice,
  WeeklyReport
} from '@/types'

export const mockBloodPressureRecords: BloodPressureRecord[] = [
  { id: 'bp1', systolic: 135, diastolic: 85, heartRate: 72, time: '2026-06-15 08:00', status: 'warning', note: '晨起测量' },
  { id: 'bp2', systolic: 128, diastolic: 82, heartRate: 70, time: '2026-06-14 20:00', status: 'normal' },
  { id: 'bp3', systolic: 145, diastolic: 92, heartRate: 78, time: '2026-06-14 08:30', status: 'danger', note: '有点头晕' },
  { id: 'bp4', systolic: 130, diastolic: 84, heartRate: 71, time: '2026-06-13 19:30', status: 'normal' },
  { id: 'bp5', systolic: 125, diastolic: 80, heartRate: 68, time: '2026-06-13 08:00', status: 'normal' },
  { id: 'bp6', systolic: 138, diastolic: 88, heartRate: 74, time: '2026-06-12 20:00', status: 'warning' },
  { id: 'bp7', systolic: 132, diastolic: 86, heartRate: 73, time: '2026-06-12 08:00', status: 'warning' },
  { id: 'bp8', systolic: 128, diastolic: 82, heartRate: 70, time: '2026-06-11 19:30', status: 'normal' },
  { id: 'bp9', systolic: 142, diastolic: 90, heartRate: 76, time: '2026-06-11 08:00', status: 'danger' },
  { id: 'bp10', systolic: 130, diastolic: 83, heartRate: 72, time: '2026-06-10 20:00', status: 'normal' }
]

export const mockBloodSugarRecords: BloodSugarRecord[] = [
  { id: 'bs1', value: 6.8, period: 'fasting', time: '2026-06-15 07:30', status: 'normal', note: '空腹' },
  { id: 'bs2', value: 8.5, period: 'afterMeal', time: '2026-06-14 13:30', status: 'warning', note: '饭后2小时' },
  { id: 'bs3', value: 6.2, period: 'fasting', time: '2026-06-14 07:30', status: 'normal' },
  { id: 'bs4', value: 7.8, period: 'afterMeal', time: '2026-06-13 13:30', status: 'normal' },
  { id: 'bs5', value: 6.5, period: 'fasting', time: '2026-06-13 07:30', status: 'normal' },
  { id: 'bs6', value: 9.2, period: 'afterMeal', time: '2026-06-12 13:30', status: 'danger', note: '吃了甜点' },
  { id: 'bs7', value: 6.8, period: 'fasting', time: '2026-06-12 07:30', status: 'normal' },
  { id: 'bs8', value: 7.2, period: 'afterMeal', time: '2026-06-11 13:30', status: 'normal' },
  { id: 'bs9', value: 6.3, period: 'fasting', time: '2026-06-11 07:30', status: 'normal' },
  { id: 'bs10', value: 8.8, period: 'beforeSleep', time: '2026-06-10 22:00', status: 'warning' }
]

export const mockSymptomRecords: SymptomRecord[] = [
  { id: 'sym1', symptoms: ['头晕', '乏力'], severity: 'mild', time: '2026-06-15 09:00', note: '持续约半小时' },
  { id: 'sym2', symptoms: ['头痛'], severity: 'moderate', time: '2026-06-14 15:00' },
  { id: 'sym3', symptoms: ['胸闷'], severity: 'severe', time: '2026-06-13 10:00', note: '已含服硝酸甘油' },
  { id: 'sym4', symptoms: ['失眠'], severity: 'mild', time: '2026-06-12 23:00' },
  { id: 'sym5', symptoms: ['食欲不振', '恶心'], severity: 'mild', time: '2026-06-11 12:00' }
]

export const mockDietRecords: DietRecord[] = [
  { id: 'diet1', mealType: 'breakfast', content: '燕麦粥、煮鸡蛋、凉拌黄瓜', time: '2026-06-15 07:00' },
  { id: 'diet2', mealType: 'lunch', content: '糙米饭、清蒸鱼、炒青菜、番茄蛋汤', time: '2026-06-15 12:00' },
  { id: 'diet3', mealType: 'dinner', content: '小米粥、馒头、炒豆角', time: '2026-06-14 18:00' },
  { id: 'diet4', mealType: 'breakfast', content: '豆浆、包子、小番茄', time: '2026-06-14 07:00' },
  { id: 'diet5', mealType: 'lunch', content: '杂粮饭、鸡胸肉沙拉、紫菜汤', time: '2026-06-13 12:00' }
]

export const mockExerciseRecords: ExerciseRecord[] = [
  { id: 'ex1', type: '散步', duration: 30, intensity: 'light', time: '2026-06-15 18:30', note: '饭后散步' },
  { id: 'ex2', type: '太极拳', duration: 45, intensity: 'moderate', time: '2026-06-14 07:00' },
  { id: 'ex3', type: '散步', duration: 20, intensity: 'light', time: '2026-06-13 18:30' },
  { id: 'ex4', type: '健身操', duration: 30, intensity: 'moderate', time: '2026-06-12 10:00' },
  { id: 'ex5', type: '散步', duration: 40, intensity: 'light', time: '2026-06-11 18:30' }
]

export const mockHealthOverview: HealthOverview = {
  todayRecords: 3,
  pendingReminders: 2,
  abnormalCount: 1,
  nextVisit: '2026-06-20',
  medicationTaken: 2,
  medicationTotal: 3
}

export const mockBloodPressureTrend: TrendDataPoint[] = [
  { date: '6/10', value: 130, value2: 83 },
  { date: '6/11', value: 142, value2: 90 },
  { date: '6/12', value: 138, value2: 88 },
  { date: '6/13', value: 130, value2: 84 },
  { date: '6/14', value: 145, value2: 92 },
  { date: '6/15', value: 135, value2: 85 }
]

export const mockBloodSugarTrend: TrendDataPoint[] = [
  { date: '6/10', value: 8.8 },
  { date: '6/11', value: 7.2 },
  { date: '6/12', value: 9.2 },
  { date: '6/13', value: 7.8 },
  { date: '6/14', value: 8.5 },
  { date: '6/15', value: 6.8 }
]

export const mockDoctorAdvices: DoctorAdvice[] = [
  {
    id: 'da1',
    doctorName: '张医生',
    hospital: '市第一人民医院',
    date: '2026-06-10',
    content: '血压控制尚可，继续保持目前用药方案。建议减少钠盐摄入，每日不超过5克。每周监测血压3-4次，如有明显波动及时就诊。',
    nextVisit: '2026-06-20'
  },
  {
    id: 'da2',
    doctorName: '李医生',
    hospital: '市第一人民医院',
    date: '2026-05-25',
    content: '血糖控制良好，糖化血红蛋白6.5%。继续饮食控制，适度运动。二甲双胍剂量不变，定期监测空腹及餐后血糖。'
  },
  {
    id: 'da3',
    doctorName: '王医生',
    hospital: '市第一人民医院',
    date: '2026-05-10',
    content: '心电图检查正常，胸痛症状考虑为心绞痛。随身携带硝酸甘油，避免过度劳累和情绪激动。戒烟限酒，保持心情舒畅。'
  }
]

export const mockWeeklyReports: WeeklyReport[] = [
  {
    id: 'wr1',
    weekStart: '2026-06-09',
    weekEnd: '2026-06-15',
    bloodPressureAvg: { systolic: 135, diastolic: 86 },
    bloodSugarAvg: 7.5,
    abnormalCount: 4,
    medicationCompliance: 90,
    symptoms: ['头晕', '头痛', '胸闷'],
    summary: '本周血压略有波动，周一和周四出现偏高情况，需注意监测。血糖控制整体良好，仅一次餐后偏高。用药依从性较好。建议保持规律作息，避免情绪波动。'
  },
  {
    id: 'wr2',
    weekStart: '2026-06-02',
    weekEnd: '2026-06-08',
    bloodPressureAvg: { systolic: 130, diastolic: 83 },
    bloodSugarAvg: 7.2,
    abnormalCount: 2,
    medicationCompliance: 95,
    symptoms: ['失眠'],
    summary: '本周整体情况良好，血压和血糖控制稳定。用药依从性高。失眠症状有所改善，建议继续保持良好的睡眠习惯。'
  },
  {
    id: 'wr3',
    weekStart: '2026-05-26',
    weekEnd: '2026-06-01',
    bloodPressureAvg: { systolic: 128, diastolic: 82 },
    bloodSugarAvg: 7.0,
    abnormalCount: 1,
    medicationCompliance: 100,
    symptoms: [],
    summary: '本周各项指标均在正常范围内，控制情况优秀。继续保持当前的饮食和运动习惯，定期复诊。'
  }
]
