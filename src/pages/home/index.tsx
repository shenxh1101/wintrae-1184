import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import HealthCard from '@/components/HealthCard'
import QuickAction from '@/components/QuickAction'
import TrendChart from '@/components/TrendChart'
import ReminderItem from '@/components/ReminderItem'
import { isToday, formatDate, getDaysDiff, getRelativeDateText } from '@/utils/dateUtils'
import { calculateAverage } from '@/utils/healthUtils'
import type { TrendDataPoint } from '@/types'

const HomePage: React.FC = () => {
  const {
    familyMembers,
    currentMemberId,
    bloodPressureRecords,
    bloodSugarRecords,
    symptomRecords,
    dietRecords,
    exerciseRecords,
    reminders,
    doctorAdvices,
    medications,
    toggleReminder,
    setCurrentMember,
    setRecordInitialTab
  } = useHealthStore()

  const [trendType, setTrendType] = useState<'bp' | 'bs'>('bp')

  const currentMember = useMemo(
    () => familyMembers.find((m) => m.id === currentMemberId),
    [familyMembers, currentMemberId]
  )

  const currentBP = useMemo(
    () => bloodPressureRecords.filter((r) => r.memberId === currentMemberId),
    [bloodPressureRecords, currentMemberId]
  )
  const currentBS = useMemo(
    () => bloodSugarRecords.filter((r) => r.memberId === currentMemberId),
    [bloodSugarRecords, currentMemberId]
  )
  const currentReminderList = useMemo(
    () => reminders.filter((r) => r.memberId === currentMemberId && r.active !== false),
    [reminders, currentMemberId]
  )
  const currentAdvices = useMemo(
    () => doctorAdvices.filter((d) => d.memberId === currentMemberId),
    [doctorAdvices, currentMemberId]
  )
  const currentMeds = useMemo(
    () => medications.filter((m) => m.memberId === currentMemberId),
    [medications, currentMemberId]
  )
  const currentSymptoms = useMemo(
    () => symptomRecords.filter((r) => r.memberId === currentMemberId),
    [symptomRecords, currentMemberId]
  )
  const currentDiet = useMemo(
    () => dietRecords.filter((r) => r.memberId === currentMemberId),
    [dietRecords, currentMemberId]
  )
  const currentExercise = useMemo(
    () => exerciseRecords.filter((r) => r.memberId === currentMemberId),
    [exerciseRecords, currentMemberId]
  )

  const bpTrendData: TrendDataPoint[] = useMemo(() => {
    const days: TrendDataPoint[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayRecords = currentBP.filter((r) => r.time.startsWith(dateStr))
      const label = `${date.getMonth() + 1}/${date.getDate()}`
      if (dayRecords.length > 0) {
        const systolicAvg = Math.round(dayRecords.reduce((s, r) => s + r.systolic, 0) / dayRecords.length)
        const diastolicAvg = Math.round(dayRecords.reduce((s, r) => s + r.diastolic, 0) / dayRecords.length)
        days.push({ date: label, value: systolicAvg, value2: diastolicAvg })
      } else {
        const prevData = days.filter((d) => d.value > 0)
        const lastValue = prevData.length > 0 ? prevData[prevData.length - 1].value : 0
        const lastValue2 = prevData.length > 0 ? (prevData[prevData.length - 1].value2 || 0) : 0
        if (lastValue > 0) {
          days.push({ date: label, value: lastValue, value2: lastValue2 })
        } else {
          days.push({ date: label, value: 0, value2: 0 })
        }
      }
    }
    const hasData = days.filter((d) => d.value > 0)
    if (hasData.length === 0) return []
    return days
  }, [currentBP])

  const bsTrendData: TrendDataPoint[] = useMemo(() => {
    const days: TrendDataPoint[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayRecords = currentBS.filter((r) => r.time.startsWith(dateStr))
      const label = `${date.getMonth() + 1}/${date.getDate()}`
      if (dayRecords.length > 0) {
        const avg = parseFloat((dayRecords.reduce((s, r) => s + r.value, 0) / dayRecords.length).toFixed(1))
        days.push({ date: label, value: avg })
      } else {
        const prevData = days.filter((d) => d.value > 0)
        const lastValue = prevData.length > 0 ? prevData[prevData.length - 1].value : 0
        if (lastValue > 0) {
          days.push({ date: label, value: lastValue })
        } else {
          days.push({ date: label, value: 0 })
        }
      }
    }
    const hasData = days.filter((d) => d.value > 0)
    if (hasData.length === 0) return []
    return days
  }, [currentBS])

  const todayReminders = useMemo(
    () => currentReminderList.filter((r) => isToday(r.time)).slice(0, 3),
    [currentReminderList]
  )

  const latestBP = useMemo(() => currentBP[0], [currentBP])
  const latestBS = useMemo(() => currentBS[0], [currentBS])

  const bpAvg = useMemo(() => {
    const recent = currentBP.slice(0, 7)
    return {
      systolic: Math.round(calculateAverage(recent.map((r) => r.systolic))),
      diastolic: Math.round(calculateAverage(recent.map((r) => r.diastolic)))
    }
  }, [currentBP])

  const bsAvg = useMemo(() => {
    const recent = currentBS.slice(0, 7)
    return calculateAverage(recent.map((r) => r.value)).toFixed(1)
  }, [currentBS])

  const nextVisit = useMemo(() => {
    return currentAdvices.find((d) => d.nextVisit)?.nextVisit
  }, [currentAdvices])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深了'
    if (hour < 12) return '早上好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }, [])

  const handleQuickAction = (action: string) => {
    const tabBarActions = ['symptom', 'diet', 'exercise']
    const routes: Record<string, string> = {
      bloodPressure: '/pages/bloodpressure/index',
      bloodSugar: '/pages/bloodsugar/index',
      symptom: '/pages/record/index?tab=symptom',
      diet: '/pages/record/index?tab=diet',
      exercise: '/pages/record/index?tab=exercise',
      emergency: ''
    }

    if (action === 'emergency') {
      const emergencyContact = familyMembers.find((m) => m.isEmergency)
      if (emergencyContact) {
        Taro.makePhoneCall({
          phoneNumber: emergencyContact.phone.replace(/\*/g, '0')
        }).catch((err) => {
          console.error('[HomePage] 紧急呼叫失败', err)
          Taro.showToast({ title: '呼叫失败', icon: 'none' })
        })
      }
      return
    }

    const route = routes[action]
    if (route) {
      if (tabBarActions.includes(action)) {
        setRecordInitialTab(action as any)
        Taro.switchTab({ url: '/pages/record/index' }).catch((err) => {
          console.error('[HomePage] switchTab 跳转失败', err)
        })
      } else {
        Taro.navigateTo({ url: route }).catch((err) => {
          console.error('[HomePage] navigateTo 跳转失败', err)
        })
      }
    }
  }

  const handleMemberClick = () => {
    Taro.navigateTo({ url: '/pages/family/index' }).catch((err) => {
      console.error('[HomePage] 跳转家庭成员页面失败', err)
    })
  }

  const handleEmergencyCall = () => {
    const emergencyContact = familyMembers.find((m) => m.isEmergency)
    if (!emergencyContact) {
      Taro.showToast({ title: '未设置紧急联系人', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '紧急呼叫',
      content: `确定拨打紧急联系人 ${emergencyContact.name} (${emergencyContact.phone})？`,
      confirmText: '拨打',
      confirmColor: '#ef4444'
    }).then((res) => {
      if (res.confirm) {
        Taro.makePhoneCall({
          phoneNumber: emergencyContact.phone.replace(/\*/g, '0')
        }).catch((err) => {
          console.error('[HomePage] 紧急呼叫失败', err)
          Taro.showToast({ title: '呼叫失败', icon: 'none' })
        })
      }
    }).catch((err) => {
      console.error('[HomePage] 紧急呼叫弹窗失败', err)
    })
  }

  const handleToggleReminder = (id: string) => {
    toggleReminder(id)
    Taro.showToast({
      title: '已完成',
      icon: 'success',
      duration: 1000
    })
  }

  const quickActions = [
    { icon: '💓', label: '血压', key: 'bloodPressure', color: '#3b82f6' },
    { icon: '🩸', label: '血糖', key: 'bloodSugar', color: '#f59e0b' },
    { icon: '🤒', label: '症状', key: 'symptom', color: '#ef4444' },
    { icon: '🍽️', label: '饮食', key: 'diet', color: '#8b5cf6' },
    { icon: '🏃', label: '运动', key: 'exercise', color: '#22c55e' },
    { icon: '🚨', label: '紧急', key: 'emergency', color: '#ef4444', badge: 'SOS' }
  ]

  const trendData: TrendDataPoint[] = trendType === 'bp' ? bpTrendData : bsTrendData

  const healthOverview = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const isTodayStr = (time: string) => time.startsWith(today)

    const todayRecords = [
      ...currentBP.filter((r) => isTodayStr(r.time)),
      ...currentBS.filter((r) => isTodayStr(r.time)),
      ...currentSymptoms.filter((r) => isTodayStr(r.time)),
      ...currentDiet.filter((r) => isTodayStr(r.time)),
      ...currentExercise.filter((r) => isTodayStr(r.time))
    ].length

    const pendingReminders = currentReminderList.filter(
      (r) => isTodayStr(r.time) && !r.completed
    ).length

    const abnormalCount = [
      ...currentBP.filter((r) => r.status !== 'normal'),
      ...currentBS.filter((r) => r.status !== 'normal')
    ].length

    const nextVisit = currentAdvices.find((a) => a.nextVisit)?.nextVisit

    const todayMedReminders = currentReminderList.filter(
      (r) => r.type === 'medication' && isTodayStr(r.time)
    )
    const medicationTaken = todayMedReminders.filter((r) => r.completed).length
    const medicationTotal = todayMedReminders.length || currentMeds.reduce((sum, m) => sum + m.times.length, 0)

    return {
      todayRecords,
      pendingReminders,
      abnormalCount,
      nextVisit,
      medicationTaken,
      medicationTotal
    }
  }, [currentBP, currentBS, currentSymptoms, currentDiet, currentExercise, currentReminderList, currentAdvices, currentMeds])

  const medicationProgress = healthOverview.medicationTotal > 0
    ? Math.round((healthOverview.medicationTaken / healthOverview.medicationTotal) * 100)
    : 0

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.greetingRow}>
          <View>
            <Text className={styles.greeting}>{greeting}，{currentMember?.name || '用户'}</Text>
            <Text className={styles.dateText}>{formatDate(new Date(), 'YYYY年MM月DD日 dddd')}</Text>
          </View>
          <View className={styles.memberSelector} onClick={handleMemberClick}>
            <View className={styles.memberAvatar}>
              {currentMember?.name?.charAt(0) || '用'}
            </View>
            <Text className={styles.memberName}>{currentMember?.relation || '本人'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.overviewCard}>
        <View className={styles.overviewGrid}>
          <View className={styles.overviewItem}>
            <Text className={styles.overviewValue}>{healthOverview.todayRecords}</Text>
            <Text className={styles.overviewLabel}>今日记录</Text>
          </View>
          <View className={styles.overviewItem}>
            <Text className={styles.overviewValue}>{healthOverview.pendingReminders}</Text>
            <Text className={styles.overviewLabel}>待办事项</Text>
          </View>
          <View className={styles.overviewItem}>
            <Text
              className={classnames(
                styles.overviewValue,
                healthOverview.abnormalCount > 0 && styles.overviewValueWarn
              )}>
              {healthOverview.abnormalCount}
            </Text>
            <Text className={styles.overviewLabel}>异常提醒</Text>
          </View>
        </View>

        <View className={styles.medicationProgress}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>今日用药</Text>
            <Text className={styles.progressText}>
              {healthOverview.medicationTaken}/{healthOverview.medicationTotal} · {medicationProgress}%
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${medicationProgress}%` }} />
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>快捷记录</Text>
        </View>
        <View className={styles.quickActions}>
          {quickActions.map((action) => (
            <QuickAction
              key={action.key}
              icon={action.icon}
              label={action.label}
              color={action.color}
              badge={action.badge}
              onClick={() => handleQuickAction(action.key)}
            />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>健康指标</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.switchTab({ url: '/pages/record/index' }).catch(() => {})}>
            查看全部
          </Text>
        </View>
        <View className={styles.healthGrid}>
          {latestBP && (
            <HealthCard
              title='血压'
              value={`${latestBP.systolic}/${latestBP.diastolic}`}
              unit='mmHg'
              subtitle={`近7天平均 ${bpAvg.systolic}/${bpAvg.diastolic}`}
              status={latestBP.status}
              color='#3b82f6'
              onClick={() => Taro.navigateTo({ url: '/pages/bloodpressure/index' }).catch(() => {})}
            />
          )}
          {latestBS && (
            <HealthCard
              title='血糖'
              value={latestBS.value.toFixed(1)}
              unit='mmol/L'
              subtitle={`近7天平均 ${bsAvg}`}
              status={latestBS.status}
              color='#f59e0b'
              onClick={() => Taro.navigateTo({ url: '/pages/bloodsugar/index' }).catch(() => {})}
            />
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>趋势图表</Text>
        </View>
        <View className={styles.trendCard}>
          <View className={styles.trendTabs}>
            <View
              className={classnames(styles.trendTab, trendType === 'bp' && styles.active)}
              onClick={() => setTrendType('bp')}>
              血压
            </View>
            <View
              className={classnames(styles.trendTab, trendType === 'bs' && styles.active)}
              onClick={() => setTrendType('bs')}>
              血糖
            </View>
          </View>
          <TrendChart
            data={trendData}
            color={trendType === 'bp' ? '#3b82f6' : '#f59e0b'}
            color2={trendType === 'bp' ? '#60a5fa' : undefined}
            showLegend={trendType === 'bp'}
            legend1='收缩压'
            legend2='舒张压'
            unit={trendType === 'bp' ? '' : ' mmol/L'}
          />
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日待办</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.switchTab({ url: '/pages/reminder/index' }).catch(() => {})}>
            全部提醒
          </Text>
        </View>
        <View className={styles.reminderList}>
          {todayReminders.length > 0 ? (
            todayReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={() => handleToggleReminder(reminder.id)}
              />
            ))
          ) : (
            <View style={{ padding: '32rpx', textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8' }}>今日暂无待办事项</Text>
            </View>
          )}
        </View>
      </View>

      {nextVisit && (
        <View className={styles.section}>
          <View className={styles.visitCard}>
            <Text className={styles.visitTitle}>下次复诊</Text>
            <Text className={styles.visitDate}>
              {getRelativeDateText(nextVisit)} · {formatDate(nextVisit, 'MM月DD日')}
            </Text>
            <Text className={styles.visitInfo}>
              还有 {getDaysDiff(nextVisit, new Date())} 天 · 市第一人民医院
            </Text>
          </View>
        </View>
      )}

      <View className={styles.emergencySection}>
        <View className={styles.emergencyBtn} onClick={handleEmergencyCall}>
          <Text className={styles.emergencyIcon}>🚨</Text>
          <Text className={styles.emergencyText}>紧急呼叫</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
