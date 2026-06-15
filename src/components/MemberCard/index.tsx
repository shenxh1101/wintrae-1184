import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { FamilyMember } from '@/types'

interface MemberCardProps {
  member: FamilyMember
  isSelected?: boolean
  showEmergencyBadge?: boolean
  onClick?: () => void
  onCall?: () => void
}

const roleColors: Record<string, string> = {
  patient: '#ef4444',
  spouse: '#22c55e',
  child: '#3b82f6',
  parent: '#f59e0b',
  other: '#8b5cf6'
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isSelected = false,
  showEmergencyBadge = true,
  onClick,
  onCall
}) => {
  const roleColor = roleColors[member.role] || '#64748b'

  return (
    <View
      className={classnames(styles.card, isSelected && styles.selected, onClick && styles.clickable)}
      style={isSelected ? { borderColor: roleColor } : {}}
      onClick={onClick}
    >
      <View className={styles.avatar} style={{ backgroundColor: `${roleColor}15` }}>
        <Text className={styles.avatarText} style={{ color: roleColor }}>
          {member.name.charAt(0)}
        </Text>
        {member.isEmergency && showEmergencyBadge && (
          <View className={styles.emergencyBadge}>
            <Text className={styles.emergencyIcon}>🚨</Text>
          </View>
        )}
      </View>

      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{member.name}</Text>
          <View
            className={styles.roleTag}
            style={{ backgroundColor: `${roleColor}15`, color: roleColor }}
          >
            {member.relation}
          </View>
        </View>
        <Text className={styles.phone}>{member.phone}</Text>
      </View>

      {onCall && (
        <View
          className={styles.callBtn}
          onClick={(e) => {
            e.stopPropagation()
            onCall()
          }}
        >
          <Text className={styles.callIcon}>📞</Text>
        </View>
      )}
    </View>
  )
}

export default MemberCard
