import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { HealthStatus } from '@/types'
import { getStatusColor, getStatusText } from '@/utils/healthUtils'

interface StatusBadgeProps {
  status: HealthStatus
  size?: 'sm' | 'md' | 'lg'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const color = getStatusColor(status)
  const text = getStatusText(status)

  return (
    <View
      className={classnames(styles.badge, styles[size])}
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <View className={styles.dot} style={{ backgroundColor: color }} />
      <Text className={styles.text}>{text}</Text>
    </View>
  )
}

export default StatusBadge
