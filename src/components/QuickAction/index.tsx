import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface QuickActionProps {
  icon: string
  label: string
  color?: string
  badge?: number | string
  onClick?: () => void
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  color = '#22c55e',
  badge,
  onClick
}) => {
  return (
    <View
      className={classnames(styles.item, onClick && styles.clickable)}
      onClick={onClick}
    >
      <View className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
        <Text className={styles.icon} style={{ color }}>{icon}</Text>
        {badge && (
          <View className={styles.badge}>
            <Text className={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text className={styles.label}>{label}</Text>
    </View>
  )
}

export default QuickAction
