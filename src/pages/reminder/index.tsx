import React, { useState, useMemo } from 'react'
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import ReminderItem from '@/components/ReminderItem'
import { isToday, isTomorrow, formatDate, formatTime } from '@/utils/dateUtils'
import type { ReminderType } from '@/types'

const tabs = [
  { key: 'today', label: '今天' },
  { key: 'tomorrow', label: '明天' },
  { key: 'upcoming', label: '即将' }
]

const typeOptions = [
  { key: 'medication', label: '用药提醒' },
  { key: 'measure', label: '测量提醒' },
  { key: 'followup', label: '随访提醒' },
  { key: 'revisit', label: '复诊提醒' }
]

const ReminderPage: React.FC = () => {
  const { reminders, medications, toggleReminder } = useHealthStore()
  const [activeTab, setActiveTab] = useState('today')
  const [showAdd, setShowAdd] = useState(false)
  const [newReminder, setNewReminder] = useState({
    type: 'medication' as ReminderType,
    title: '',
    time: '',
    note: ''
  })

  const filteredReminders = useMemo(() => {
    const now = new Date()
    return reminders.filter((r) => {
      const reminderDate = new Date(r.time)
      switch (activeTab) {
        case 'today':
          return isToday(r.time)
        case 'tomorrow':
          return isTomorrow(r.time)
        case 'upcoming':
          return reminderDate > now && !isToday(r.time) && !isTomorrow(r.time)
        default:
          return true
      }
    }).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  }, [reminders, activeTab])

  const handleToggleReminder = (id: string) => {
    toggleReminder(id)
    const reminder = reminders.find((r) => r.id === id)
    Taro.showToast({
      title: reminder?.completed ? '已取消' : '已完成',
      icon: 'success',
      duration: 1000
    })
  }

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    console.log('[ReminderPage] 新增提醒', newReminder)
    Taro.showToast({ title: '提醒已添加', icon: 'success' })
    setShowAdd(false)
    setNewReminder({ type: 'medication', title: '', time: '', note: '' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>用药计划</Text>
          <Text className={styles.sectionCount}>{medications.length} 种药物</Text>
        </View>
        <View className={styles.medicationsCard}>
          {medications.map((med, index) => (
            <View key={med.id} className={styles.medicationItem}>
              <View className={styles.medicationHeader}>
                <Text className={styles.medicationName}>{med.name}</Text>
                <View className={classnames(styles.medicationStatus, med.reminder ? 'active' : 'inactive')}>
                  {med.reminder ? '提醒中' : '按需服用'}
                </View>
              </View>
              <Text className={styles.medicationDosage}>
                {med.dosage} · {med.times.length > 0 ? `每日${med.times.length}次` : '按需服用'}
              </Text>
              {med.times.length > 0 && (
                <View className={styles.medicationTimes}>
                  {med.times.map((time, i) => (
                    <Text key={i} className={styles.timeTag}>{time}</Text>
                  ))}
                </View>
              )}
              {med.note && <Text className={styles.medicationNote}>{med.note}</Text>}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {activeTab === 'today' ? '今日提醒' : activeTab === 'tomorrow' ? '明日提醒' : '即将到来'}
          </Text>
          <Text className={styles.sectionCount}>{filteredReminders.length} 条</Text>
        </View>

        {filteredReminders.length > 0 ? (
          <View className={styles.reminderList}>
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={() => handleToggleReminder(reminder.id)}
              />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✅</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'today' ? '今日暂无提醒' : activeTab === 'tomorrow' ? '明日暂无提醒' : '暂无即将到来的提醒'}
            </Text>
          </View>
        )}
      </View>

      {showAdd && (
        <View className={styles.addSection}>
          <View className={styles.addCard}>
            <Text className={styles.addTitle}>添加提醒</Text>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>提醒类型</Text>
              <View style={{ display: 'flex', gap: '16rpx', flexWrap: 'wrap' }}>
                {typeOptions.map((type) => (
                  <View
                    key={type.key}
                    style={{
                      padding: '16rpx 24rpx',
                      borderRadius: '24rpx',
                      fontSize: '24rpx',
                      backgroundColor: newReminder.type === type.key ? '#22c55e' : '#f1f5f9',
                      color: newReminder.type === type.key ? '#fff' : '#64748b'
                    }}
                    onClick={() => setNewReminder({ ...newReminder, type: type.key as ReminderType })}>
                    {type.label}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>提醒内容</Text>
              <Input
                className={styles.input}
                value={newReminder.title}
                onInput={(e) => setNewReminder({ ...newReminder, title: e.detail.value })}
                placeholder='如：硝苯地平缓释片 20mg'
              />
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>提醒时间</Text>
              <Input
                className={styles.input}
                value={newReminder.time}
                onInput={(e) => setNewReminder({ ...newReminder, time: e.detail.value })}
                placeholder='如：2026-06-16 08:00'
              />
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>备注</Text>
              <Textarea
                className={styles.textarea}
                value={newReminder.note}
                onInput={(e) => setNewReminder({ ...newReminder, note: e.detail.value })}
                placeholder='可选，如：饭后服用'
              />
            </View>

            <View className={styles.submitBtn} onClick={handleAddReminder}>
              <Text className={styles.submitText}>保存提醒</Text>
            </View>
            <View className={styles.cancelBtn} onClick={() => setShowAdd(false)}>
              <Text className={styles.cancelText}>取消</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>
        <Text className={styles.addBtnIcon}>{showAdd ? '✕' : '+'}</Text>
      </View>
    </ScrollView>
  )
}

export default ReminderPage
