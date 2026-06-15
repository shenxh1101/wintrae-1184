import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import { formatDate, getRelativeDateText } from '@/utils/dateUtils'

const tabs = [
  { key: 'followup', label: '随访问卷' },
  { key: 'report', label: '周报汇总' },
  { key: 'advice', label: '医生建议' }
]

const FollowupPage: React.FC = () => {
  const { followups, weeklyReports, doctorAdvices } = useHealthStore()
  const [activeTab, setActiveTab] = useState('followup')
  const [selectedFollowup, setSelectedFollowup] = useState<string | null>(null)

  const handleFollowupClick = (followup: any) => {
    if (followup.status === 'pending') {
      Taro.navigateTo({ url: '/pages/questionnaire/index' }).catch((err) => {
        console.error('[FollowupPage] 跳转问卷页面失败', err)
      })
    } else {
      setSelectedFollowup(selectedFollowup === followup.id ? null : followup.id)
    }
  }

  const handleReportClick = (reportId: string) => {
    Taro.showToast({ title: '查看周报详情', icon: 'none' })
  }

  const renderFollowupList = () => {
    if (followups.length === 0) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无随访问卷</Text>
        </View>
      )
    }

    return (
      <>
        {followups.map((followup) => (
          <View key={followup.id}>
            <View
              className={styles.followupCard}
              onClick={() => handleFollowupClick(followup)}>
              <View className={styles.followupHeader}>
                <Text className={styles.followupTitle}>{followup.title}</Text>
                <View className={classnames(styles.followupStatus, followup.status)}>
                  {followup.status === 'pending' ? '待完成' : followup.status === 'completed' ? '已完成' : '已过期'}
                </View>
              </View>
              <Text className={styles.followupDate}>
                {getRelativeDateText(followup.date)} · {formatDate(followup.date)}
              </Text>
              {followup.status === 'pending' && (
                <>
                  <View className={styles.followupProgress}>
                    <View className={styles.followupProgressFill} style={{ width: '0%' }} />
                  </View>
                  <Text className={styles.followupQuestions}>
                    共 {followup.questions.length} 道问题，含 {followup.questions.filter((q) => q.required).length} 道必答题
                  </Text>
                </>
              )}
              {followup.status === 'completed' && (
                <>
                  <View className={styles.followupProgress}>
                    <View className={styles.followupProgressFill} style={{ width: '100%' }} />
                  </View>
                  <Text className={styles.followupQuestions}>
                    已完成，点击查看医生回复
                  </Text>
                </>
              )}
            </View>

            {selectedFollowup === followup.id && followup.status === 'completed' && (
              <View className={styles.detailCard}>
                <Text className={styles.detailTitle}>问卷详情</Text>
                <Text className={styles.detailDate}>
                  完成时间：{formatDate(followup.date)}
                </Text>
                {followup.questions.map((q, index) => (
                  <View key={q.id} className={styles.questionItem}>
                    <Text className={styles.questionText}>
                      {index + 1}. {q.question}
                      {q.required && <Text className={styles.questionRequired}>*</Text>}
                    </Text>
                    {followup.answers && followup.answers[q.id] && (
                      Array.isArray(followup.answers[q.id]) ? (
                        <View className={styles.answerTags}>
                          {(followup.answers[q.id] as string[]).map((a, i) => (
                            <Text key={i} className={styles.answerTag}>{a}</Text>
                          ))}
                        </View>
                      ) : (
                        <Text className={styles.answerText}>{followup.answers[q.id]}</Text>
                      )
                    )}
                  </View>
                ))}
                {followup.doctorAdvice && (
                  <View className={styles.doctorAdviceSection}>
                    <Text className={styles.doctorAdviceTitle}>
                      <Text className={styles.doctorAdviceIcon}>💬</Text>
                      医生建议
                    </Text>
                    <Text className={styles.doctorAdviceContent}>{followup.doctorAdvice}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </>
    )
  }

  const renderReportList = () => {
    if (weeklyReports.length === 0) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>暂无周报数据</Text>
        </View>
      )
    }

    return (
      <>
        {weeklyReports.map((report) => (
          <View
            key={report.id}
            className={styles.reportCard}
            onClick={() => handleReportClick(report.id)}>
            <View className={styles.reportHeader}>
              <Text className={styles.reportTitle}>每周健康报告</Text>
              <Text className={styles.reportDate}>
                {formatDate(report.weekStart, 'MM/DD')} - {formatDate(report.weekEnd, 'MM/DD')}
              </Text>
            </View>
            <View className={styles.reportStats}>
              <View className={styles.statItem}>
                <Text className={classnames(styles.statValue, report.bloodPressureAvg.systolic > 130 ? styles.statValueWarn : styles.statValueGood)}>
                  {report.bloodPressureAvg.systolic}/{report.bloodPressureAvg.diastolic}
                </Text>
                <Text className={styles.statLabel}>血压均值</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={classnames(styles.statValue, report.bloodSugarAvg > 7 ? styles.statValueWarn : styles.statValueGood)}>
                  {report.bloodSugarAvg.toFixed(1)}
                </Text>
                <Text className={styles.statLabel}>血糖均值</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={classnames(styles.statValue, report.abnormalCount > 0 ? styles.statValueWarn : styles.statValueGood)}>
                  {report.abnormalCount}
                </Text>
                <Text className={styles.statLabel}>异常次数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={classnames(styles.statValue, report.medicationCompliance >= 90 ? styles.statValueGood : styles.statValueWarn)}>
                  {report.medicationCompliance}%
                </Text>
                <Text className={styles.statLabel}>用药依从性</Text>
              </View>
            </View>
            {report.symptoms.length > 0 && (
              <View className={styles.reportSymptoms}>
                <Text className={styles.symptomsTitle}>本周症状</Text>
                <View className={styles.symptomTags}>
                  {report.symptoms.map((s, i) => (
                    <Text key={i} className={styles.symptomTag}>{s}</Text>
                  ))}
                </View>
              </View>
            )}
            <View className={styles.reportSummary}>
              <Text className={styles.summaryText}>{report.summary}</Text>
            </View>
          </View>
        ))}
      </>
    )
  }

  const renderAdviceList = () => {
    if (doctorAdvices.length === 0) {
      return (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💊</Text>
          <Text className={styles.emptyText}>暂无医生建议</Text>
        </View>
      )
    }

    return (
      <>
        {doctorAdvices.map((advice) => (
          <View key={advice.id} className={styles.adviceCard}>
            <View className={styles.adviceHeader}>
              <Text className={styles.adviceDoctor}>{advice.doctorName}</Text>
              <Text className={styles.adviceDate}>{formatDate(advice.date)}</Text>
            </View>
            <Text className={styles.adviceHospital}>{advice.hospital}</Text>
            <Text className={styles.adviceContent}>{advice.content}</Text>
            {advice.nextVisit && (
              <View className={styles.adviceNextVisit}>
                <Text className={styles.nextVisitLabel}>下次复诊</Text>
                <Text className={styles.nextVisitDate}>
                  {getRelativeDateText(advice.nextVisit)} · {formatDate(advice.nextVisit, 'MM月DD日')}
                </Text>
              </View>
            )}
          </View>
        ))}
      </>
    )
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => {
              setActiveTab(tab.key)
              setSelectedFollowup(null)
            }}>
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.section}>
        {activeTab === 'followup' && renderFollowupList()}
        {activeTab === 'report' && renderReportList()}
        {activeTab === 'advice' && renderAdviceList()}
      </View>
    </ScrollView>
  )
}

export default FollowupPage
