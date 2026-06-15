import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusBadge from '@/components/StatusBadge'
import { formatTime, formatDate } from '@/utils/dateUtils'
import { getSugarPeriodText, getMealTypeText, getIntensityText, getSeverityText } from '@/utils/healthUtils'
import type {
  BloodPressureRecord,
  BloodSugarRecord,
  SymptomRecord,
  DietRecord,
  ExerciseRecord,
  RecordType
} from '@/types'

type RecordItemData = BloodPressureRecord | BloodSugarRecord | SymptomRecord | DietRecord | ExerciseRecord

interface RecordItemProps {
  type: RecordType
  record: RecordItemData
  onClick?: () => void
}

const RecordItem: React.FC<RecordItemProps> = ({ type, record, onClick }) => {
  const renderContent = () => {
    switch (type) {
      case 'bloodPressure': {
        const bp = record as BloodPressureRecord
        return (
          <>
            <View className={styles.mainContent}>
              <Text className={styles.bpValue}>
                <Text className={styles.bpSystolic}>{bp.systolic}</Text>
                <Text className={styles.bpSlash}>/</Text>
                <Text className={styles.bpDiastolic}>{bp.diastolic}</Text>
                <Text className={styles.bpUnit}> mmHg</Text>
              </Text>
              {bp.heartRate && (
                <Text className={styles.heartRate}>心率 {bp.heartRate} 次/分</Text>
              )}
            </View>
            <View className={styles.rightContent}>
              <StatusBadge status={bp.status} size='sm' />
            </View>
          </>
        )
      }
      case 'bloodSugar': {
        const bs = record as BloodSugarRecord
        return (
          <>
            <View className={styles.mainContent}>
              <Text className={styles.bsValue}>
                {bs.value.toFixed(1)}
                <Text className={styles.bsUnit}> mmol/L</Text>
              </Text>
              <Text className={styles.subInfo}>{getSugarPeriodText(bs.period)}</Text>
            </View>
            <View className={styles.rightContent}>
              <StatusBadge status={bs.status} size='sm' />
            </View>
          </>
        )
      }
      case 'symptom': {
        const sym = record as SymptomRecord
        return (
          <>
            <View className={styles.mainContent}>
              <Text className={styles.symptoms}>
                {sym.symptoms.join('、')}
              </Text>
              <Text className={styles.subInfo}>
                {getSeverityText(sym.severity)}
              </Text>
            </View>
            <View className={styles.rightContent}>
              <View
                className={styles.severityBadge}
                style={{
                  backgroundColor: sym.severity === 'severe' ? '#fef2f2' : sym.severity === 'moderate' ? '#fffbeb' : '#f0fdf4',
                  color: sym.severity === 'severe' ? '#ef4444' : sym.severity === 'moderate' ? '#f59e0b' : '#22c55e'
                }}
              >
                {getSeverityText(sym.severity)}
              </View>
            </View>
          </>
        )
      }
      case 'diet': {
        const diet = record as DietRecord
        return (
          <>
            <View className={styles.mainContent}>
              <Text className={styles.dietContent}>{diet.content}</Text>
              <Text className={styles.subInfo}>{getMealTypeText(diet.mealType)}</Text>
            </View>
          </>
        )
      }
      case 'exercise': {
        const ex = record as ExerciseRecord
        return (
          <>
            <View className={styles.mainContent}>
              <Text className={styles.exType}>{ex.type}</Text>
              <Text className={styles.subInfo}>
                {ex.duration}分钟 · {getIntensityText(ex.intensity)}
              </Text>
            </View>
          </>
        )
      }
      default:
        return null
    }
  }

  const typeConfig: Record<RecordType, { icon: string; color: string; label: string }> = {
    bloodPressure: { icon: '💓', color: '#3b82f6', label: '血压' },
    bloodSugar: { icon: '🩸', color: '#f59e0b', label: '血糖' },
    symptom: { icon: '🤒', color: '#ef4444', label: '症状' },
    diet: { icon: '🍽️', color: '#8b5cf6', label: '饮食' },
    exercise: { icon: '🏃', color: '#22c55e', label: '运动' }
  }

  const config = typeConfig[type]

  return (
    <View
      className={classnames(styles.item, onClick && styles.clickable)}
      onClick={onClick}
    >
      <View className={styles.iconWrapper} style={{ backgroundColor: `${config.color}15` }}>
        <Text className={styles.icon}>{config.icon}</Text>
      </View>

      <View className={styles.content}>
        {renderContent()}
        <View className={styles.footer}>
          <Text className={styles.time}>
            {formatDate(record.time)} {formatTime(record.time)}
          </Text>
          {(record as any).note && (
            <Text className={styles.note}>{(record as any).note}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default RecordItem
