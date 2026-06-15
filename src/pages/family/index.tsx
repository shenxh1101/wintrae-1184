import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import MemberCard from '@/components/MemberCard'
import { formatDate } from '@/utils/dateUtils'
import { calculateAverage } from '@/utils/healthUtils'
import type { HealthStatus } from '@/types'

const FamilyPage: React.FC = () => {
  const {
    familyMembers,
    currentMemberId,
    bloodPressureRecords,
    bloodSugarRecords,
    reminders,
    symptomRecords,
    weeklyReports,
    setCurrentMember
  } = useHealthStore()

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
  const currentSymptoms = useMemo(
    () => symptomRecords.filter((r) => r.memberId === currentMemberId),
    [symptomRecords, currentMemberId]
  )
  const currentWeeklyReports = useMemo(
    () => weeklyReports.filter((w) => w.memberId === currentMemberId),
    [weeklyReports, currentMemberId]
  )

  const currentMember = useMemo(
    () => familyMembers.find((m) => m.id === currentMemberId),
    [familyMembers, currentMemberId]
  )

  const otherMembers = useMemo(
    () => familyMembers.filter((m) => m.id !== currentMemberId),
    [familyMembers, currentMemberId]
  )

  const emergencyContacts = useMemo(
    () => familyMembers.filter((m) => m.isEmergency),
    [familyMembers]
  )

  const memberStats = useMemo(() => {
    const bpRecords = currentBP.slice(0, 7)
    const bsRecords = currentBS.slice(0, 7)

    const bpAvg = bpRecords.length > 0 ? {
      systolic: Math.round(calculateAverage(bpRecords.map((r) => r.systolic))),
      diastolic: Math.round(calculateAverage(bpRecords.map((r) => r.diastolic)))
    } : null

    const bsAvg = bsRecords.length > 0
      ? calculateAverage(bsRecords.map((r) => r.value)).toFixed(1)
      : null

    const abnormalCount = [
      ...currentBP.slice(0, 7).filter((r) => r.status !== 'normal'),
      ...currentBS.slice(0, 7).filter((r) => r.status !== 'normal')
    ].length

    const pendingReminders = currentReminderList.filter((r) => !r.completed).length

    return { bpAvg, bsAvg, abnormalCount, pendingReminders }
  }, [currentBP, currentBS, currentReminderList])

  const bpAvg = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split('T')[0]
    const records = currentBP.filter((r) => r.time >= weekStr)
    if (records.length === 0) return { systolic: 0, diastolic: 0 }
    return {
      systolic: Math.round(records.reduce((s, r) => s + r.systolic, 0) / records.length),
      diastolic: Math.round(records.reduce((s, r) => s + r.diastolic, 0) / records.length)
    }
  }, [currentBP])

  const bsAvg = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split('T')[0]
    const records = currentBS.filter((r) => r.time >= weekStr)
    if (records.length === 0) return 0
    return (records.reduce((s, r) => s + r.value, 0) / records.length).toFixed(1)
  }, [currentBS])

  const abnormalCount = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split('T')[0]
    return [
      ...currentBP.filter((r) => r.time >= weekStr && r.status !== 'normal'),
      ...currentBS.filter((r) => r.time >= weekStr && r.status !== 'normal')
    ].length
  }, [currentBP, currentBS])

  const symptomCount = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString().split('T')[0]
    return currentSymptoms.filter((r) => r.time >= weekStr).length
  }, [currentSymptoms])

  const getOverallStatus = (): { text: string; status: HealthStatus } => {
    if (memberStats.abnormalCount > 3) return { text: '需关注', status: 'danger' }
    if (memberStats.abnormalCount > 0) return { text: '轻度偏高', status: 'warning' }
    return { text: '状态良好', status: 'normal' }
  }

  const handleMemberSelect = (memberId: string) => {
    setCurrentMember(memberId)
    Taro.showToast({
      title: `已切换到${familyMembers.find((m) => m.id === memberId)?.name}`,
      icon: 'success',
      duration: 1500
    })
  }

  const handleCall = (phone: string, name: string) => {
    Taro.showModal({
      title: '紧急呼叫',
      content: `确定要拨打 ${name} 的电话吗？`,
      confirmText: '拨打',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: phone.replace(/\*/g, '0'),
            fail: () => {
              Taro.showToast({
                title: '拨号失败，请手动拨打',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }

  const handleInvite = () => {
    Taro.showActionSheet({
      itemList: ['微信邀请', '短信邀请', '生成二维码'],
      success: (res) => {
        const actions = ['微信邀请', '短信邀请', '生成二维码']
        Taro.showToast({
          title: `${actions[res.tapIndex]}功能开发中`,
          icon: 'none'
        })
      }
    })
  }

  const overallStatus = getOverallStatus()

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>家庭协作</Text>
        <Text className={styles.subtitle}>家庭成员健康数据，实时同步共享</Text>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>当前查看成员</Text>
          <Text className={styles.sectionSubtitle}>点击切换查看其他成员</Text>
        </View>

        {currentMember && (
          <View className={styles.currentMemberCard}>
            <View className={styles.currentMemberHeader}>
              <View className={styles.currentAvatar}>
                <Text className={styles.currentAvatarText}>
                  {currentMember.name.charAt(0)}
                </Text>
              </View>
              <View className={styles.currentMemberInfo}>
                <Text className={styles.currentMemberName}>{currentMember.name}</Text>
                <View className={styles.currentMemberTag}>
                  {currentMember.relation} · {overallStatus.text}
                </View>
              </View>
            </View>

            <View className={styles.currentMemberStats}>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>
                  {memberStats.bpAvg
                    ? `${memberStats.bpAvg.systolic}/${memberStats.bpAvg.diastolic}`
                    : '--'}
                </Text>
                <Text className={styles.statLabel}>血压(mmHg)</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{memberStats.bsAvg || '--'}</Text>
                <Text className={styles.statLabel}>血糖(mmol/L)</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{memberStats.abnormalCount}</Text>
                <Text className={styles.statLabel}>近7天异常</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{memberStats.pendingReminders}</Text>
                <Text className={styles.statLabel}>待办提醒</Text>
              </View>
            </View>
          </View>
        )}

        {otherMembers.length > 0 && (
          <View className={styles.memberList}>
            {otherMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onClick={() => handleMemberSelect(member.id)}
                onCall={() => handleCall(member.phone, member.name)}
              />
            ))}
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本周健康概览</Text>
        </View>
        <View className={styles.weeklyCard}>
          <View className={styles.weeklyRow}>
            <View className={styles.weeklyItem}>
              <Text className={styles.weeklyLabel}>血压均值</Text>
              <Text className={styles.weeklyValue}>
                {bpAvg.systolic > 0 ? `${bpAvg.systolic}/${bpAvg.diastolic}` : '--/--'}
                <Text className={styles.weeklyUnit}> mmHg</Text>
              </Text>
            </View>
            <View className={styles.weeklyItem}>
              <Text className={styles.weeklyLabel}>血糖均值</Text>
              <Text className={styles.weeklyValue}>
                {bsAvg > 0 ? bsAvg : '--'}
                <Text className={styles.weeklyUnit}> mmol/L</Text>
              </Text>
            </View>
          </View>
          <View className={styles.weeklyRow}>
            <View className={styles.weeklyItem}>
              <Text className={styles.weeklyLabel}>异常次数</Text>
              <Text className={classnames(styles.weeklyValue, abnormalCount > 0 && styles.danger)}>
                {abnormalCount}
              </Text>
            </View>
            <View className={styles.weeklyItem}>
              <Text className={styles.weeklyLabel}>症状打卡</Text>
              <Text className={styles.weeklyValue}>{symptomCount} 次</Text>
            </View>
          </View>
          {currentWeeklyReports.length > 0 && (
            <View className={styles.weeklySummary}>
              <Text className={styles.weeklySummaryLabel}>医生点评</Text>
              <Text className={styles.weeklySummaryText}>{currentWeeklyReports[0].summary}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>数据同步</Text>
        </View>

        <View className={styles.syncCard}>
          <View className={styles.syncHeader}>
            <View className={styles.syncIcon}>🔄</View>
            <View className={styles.syncInfo}>
              <Text className={styles.syncTitle}>家庭数据同步</Text>
              <Text className={styles.syncDesc}>所有成员数据实时云端同步</Text>
            </View>
          </View>

          <View className={styles.syncStatus}>
            <View className={styles.syncDot} />
            <Text className={styles.syncStatusText}>同步正常</Text>
            <Text className={styles.syncTime}>
              最后同步：{formatDate(new Date().toISOString(), 'HH:mm')}
            </Text>
          </View>

          <View className={styles.syncFeatures}>
            <View className={styles.syncFeatureItem}>
              <Text className={styles.syncFeatureIcon}>📊</Text>
              <Text className={styles.syncFeatureText}>指标共享</Text>
            </View>
            <View className={styles.syncFeatureItem}>
              <Text className={styles.syncFeatureIcon}>📋</Text>
              <Text className={styles.syncFeatureText}>随访同步</Text>
            </View>
            <View className={styles.syncFeatureItem}>
              <Text className={styles.syncFeatureIcon}>⏰</Text>
              <Text className={styles.syncFeatureText}>提醒共享</Text>
            </View>
            <View className={styles.syncFeatureItem}>
              <Text className={styles.syncFeatureIcon}>📝</Text>
              <Text className={styles.syncFeatureText}>周报共享</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.emergencySection}>
        <View className={styles.sectionTitle}>
          <Text>紧急联系人</Text>
        </View>

        <View className={styles.emergencyCard}>
          <Text className={styles.emergencyTitle}>🚨 紧急呼叫</Text>
          <Text className={styles.emergencyDesc}>一键拨打紧急联系人电话</Text>

          <View className={styles.emergencyContacts}>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} className={styles.emergencyContactItem}>
                <View className={styles.emergencyContactAvatar}>
                  <Text className={styles.emergencyContactAvatarText}>
                    {contact.name.charAt(0)}
                  </Text>
                </View>
                <View className={styles.emergencyContactInfo}>
                  <Text className={styles.emergencyContactName}>{contact.name}</Text>
                  <Text className={styles.emergencyContactRelation}>
                    {contact.relation} · {contact.phone}
                  </Text>
                </View>
                <View
                  className={styles.emergencyCallBtn}
                  onClick={() => handleCall(contact.phone, contact.name)}
                >
                  <Text>📞</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.inviteCard} onClick={handleInvite}>
          <View className={styles.inviteIcon}>👥</View>
          <View className={styles.inviteInfo}>
            <Text className={styles.inviteTitle}>邀请家庭成员</Text>
            <Text className={styles.inviteDesc}>邀请更多家人加入，共同关注健康</Text>
          </View>
          <Text className={styles.inviteArrow}>›</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default FamilyPage
