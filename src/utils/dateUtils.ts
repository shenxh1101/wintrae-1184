import dayjs from 'dayjs'

export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format)
}

export const formatTime = (date: string | Date, format: string = 'HH:mm'): string => {
  return dayjs(date).format(format)
}

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

export const isTomorrow = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
}

export const getDaysDiff = (date1: string | Date, date2: string | Date): number => {
  return dayjs(date1).diff(dayjs(date2), 'day')
}

export const getRelativeDateText = (date: string | Date): string => {
  const now = dayjs()
  const target = dayjs(date)
  const diff = target.diff(now, 'day')

  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  if (diff === -1) return '昨天'
  if (diff > 1 && diff <= 7) return `${diff}天后`
  if (diff < -1 && diff >= -7) return `${Math.abs(diff)}天前`

  return formatDate(date)
}

export const getWeekRange = (date: string | Date = new Date()): { start: string; end: string } => {
  const start = dayjs(date).startOf('week')
  const end = dayjs(date).endOf('week')
  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD')
  }
}

export const getMonthRange = (date: string | Date = new Date()): { start: string; end: string } => {
  const start = dayjs(date).startOf('month')
  const end = dayjs(date).endOf('month')
  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD')
  }
}
