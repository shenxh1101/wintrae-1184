import React, { useState, useMemo } from 'react'
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import RecordItem from '@/components/RecordItem'
import { getBloodPressureStatus, getBloodSugarStatus } from '@/utils/healthUtils'
import type { RecordType } from '@/types'

const tabs = [
  { key: 'bloodPressure', label: '血压' },
  { key: 'bloodSugar', label: '血糖' },
  { key: 'symptom', label: '症状' },
  { key: 'diet', label: '饮食' },
  { key: 'exercise', label: '运动' }
]

const symptomOptions = ['头晕', '头痛', '胸闷', '胸痛', '气短', '乏力', '失眠', '恶心', '心悸', '出汗']
const exerciseTypes = ['散步', '快走', '慢跑', '太极拳', '游泳', '健身操', '骑行', '瑜伽']
const mealOptions = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' },
  { key: 'snack', label: '加餐' }
]
const sugarPeriods = [
  { key: 'fasting', label: '空腹' },
  { key: 'beforeMeal', label: '餐前' },
  { key: 'afterMeal', label: '餐后' },
  { key: 'beforeSleep', label: '睡前' }
]

const RecordPage: React.FC = () => {
  const {
    bloodPressureRecords,
    bloodSugarRecords,
    symptomRecords,
    dietRecords,
    exerciseRecords,
    addBloodPressure,
    addBloodSugar,
    addSymptom,
    addDiet,
    addExercise
  } = useHealthStore()

  const [activeTab, setActiveTab] = useState<RecordType>('bloodPressure')
  const [showInput, setShowInput] = useState(false)

  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [heartRate, setHeartRate] = useState('')
  const [sugarValue, setSugarValue] = useState('')
  const [sugarPeriod, setSugarPeriod] = useState<'fasting' | 'beforeMeal' | 'afterMeal' | 'beforeSleep'>('fasting')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild')
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [dietContent, setDietContent] = useState('')
  const [exerciseType, setExerciseType] = useState('')
  const [duration, setDuration] = useState('')
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'vigorous'>('moderate')
  const [note, setNote] = useState('')

  const currentRecords = useMemo(() => {
    switch (activeTab) {
      case 'bloodPressure': return bloodPressureRecords
      case 'bloodSugar': return bloodSugarRecords
      case 'symptom': return symptomRecords
      case 'diet': return dietRecords
      case 'exercise': return exerciseRecords
      default: return []
    }
  }, [activeTab, bloodPressureRecords, bloodSugarRecords, symptomRecords, dietRecords, exerciseRecords])

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const resetForm = () => {
    setSystolic('')
    setDiastolic('')
    setHeartRate('')
    setSugarValue('')
    setSugarPeriod('fasting')
    setSelectedSymptoms([])
    setSeverity('mild')
    setMealType('breakfast')
    setDietContent('')
    setExerciseType('')
    setDuration('')
    setIntensity('moderate')
    setNote('')
  }

  const handleSubmit = () => {
    const time = new Date().toISOString().replace('T', ' ').substring(0, 16)

    try {
      switch (activeTab) {
        case 'bloodPressure': {
          const sys = parseInt(systolic)
          const dia = parseInt(diastolic)
          if (!sys || !dia) {
            Taro.showToast({ title: '请输入完整的血压值', icon: 'none' })
            return
          }
          addBloodPressure({
            systolic: sys,
            diastolic: dia,
            heartRate: heartRate ? parseInt(heartRate) : undefined,
            time,
            status: getBloodPressureStatus(sys, dia),
            note: note || undefined
          })
          break
        }
        case 'bloodSugar': {
          const val = parseFloat(sugarValue)
          if (!val) {
            Taro.showToast({ title: '请输入血糖值', icon: 'none' })
            return
          }
          addBloodSugar({
            value: val,
            period: sugarPeriod,
            time,
            status: getBloodSugarStatus(val, sugarPeriod),
            note: note || undefined
          })
          break
        }
        case 'symptom': {
          if (selectedSymptoms.length === 0) {
            Taro.showToast({ title: '请选择症状', icon: 'none' })
            return
          }
          addSymptom({
            symptoms: selectedSymptoms,
            severity,
            time,
            note: note || undefined
          })
          break
        }
        case 'diet': {
          if (!dietContent.trim()) {
            Taro.showToast({ title: '请输入饮食内容', icon: 'none' })
            return
          }
          addDiet({
            mealType,
            content: dietContent.trim(),
            time
          })
          break
        }
        case 'exercise': {
          if (!exerciseType || !duration) {
            Taro.showToast({ title: '请填写完整信息', icon: 'none' })
            return
          }
          addExercise({
            type: exerciseType,
            duration: parseInt(duration),
            intensity,
            time,
            note: note || undefined
          })
          break
        }
      }

      Taro.showToast({ title: '记录成功', icon: 'success' })
      resetForm()
      setShowInput(false)
    } catch (error) {
      console.error('[RecordPage] 保存记录失败', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  const renderInputForm = () => {
    switch (activeTab) {
      case 'bloodPressure':
        return (
          <View className={styles.inputCard}>
            <View className={styles.inputRow}>
              <View className={styles.inputGroup}>
                <Text className={styles.inputLabel}>收缩压（高压）</Text>
                <Input
                  className={styles.input}
                  type='number'
                  value={systolic}
                  onInput={(e) => setSystolic(e.detail.value)}
                  placeholder='如：130'
                />
              </View>
              <View className={styles.inputGroup}>
                <Text className={styles.inputLabel}>舒张压（低压）</Text>
                <Input
                  className={styles.input}
                  type='number'
                  value={diastolic}
                  onInput={(e) => setDiastolic(e.detail.value)}
                  placeholder='如：85'
                />
              </View>
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>心率（次/分）</Text>
              <Input
                className={styles.input}
                type='number'
                value={heartRate}
                onInput={(e) => setHeartRate(e.detail.value)}
                placeholder='可选，如：72'
              />
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>备注</Text>
              <Textarea
                className={styles.textarea}
                value={note}
                onInput={(e) => setNote(e.detail.value)}
                placeholder='记录身体状态、用药情况等'
              />
            </View>
          </View>
        )

      case 'bloodSugar':
        return (
          <View className={styles.inputCard}>
            <Text className={styles.inputLabel}>测量时段</Text>
            <View className={styles.periodSelector}>
              {sugarPeriods.map((period) => (
                <View
                  key={period.key}
                  className={classnames(styles.periodOption, sugarPeriod === period.key && styles.active)}
                  onClick={() => setSugarPeriod(period.key as any)}>
                  {period.label}
                </View>
              ))}
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>血糖值（mmol/L）</Text>
              <Input
                className={styles.input}
                type='digit'
                value={sugarValue}
                onInput={(e) => setSugarValue(e.detail.value)}
                placeholder='如：6.8'
              />
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>备注</Text>
              <Textarea
                className={styles.textarea}
                value={note}
                onInput={(e) => setNote(e.detail.value)}
                placeholder='记录饮食情况、运动情况等'
              />
            </View>
          </View>
        )

      case 'symptom':
        return (
          <View className={styles.inputCard}>
            <Text className={styles.inputLabel}>选择症状</Text>
            <View className={styles.symptomSelector}>
              {symptomOptions.map((symptom) => (
                <View
                  key={symptom}
                  className={classnames(styles.symptomOption, selectedSymptoms.includes(symptom) && styles.active)}
                  onClick={() => toggleSymptom(symptom)}>
                  {symptom}
                </View>
              ))}
            </View>
            <Text className={styles.inputLabel}>严重程度</Text>
            <View className={styles.severitySelector}>
              <View
                className={classnames(styles.severityOption, styles.mild, severity === 'mild' && styles.active)}
                onClick={() => setSeverity('mild')}>
                轻微
              </View>
              <View
                className={classnames(styles.severityOption, styles.moderate, severity === 'moderate' && styles.active)}
                onClick={() => setSeverity('moderate')}>
                中等
              </View>
              <View
                className={classnames(styles.severityOption, styles.severe, severity === 'severe' && styles.active)}
                onClick={() => setSeverity('severe')}>
                严重
              </View>
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>备注</Text>
              <Textarea
                className={styles.textarea}
                value={note}
                onInput={(e) => setNote(e.detail.value)}
                placeholder='描述症状细节、持续时间等'
              />
            </View>
          </View>
        )

      case 'diet':
        return (
          <View className={styles.inputCard}>
            <Text className={styles.inputLabel}>餐次</Text>
            <View className={styles.mealSelector}>
              {mealOptions.map((meal) => (
                <View
                  key={meal.key}
                  className={classnames(styles.mealOption, mealType === meal.key && styles.active)}
                  onClick={() => setMealType(meal.key as any)}>
                  {meal.label}
                </View>
              ))}
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>饮食内容</Text>
              <Textarea
                className={styles.textarea}
                value={dietContent}
                onInput={(e) => setDietContent(e.detail.value)}
                placeholder='例如：糙米饭、清蒸鱼、炒青菜'
              />
            </View>
          </View>
        )

      case 'exercise':
        return (
          <View className={styles.inputCard}>
            <Text className={styles.inputLabel}>运动类型</Text>
            <View className={styles.exerciseTypeSelector}>
              {exerciseTypes.map((type) => (
                <View
                  key={type}
                  className={classnames(styles.exerciseTypeOption, exerciseType === type && styles.active)}
                  onClick={() => setExerciseType(type)}>
                  {type}
                </View>
              ))}
            </View>
            <View className={styles.inputRow}>
              <View className={styles.inputGroup}>
                <Text className={styles.inputLabel}>运动时长（分钟）</Text>
                <Input
                  className={styles.input}
                  type='number'
                  value={duration}
                  onInput={(e) => setDuration(e.detail.value)}
                  placeholder='如：30'
                />
              </View>
            </View>
            <Text className={styles.inputLabel}>运动强度</Text>
            <View className={styles.intensitySelector}>
              <View
                className={classnames(styles.intensityOption, styles.light, intensity === 'light' && styles.active)}
                onClick={() => setIntensity('light')}>
                轻度
              </View>
              <View
                className={classnames(styles.intensityOption, styles.moderate, intensity === 'moderate' && styles.active)}
                onClick={() => setIntensity('moderate')}>
                中度
              </View>
              <View
                className={classnames(styles.intensityOption, styles.vigorous, intensity === 'vigorous' && styles.active)}
                onClick={() => setIntensity('vigorous')}>
                高强度
              </View>
            </View>
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>备注</Text>
              <Textarea
                className={styles.textarea}
                value={note}
                onInput={(e) => setNote(e.detail.value)}
                placeholder='记录运动感受等'
              />
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => {
              setActiveTab(tab.key as RecordType)
              setShowInput(false)
              resetForm()
            }}>
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.addSection}>
        <View className={styles.addBtn} onClick={() => setShowInput(!showInput)}>
          <Text className={styles.addIcon}>{showInput ? '✕' : '+'}</Text>
          <Text className={styles.addText}>{showInput ? '取消' : `新增${tabs.find((t) => t.key === activeTab)?.label}记录`}</Text>
        </View>
      </View>

      {showInput && (
        <View className={styles.inputSection}>
          {renderInputForm()}
          <View className={styles.submitBtn} onClick={handleSubmit}>
            <Text className={styles.submitText}>保存记录</Text>
          </View>
        </View>
      )}

      <View className={styles.historySection}>
        <View className={styles.historyHeader}>
          <Text className={styles.historyTitle}>历史记录</Text>
          <Text className={styles.historyCount}>共 {currentRecords.length} 条</Text>
        </View>

        {currentRecords.length > 0 ? (
          currentRecords.map((record, index) => (
            <RecordItem key={`${activeTab}-${index}`} type={activeTab} record={record as any} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无记录，点击上方按钮添加</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default RecordPage
