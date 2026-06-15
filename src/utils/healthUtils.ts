import type { HealthStatus } from '@/types'

export const getBloodPressureStatus = (systolic: number, diastolic: number): HealthStatus => {
  if (systolic >= 140 || diastolic >= 90) return 'danger'
  if (systolic >= 130 || diastolic >= 85) return 'warning'
  return 'normal'
}

export const getBloodSugarStatus = (value: number, period: string): HealthStatus => {
  if (period === 'fasting') {
    if (value >= 7.0) return 'danger'
    if (value >= 6.1) return 'warning'
  } else {
    if (value >= 11.1) return 'danger'
    if (value >= 7.8) return 'warning'
  }
  return 'normal'
}

export const getStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case 'normal': return '#22c55e'
    case 'warning': return '#f59e0b'
    case 'danger': return '#ef4444'
    default: return '#22c55e'
  }
}

export const getStatusText = (status: HealthStatus): string => {
  switch (status) {
    case 'normal': return '正常'
    case 'warning': return '偏高'
    case 'danger': return '异常'
    default: return '正常'
  }
}

export const getSugarPeriodText = (period: string): string => {
  const map: Record<string, string> = {
    fasting: '空腹',
    beforeMeal: '餐前',
    afterMeal: '餐后',
    beforeSleep: '睡前'
  }
  return map[period] || period
}

export const getMealTypeText = (type: string): string => {
  const map: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return map[type] || type
}

export const getIntensityText = (intensity: string): string => {
  const map: Record<string, string> = {
    light: '轻度',
    moderate: '中度',
    vigorous: '高强度'
  }
  return map[intensity] || intensity
}

export const getSeverityText = (severity: string): string => {
  const map: Record<string, string> = {
    mild: '轻微',
    moderate: '中等',
    severe: '严重'
  }
  return map[severity] || severity
}

export const getReminderTypeText = (type: string): string => {
  const map: Record<string, string> = {
    medication: '用药',
    measure: '测量',
    followup: '随访',
    revisit: '复诊'
  }
  return map[type] || type
}

export const getReminderTypeColor = (type: string): string => {
  const map: Record<string, string> = {
    medication: '#3b82f6',
    measure: '#22c55e',
    followup: '#8b5cf6',
    revisit: '#f59e0b'
  }
  return map[type] || '#64748b'
}

export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals)
}

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}
