import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import { getReminderTypeText, getReminderTypeColor } from '@/utils/healthUtils'
import { formatTime } from '@/utils/dateUtils'
import type { Reminder } from '@/types'

interface ReminderItemProps {
  reminder: Reminder
  onToggle?: () => void
  onClick?: () => void
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onToggle, onClick }) => {
  const typeColor = getReminderTypeColor(reminder.type)
  const typeText = getReminderTypeText(reminder.type)

  return (
    <View
      className={classnames(styles.item, reminder.completed && styles.completed)}
      onClick={onClick}
    >
      <View className={styles.checkbox} onClick={(e) => {
        e.stopPropagation()
        onToggle?.()
      }}>
        <View
          className={classnames(styles.checkboxInner, reminder.completed && styles.checked)}
          style={reminder.completed ? { backgroundColor: typeColor, borderColor: typeColor } : {}}
        >
          {reminder.completed && <Text className={styles.checkmark}>✓</Text>}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.header}>
          <View
            className={styles.typeTag}
            style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
          >
            {typeText}
          </View>
          <Text className={styles.time}>{formatTime(reminder.time)}</Text>
        </View>
        <Text className={classnames(styles.title, reminder.completed && styles.titleCompleted)}>
          {reminder.title}
        </Text>
        {reminder.note && <Text className={styles.note}>{reminder.note}</Text>}
      </View>
    </View>
  )
}

export default ReminderItem
