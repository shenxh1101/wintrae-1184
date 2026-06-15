import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import TrendChart from '@/components/TrendChart'
import StatusBadge from '@/components/StatusBadge'
import { formatDate, formatTime } from '@/utils/dateUtils'
import { calculateAverage } from '@/utils/healthUtils'

const BloodPressurePage: React.FC = () => {
  const { bloodPressureRecords, bloodPressureTrend, deleteBloodPressure } = useHealthStore()

  const latestRecord = useMemo(() => bloodPressureRecords[0], [bloodPressureRecords])

  const recent7Days = useMemo(() => {
    return bloodPressureRecords.slice(0, 7)
  }, [bloodPressureRecords])

  const stats = useMemo(() => {
    if (recent7Days.length === 0) {
      return {
        avgSystolic: 0,
        avgDiastolic: 0,
        maxSystolic: 0,
        maxDiastolic: 0,
        minSystolic: 0,
        minDiastolic: 0,
        abnormalCount: 0
      }
    }

    const systolics = recent7Days.map((r) => r.systolic)
    const diastolics = recent7Days.map((r) => r.diastolic)

    return {
      avgSystolic: Math.round(calculateAverage(systolics)),
      avgDiastolic: Math.round(calculateAverage(diastolics)),
      maxSystolic: Math.max(...systolics),
      maxDiastolic: Math.max(...diastolics),
      minSystolic: Math.min(...systolics),
      minDiastolic: Math.min(...diastolics),
      abnormalCount: recent7Days.filter((r) => r.status !== 'normal').length
    }
  }, [recent7Days])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    Taro.showModal({
      title: '删除记录',
      content: '确定要删除这条血压记录吗？删除后无法恢复。',
      confirmText: '删除',
      confirmColor: '#ef4444'
    }).then((res) => {
      if (res.confirm) {
        deleteBloodPressure(id)
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        })
      }
    }).catch((err) => {
      console.error('[BloodPressurePage] 删除确认弹窗失败', err)
    })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>血压详情</Text>
        <Text className={styles.headerSubtitle}>共 {bloodPressureRecords.length} 条记录</Text>
      </View>

      {latestRecord && (
        <View className={styles.latestCard}>
          <View className={styles.latestHeader}>
            <Text className={styles.latestTitle}>最近测量</Text>
            <StatusBadge status={latestRecord.status} size='md' />
          </View>

          <View className={styles.latestValues}>
            <Text className={styles.latestSystolic}>{latestRecord.systolic}</Text>
            <Text className={styles.latestSlash}>/</Text>
            <Text className={styles.latestDiastolic}>{latestRecord.diastolic}</Text>
            <Text className={styles.latestUnit}>mmHg</Text>
          </View>

          <View className={styles.latestMeta}>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>
                {latestRecord.heartRate || '--'}
              </Text>
              <Text className={styles.metaLabel}>心率 (次/分)</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>
                {formatDate(latestRecord.time)}
              </Text>
              <Text className={styles.metaLabel}>测量日期</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaValue}>
                {formatTime(latestRecord.time)}
              </Text>
              <Text className={styles.metaLabel}>测量时间</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>近7天趋势</Text>
        </View>
        <View className={styles.trendCard}>
          <TrendChart
            data={bloodPressureTrend}
            color='#3b82f6'
            color2='#60a5fa'
            showLegend
            legend1='收缩压'
            legend2='舒张压'
            unit=''
          />
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>近7天统计</Text>
        </View>
        <View className={styles.statsCard}>
          <View className={styles.statsGrid}>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue}>
                {stats.avgSystolic}/{stats.avgDiastolic}
              </Text>
              <Text className={styles.statsLabel}>平均值</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue}>
                {stats.maxSystolic}/{stats.maxDiastolic}
              </Text>
              <Text className={styles.statsLabel}>最高值</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue}>
                {stats.minSystolic}/{stats.minDiastolic}
              </Text>
              <Text className={styles.statsLabel}>最低值</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={classnames(
                styles.statsValue,
                stats.abnormalCount > 0 && styles.statsWarn
              )}>
                {stats.abnormalCount}
              </Text>
              <Text className={styles.statsLabel}>异常次数</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>历史记录</Text>
        </View>
        <View className={styles.historyCard}>
          {bloodPressureRecords.length > 0 ? (
            bloodPressureRecords.map((record) => (
              <View
                key={record.id}
                className={styles.recordItem}
              >
                <View className={styles.recordIcon}>💓</View>
                <View className={styles.recordContent}>
                  <View className={styles.recordValues}>
                    <Text className={styles.recordSystolic}>{record.systolic}</Text>
                    <Text className={styles.recordSlash}>/</Text>
                    <Text className={styles.recordDiastolic}>{record.diastolic}</Text>
                    <Text style={{ fontSize: '24rpx', color: '#94a3b8', marginLeft: '8rpx' }}>mmHg</Text>
                  </View>
                  <View className={styles.recordMeta}>
                    <Text>{formatDate(record.time)} {formatTime(record.time)}</Text>
                    {record.heartRate && (
                      <Text className={styles.recordHeartRate}>· 心率 {record.heartRate}</Text>
                    )}
                    <StatusBadge status={record.status} size='sm' />
                  </View>
                </View>
                <View
                  className={styles.recordDelete}
                  onClick={(e) => handleDelete(record.id, e)}
                >
                  🗑️
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无血压记录</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default BloodPressurePage
