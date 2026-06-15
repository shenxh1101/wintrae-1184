import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusBadge from '@/components/StatusBadge'
import type { HealthStatus } from '@/types'

interface HealthCardProps {
  title: string
  value: string
  unit: string
  subtitle?: string
  status: HealthStatus
  color?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  onClick?: () => void
}

const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  status,
  color = '#22c55e',
  trend,
  trendValue,
  onClick
}) => {
  return (
    <View
      className={classnames(styles.card, onClick && styles.clickable)}
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        <StatusBadge status={status} size='sm' />
      </View>
      <View className={styles.content}>
        <Text className={styles.value} style={{ color }}>{value}</Text>
        <Text className={styles.unit}>{unit}</Text>
      </View>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      {trend && trendValue && (
        <View className={styles.trend}>
          <Text
            className={classnames(styles.trendIcon, styles[trend])}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </Text>
          <Text className={styles.trendValue}>{trendValue}</Text>
        </View>
      )}
    </View>
  )
}

export default HealthCard
