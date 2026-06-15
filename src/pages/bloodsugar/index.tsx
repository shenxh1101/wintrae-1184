import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import TrendChart from '@/components/TrendChart'
import StatusBadge from '@/components/StatusBadge'
import { formatDate, formatTime, getRelativeDateText } from '@/utils/dateUtils'
import { getSugarPeriodText, calculateAverage } from '@/utils/healthUtils'
import type { BloodSugarRecord } from '@/types'

const periodFilters = [
  { key: 'all', label: '全部' },
  { key: 'fasting', label: '空腹' },
  { key: 'beforeMeal', label: '餐前' },
  { key: 'afterMeal', label: '餐后' },
  { key: 'beforeSleep', label: '睡前' }
]

const periodIcons: Record<string, string> = {
  fasting: '🌅',
  beforeMeal: '🍽️',
  afterMeal: '🍱',
  beforeSleep: '🌙'
}

const BloodSugarPage: React.FC = () => {
  const { bloodSugarRecords, bloodSugarTrend } = useHealthStore()

  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')

  const latestRecord = useMemo(() => bloodSugarRecords[0], [bloodSugarRecords])

  const filteredRecords = useMemo(() => {
    if (selectedPeriod === 'all') return bloodSugarRecords
    return bloodSugarRecords.filter((r) => r.period === selectedPeriod)
  }, [bloodSugarRecords, selectedPeriod])

  const weekStats = useMemo(() => {
    const recent = bloodSugarRecords.slice(0, 7)
    if (recent.length === 0) {
      return {
        average: 0,
        max: 0,
        min: 0,
        abnormalCount: 0
      }
    }

    const values = recent.map((r) => r.value)
    const abnormalCount = recent.filter((r) => r.status !== 'normal').length

    return {
      average: calculateAverage(values),
      max: Math.max(...values),
      min: Math.min(...values),
      abnormalCount
    }
  }, [bloodSugarRecords])

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/record/index?tab=bloodSugar' }).catch((err) => {
      console.error('[BloodSugarPage] 跳转记录页面失败', err)
    })
  }

  const handleRecordClick = (record: BloodSugarRecord) => {
    console.log('[BloodSugarPage] 点击记录', record)
  }

  const renderLatestCard = () => {
    if (!latestRecord) return null

    return (
      <View className={styles.latestCard}>
        <View className={styles.latestHeader}>
          <Text className={styles.latestTitle}>最近测量</Text>
          <StatusBadge status={latestRecord.status} size='md' />
        </View>

        <View className={styles.latestValueRow}>
          <Text className={styles.latestValue}>{latestRecord.value.toFixed(1)}</Text>
          <Text className={styles.latestUnit}>mmol/L</Text>
        </View>

        <View className={styles.latestInfo}>
          <View className={styles.latestPeriod}>
            <Text className={styles.periodIcon}>{periodIcons[latestRecord.period]}</Text>
            <Text className={styles.periodText}>{getSugarPeriodText(latestRecord.period)}</Text>
          </View>
          <Text className={styles.latestTime}>
            {getRelativeDateText(latestRecord.time)} {formatTime(latestRecord.time)}
          </Text>
        </View>
      </View>
    )
  }

  const renderStatsCard = () => {
    return (
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>近7天统计</Text>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>
                {weekStats.average.toFixed(1)}
                <Text className={styles.statUnit}>mmol/L</Text>
              </Text>
              <Text className={styles.statLabel}>平均值</Text>
            </View>

            <View className={styles.statItem}>
              <Text className={classnames(styles.statValue, weekStats.max >= 11.1 && styles.statValueDanger, weekStats.max >= 7.8 && weekStats.max < 11.1 && styles.statValueWarn)}>
                {weekStats.max.toFixed(1)}
                <Text className={styles.statUnit}>mmol/L</Text>
              </Text>
              <Text className={styles.statLabel}>最高值</Text>
            </View>

            <View className={styles.statItem}>
              <Text className={styles.statValue}>
                {weekStats.min.toFixed(1)}
                <Text className={styles.statUnit}>mmol/L</Text>
              </Text>
              <Text className={styles.statLabel}>最低值</Text>
            </View>

            <View className={styles.statItem}>
              <Text className={classnames(styles.statValue, weekStats.abnormalCount > 0 && styles.statValueWarn)}>
                {weekStats.abnormalCount}
                <Text className={styles.statUnit}>次</Text>
              </Text>
              <Text className={styles.statLabel}>异常次数</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderTrendCard = () => {
    return (
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>血糖趋势</Text>
        </View>

        <View className={styles.trendCard}>
          <TrendChart
            data={bloodSugarTrend}
            color='#f59e0b'
            unit=' mmol/L'
          />
        </View>
      </View>
    )
  }

  const renderHistoryList = () => {
    return (
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>历史记录</Text>
          <Text className={styles.sectionMore}>共 {filteredRecords.length} 条</Text>
        </View>

        <View className={styles.periodFilter}>
          {periodFilters.map((filter) => (
            <View
              key={filter.key}
              className={classnames(styles.periodOption, selectedPeriod === filter.key && styles.active)}
              onClick={() => setSelectedPeriod(filter.key)}>
              {filter.label}
            </View>
          ))}
        </View>

        <View className={styles.historyCard}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <View
                key={record.id}
                className={styles.historyItem}
                onClick={() => handleRecordClick(record)}>
                <View className={styles.itemIcon}>
                  <Text className={styles.itemIconText}>{periodIcons[record.period]}</Text>
                </View>

                <View className={styles.itemContent}>
                  <View className={styles.itemMain}>
                    <Text className={styles.itemValue}>
                      {record.value.toFixed(1)}
                      <Text className={styles.itemUnit}>mmol/L</Text>
                    </Text>
                    <StatusBadge status={record.status} size='sm' />
                  </View>

                  <View className={styles.itemSub}>
                    <Text className={styles.itemPeriod}>
                      {getSugarPeriodText(record.period)}
                      {record.note && ` · ${record.note}`}
                    </Text>
                    <Text className={styles.itemTime}>
                      {formatDate(record.time)} {formatTime(record.time)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📊</Text>
              <Text className={styles.emptyText}>暂无该时段的血糖记录</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>血糖管理</Text>
        <Text className={styles.headerSubtitle}>监测血糖变化，保持健康生活</Text>
      </View>

      {renderLatestCard()}

      {renderStatsCard()}

      {renderTrendCard()}

      {renderHistoryList()}

      <View className={styles.addBtn} onClick={handleAddRecord}>
        <Text className={styles.addIcon}>+</Text>
        <Text className={styles.addText}>记录血糖</Text>
      </View>
    </ScrollView>
  )
}

export default BloodSugarPage
