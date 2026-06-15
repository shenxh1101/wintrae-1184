import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Switch, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import { formatDate } from '@/utils/dateUtils'
import type { Medication } from '@/types'

interface TakenState {
  [medicationId: string]: {
    [time: string]: boolean
  }
}

const MedicationPage: React.FC = () => {
  const {
    medications: rawMedications,
    reminders: rawReminders,
    currentMemberId,
    toggleMedicationReminder,
    deleteMedication,
    addMedication
  } = useHealthStore()

  const [takenState, setTakenState] = useState<TakenState>({})
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMedName, setNewMedName] = useState('')
  const [newMedDosage, setNewMedDosage] = useState('')
  const [newMedTimes, setNewMedTimes] = useState('')
  const [newMedNote, setNewMedNote] = useState('')

  const medications = useMemo(
    () => rawMedications.filter((m) => m.memberId === currentMemberId),
    [rawMedications, currentMemberId]
  )
  const reminders = useMemo(
    () => rawReminders.filter((r) => r.memberId === currentMemberId && r.active !== false),
    [rawReminders, currentMemberId]
  )

  const { totalToday, takenToday, pendingReminders } = useMemo(() => {
    let total = 0
    let taken = 0
    medications.forEach((med) => {
      const medTimes = med.times || []
      total += medTimes.length
      medTimes.forEach((time) => {
        if (takenState[med.id]?.[time]) {
          taken++
        }
      })
    })
    const today = new Date().toISOString().split('T')[0]
    const isToday = (time: string) => time.startsWith(today)
    const pending = reminders.filter(
      (r) => r.type === 'medication' && isToday(r.time) && !r.completed
    ).length
    return { totalToday: total, takenToday: taken, pendingReminders: pending }
  }, [medications, reminders, takenState])

  const progressPercent = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0

  const handleToggleTaken = (medId: string, time: string) => {
    setTakenState((prev) => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        [time]: !prev[medId]?.[time]
      }
    }))
    const isTaken = takenState[medId]?.[time]
    Taro.showToast({
      title: isTaken ? '已取消' : '已标记为已服用',
      icon: 'success',
      duration: 1000
    })
  }

  const handleToggleReminder = (med: Medication) => {
    toggleMedicationReminder(med.id)
    Taro.showToast({
      title: med.reminder ? '已关闭提醒' : '已开启提醒',
      icon: 'success',
      duration: 1000
    })
  }

  const handleToggleGlobalReminder = (value: boolean) => {
    setReminderEnabled(value)
    Taro.showToast({
      title: value ? '已开启所有提醒' : '已关闭所有提醒',
      icon: 'success',
      duration: 1000
    })
  }

  const resetAddForm = () => {
    setNewMedName('')
    setNewMedDosage('')
    setNewMedTimes('')
    setNewMedNote('')
  }

  const handleAddMedication = () => {
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    resetAddForm()
  }

  const handleSubmitAddMedication = () => {
    if (!newMedName.trim()) {
      Taro.showToast({
        title: '请输入药品名称',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!newMedDosage.trim()) {
      Taro.showToast({
        title: '请输入剂量',
        icon: 'none',
        duration: 1500
      })
      return
    }
    const timesArray = newMedTimes
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    addMedication({
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      times: timesArray,
      reminder: true,
      startDate: new Date().toISOString().split('T')[0],
      note: newMedNote.trim() || undefined
    })

    Taro.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    })

    setShowAddModal(false)
    resetAddForm()
  }

  const handleEdit = (med: Medication) => {
    console.log('[MedicationPage] 编辑用药', med)
    Taro.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 1500
    })
  }

  const handleDelete = (med: Medication) => {
    Taro.showModal({
      title: '删除用药',
      content: `确定要删除"${med.name}"吗？删除后将无法恢复，相关提醒也会一并删除。`,
      confirmText: '删除',
      confirmColor: '#ef4444',
      cancelText: '取消'
    })
      .then((res) => {
        if (res.confirm) {
          deleteMedication(med.id)
          Taro.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1000
          })
        }
      })
      .catch((err) => {
        console.error('[MedicationPage] 删除确认弹窗失败', err)
      })
  }

  const getDateRangeText = (med: Medication) => {
    if (!med.endDate) {
      return `开始日期：${formatDate(med.startDate, 'YYYY年MM月DD日')} · 长期服用`
    }
    return `${formatDate(med.startDate, 'YYYY年MM月DD日')} 至 ${formatDate(med.endDate, 'YYYY年MM月DD日')}`
  }

  return (
    <>
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>用药计划</Text>
        <Text className={styles.headerSubtitle}>按时服药，健康每一天</Text>
      </View>

      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>今日服药进度</Text>
          <Text className={styles.progressText}>{takenToday}/{totalToday}</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </View>
        <View className={styles.progressDetail}>
          <Text>已服 {takenToday} 次</Text>
          <Text>完成度 {progressPercent}%</Text>
          <Text>待提醒 {pendingReminders} 次</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View
          className={classnames(styles.reminderToggle)}
          style={{ marginBottom: 0 }}>
          <View className={styles.reminderInfo}>
            <Text className={styles.reminderIcon}>🔔</Text>
            <Text className={styles.reminderText}>用药提醒</Text>
          </View>
          <Switch
            checked={reminderEnabled}
            color='#22c55e'
            onChange={(e) => handleToggleGlobalReminder(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的用药</Text>
          <Text className={styles.sectionCount}>{medications.length} 种药物</Text>
        </View>

        {medications.length > 0 ? (
          <View className={styles.medicationList}>
            {medications.map((med) => (
              <View key={med.id} className={styles.medicationCard}>
                <View className={styles.medicationHeader}>
                  <Text className={styles.medicationName}>{med.name}</Text>
                  <View
                    className={classnames(
                      styles.medicationStatus,
                      med.reminder ? 'active' : 'inactive'
                    )}
                    onClick={() => handleToggleReminder(med)}>
                    {med.reminder ? '提醒中' : '已关闭'}
                  </View>
                </View>

                <View className={styles.medicationInfo}>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoLabel}>剂量：</Text>
                    <Text>{med.dosage}</Text>
                  </View>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoLabel}>每日：</Text>
                    <Text>{med.times.length > 0 ? `${med.times.length} 次` : '按需服用'}</Text>
                  </View>
                </View>

                <Text className={styles.dateRange}>📅 {getDateRangeText(med)}</Text>

                {med.times.length > 0 && (
                  <View className={styles.timesSection}>
                    <Text className={styles.timesLabel}>服用时间：</Text>
                    <View className={styles.timesList}>
                      {med.times.map((time, index) => (
                        <View
                          key={index}
                          className={classnames(
                            styles.timeItem,
                            takenState[med.id]?.[time] && 'taken'
                          )}
                          onClick={() => handleToggleTaken(med.id, time)}>
                          <View className={styles.timeCheckbox}>
                            {takenState[med.id]?.[time] && (
                              <Text className={styles.checkIcon}>✓</Text>
                            )}
                          </View>
                          <Text className={styles.timeText}>{time}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {med.note && (
                  <View className={styles.medicationNote}>
                    <Text>💡 {med.note}</Text>
                  </View>
                )}

                <View className={styles.medicationActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.editBtn)}
                    onClick={() => handleEdit(med)}>
                    <Text>✏️</Text>
                    <Text>编辑</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.deleteBtn)}
                    onClick={() => handleDelete(med)}>
                    <Text>🗑️</Text>
                    <Text>删除</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💊</Text>
            <Text className={styles.emptyText}>暂无用药计划</Text>
            <Text className={styles.emptyText}>点击右下角按钮添加</Text>
          </View>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleAddMedication}>
        <Text className={styles.addBtnIcon}>+</Text>
      </View>
    </ScrollView>

    {showAddModal && (
      <View className={styles.modalMask} onClick={handleCloseAddModal}>
        <View className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>添加新药</Text>
            <View className={styles.modalClose} onClick={handleCloseAddModal}>
              <Text>✕</Text>
            </View>
          </View>

          <ScrollView className={styles.modalBody} scrollY>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>药品名称 *</Text>
              <Input
                className={styles.formInput}
                placeholder='例如：阿莫西林胶囊'
                value={newMedName}
                onInput={(e) => setNewMedName(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>剂量 *</Text>
              <Input
                className={styles.formInput}
                placeholder='例如：每次1粒，每日3次'
                value={newMedDosage}
                onInput={(e) => setNewMedDosage(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>服用时间（逗号分隔）</Text>
              <Input
                className={styles.formInput}
                placeholder='例如：08:00,12:00,20:00'
                value={newMedTimes}
                onInput={(e) => setNewMedTimes(e.detail.value)}
              />
              <Text className={styles.formHint}>多个时间请用英文逗号分隔，留空则为按需服用</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>备注</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder='例如：饭后服用，避免空腹'
                value={newMedNote}
                onInput={(e) => setNewMedNote(e.detail.value)}
                maxlength={200}
              />
            </View>
          </ScrollView>

          <View className={styles.modalFooter}>
            <View className={styles.modalCancelBtn} onClick={handleCloseAddModal}>
              <Text>取消</Text>
            </View>
            <View className={styles.modalConfirmBtn} onClick={handleSubmitAddMedication}>
              <Text>确认添加</Text>
            </View>
          </View>
        </View>
      </View>
    )}
    </>
  )
}

export default MedicationPage
