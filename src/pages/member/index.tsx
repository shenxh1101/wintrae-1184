import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import RecordItem from '@/components/RecordItem'
import { formatDate } from '@/utils/dateUtils'
import { calculateAverage } from '@/utils/healthUtils'
import type { FamilyRole, BloodPressureRecord, BloodSugarRecord, SymptomRecord } from '@/types'

const roleColors: Record<FamilyRole, string> = {
  patient: '#ef4444',
  spouse: '#22c55e',
  child: '#3b82f6',
  parent: '#f59e0b',
  other: '#8b5cf6'
}

const MemberDetailPage: React.FC = () => {
  const router = useRouter()
  const memberId = router.params.id

  const {
    familyMembers,
    bloodPressureRecords,
    bloodSugarRecords,
    symptomRecords
  } = useHealthStore()

  const member = useMemo(
    () => familyMembers.find((m) => m.id === memberId),
    [familyMembers, memberId]
  )

  const memberBPRecords = useMemo(
    () => bloodPressureRecords.slice(0, 7),
    [bloodPressureRecords]
  )

  const memberBSRecords = useMemo(
    () => bloodSugarRecords.slice(0, 7),
    [bloodSugarRecords]
  )

  const healthStats = useMemo(() => {
    const bpAvg = memberBPRecords.length > 0 ? {
      systolic: Math.round(calculateAverage(memberBPRecords.map((r) => r.systolic))),
      diastolic: Math.round(calculateAverage(memberBPRecords.map((r) => r.diastolic)))
    } : null

    const bsAvg = memberBSRecords.length > 0
      ? calculateAverage(memberBSRecords.map((r) => r.value)).toFixed(1)
      : null

    const abnormalCount = [
      ...memberBPRecords.filter((r) => r.status !== 'normal'),
      ...memberBSRecords.filter((r) => r.status !== 'normal')
    ].length

    return { bpAvg, bsAvg, abnormalCount }
  }, [memberBPRecords, memberBSRecords])

  const latestBP = useMemo(
    () => bloodPressureRecords[0] as BloodPressureRecord | undefined,
    [bloodPressureRecords]
  )

  const latestBS = useMemo(
    () => bloodSugarRecords[0] as BloodSugarRecord | undefined,
    [bloodSugarRecords]
  )

  const latestSymptom = useMemo(
    () => symptomRecords[0] as SymptomRecord | undefined,
    [symptomRecords]
  )

  const handleCall = () => {
    if (!member) return

    Taro.showModal({
      title: '拨打电话',
      content: `确定拨打 ${member.name} 的电话 ${member.phone}？`,
      confirmText: '拨打',
      confirmColor: '#3b82f6'
    }).then((res) => {
      if (res.confirm) {
        Taro.makePhoneCall({
          phoneNumber: member.phone.replace(/\*/g, '0')
        }).catch((err) => {
          console.error('[MemberDetail] 拨号失败', err)
          Taro.showToast({ title: '拨号失败，请手动拨打', icon: 'none' })
        })
      }
    }).catch((err) => {
      console.error('[MemberDetail] 拨号弹窗失败', err)
    })
  }

  const handleMessage = () => {
    Taro.showToast({ title: '消息功能开发中', icon: 'none' })
  }

  const handleEdit = () => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
  }

  const handleSetEmergency = () => {
    Taro.showToast({ title: '设置功能开发中', icon: 'none' })
  }

  const handleBack = () => {
    Taro.navigateBack().catch(() => {
      Taro.switchTab({ url: '/pages/family/index' }).catch(() => {})
    })
  }

  const quickActions = [
    { icon: '📞', label: '拨打电话', key: 'call', color: '#3b82f6', onClick: handleCall },
    { icon: '💬', label: '发送消息', key: 'message', color: '#22c55e', onClick: handleMessage },
    { icon: '✏️', label: '编辑信息', key: 'edit', color: '#f59e0b', onClick: handleEdit },
    { icon: '🚨', label: '设为紧急', key: 'emergency', color: '#ef4444', onClick: handleSetEmergency }
  ]

  if (!member) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.header} />
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>👤</Text>
          <Text className={styles.emptyText}>成员不存在</Text>
          <Text className={styles.emptyDesc}>该成员可能已被删除或ID无效</Text>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text>←</Text>
            <Text>返回</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  const roleColor = roleColors[member.role] || '#64748b'

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header} />

      <View className={styles.memberCard}>
        <View className={styles.memberHeader}>
          <View className={styles.memberAvatar} style={{ background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}99 100%)` }}>
            <Text>{member.name.charAt(0)}</Text>
            {member.isEmergency && (
              <View className={styles.emergencyBadge}>
                <Text>🚨</Text>
              </View>
            )}
          </View>
          <View className={styles.memberInfo}>
            <View className={styles.memberNameRow}>
              <Text className={styles.memberName}>{member.name}</Text>
              <View
                className={styles.relationTag}
                style={{ backgroundColor: `${roleColor}15`, color: roleColor }}
              >
                {member.relation}
              </View>
            </View>
            <Text className={styles.memberPhone}>{member.phone}</Text>
            {member.isEmergency && (
              <View className={styles.emergencyLabel}>
                <Text>🚨</Text>
                <Text>紧急联系人</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>健康概览</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.navigateTo({ url: '/pages/record/index' }).catch(() => {})}>
            查看全部
          </Text>
        </View>
        <View className={styles.overviewCard}>
          <View className={styles.overviewGrid}>
            <View className={styles.overviewItem}>
              <Text className={styles.overviewValue}>
                {healthStats.bpAvg
                  ? `${healthStats.bpAvg.systolic}/${healthStats.bpAvg.diastolic}`
                  : '--'}
              </Text>
              <Text className={styles.overviewLabel}>血压(mmHg)</Text>
              <Text className={styles.overviewSubtitle}>近7天平均</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={styles.overviewValue}>
                {healthStats.bsAvg || '--'}
              </Text>
              <Text className={styles.overviewLabel}>血糖(mmol/L)</Text>
              <Text className={styles.overviewSubtitle}>近7天平均</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text
                className={classnames(
                  styles.overviewValue,
                  healthStats.abnormalCount > 0 && styles.overviewValueWarn
                )}>
                {healthStats.abnormalCount}
              </Text>
              <Text className={styles.overviewLabel}>异常次数</Text>
              <Text className={styles.overviewSubtitle}>近7天</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>快捷操作</Text>
        </View>
        <View className={styles.quickActions}>
          {quickActions.map((action) => (
            <View
              key={action.key}
              className={styles.quickActionItem}
              onClick={action.onClick}
            >
              <View
                className={styles.quickActionIcon}
                style={{ backgroundColor: `${action.color}15` }}
              >
                <Text>{action.icon}</Text>
              </View>
              <Text className={styles.quickActionLabel}>{action.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最近记录</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.switchTab({ url: '/pages/record/index' }).catch(() => {})}>
            全部记录
          </Text>
        </View>
        <View className={styles.recordsCard}>
          <View className={styles.recordSection}>
            <View className={styles.recordSectionHeader}>
              <View className={styles.recordSectionIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
                <Text>💓</Text>
              </View>
              <Text className={styles.recordSectionTitle}>血压</Text>
            </View>
            {latestBP ? (
              <RecordItem type='bloodPressure' record={latestBP} />
            ) : (
              <View className={styles.recordEmpty}>暂无血压记录</View>
            )}
          </View>

          <View className={styles.recordSection}>
            <View className={styles.recordSectionHeader}>
              <View className={styles.recordSectionIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                <Text>🩸</Text>
              </View>
              <Text className={styles.recordSectionTitle}>血糖</Text>
            </View>
            {latestBS ? (
              <RecordItem type='bloodSugar' record={latestBS} />
            ) : (
              <View className={styles.recordEmpty}>暂无血糖记录</View>
            )}
          </View>

          <View className={styles.recordSection}>
            <View className={styles.recordSectionHeader}>
              <View className={styles.recordSectionIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                <Text>🤒</Text>
              </View>
              <Text className={styles.recordSectionTitle}>症状</Text>
            </View>
            {latestSymptom ? (
              <RecordItem type='symptom' record={latestSymptom} />
            ) : (
              <View className={styles.recordEmpty}>暂无症状记录</View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MemberDetailPage
