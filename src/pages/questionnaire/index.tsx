import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useHealthStore } from '@/store/healthStore'
import { formatDate, getRelativeDateText } from '@/utils/dateUtils'
import type { FollowupRecord, FollowupQuestion } from '@/types'

const tabs = [
  { key: 'pending', label: '待完成' },
  { key: 'completed', label: '已完成' }
]

const QuestionnairePage: React.FC = () => {
  const { currentFollowups, submitFollowup } = useHealthStore()
  const router = useRouter()
  const followups = currentFollowups()
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentAnsweringId, setCurrentAnsweringId] = useState<string | null>(null)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const followup = followups.find((f) => f.id === id)
      if (followup) {
        setExpandedId(id)
        if (followup.status === 'completed') {
          setActiveTab('completed')
        } else {
          setActiveTab('pending')
        }
      }
    }
  }, [router.params.id, followups])

  const pendingFollowups = useMemo(
    () => followups.filter((f) => f.status === 'pending' || f.status === 'expired'),
    [followups]
  )

  const completedFollowups = useMemo(
    () => followups.filter((f) => f.status === 'completed'),
    [followups]
  )

  const currentList = activeTab === 'pending' ? pendingFollowups : completedFollowups

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleStartQuestionnaire = (followup: FollowupRecord) => {
    if (followup.status === 'expired') {
      Taro.showToast({ title: '问卷已过期', icon: 'none' })
      return
    }
    setCurrentAnsweringId(followup.id)
    setAnswers({})
  }

  const handleCancelAnswer = () => {
    setCurrentAnsweringId(null)
    setAnswers({})
  }

  const handleSubmitAnswer = (followup: FollowupRecord) => {
    const unansweredRequired = followup.questions.filter(
      (q) => q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length === 0))
    )
    if (unansweredRequired.length > 0) {
      Taro.showToast({ title: '请完成所有必答题', icon: 'none' })
      return
    }
    submitFollowup(followup.id, answers)
    Taro.showToast({ title: '提交成功', icon: 'success' })
    setCurrentAnsweringId(null)
    setAnswers({})
    setActiveTab('completed')
    setExpandedId(followup.id)
  }

  const handleSingleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleMultipleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || []
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      return { ...prev, [questionId]: updated }
    })
  }

  const handleNumberInput = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleTextInput = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待完成'
      case 'completed':
        return '已完成'
      case 'expired':
        return '已过期'
      default:
        return ''
    }
  }

  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'single':
        return '单选题'
      case 'multiple':
        return '多选题'
      case 'text':
        return '文本题'
      case 'number':
        return '数字题'
      default:
        return ''
    }
  }

  const renderAnswer = (question: FollowupQuestion, answers?: Record<string, string | string[]>) => {
    if (!answers || !answers[question.id]) {
      return <Text className={styles.textAnswer}>未填写</Text>
    }

    const answer = answers[question.id]

    if (question.type === 'multiple' && Array.isArray(answer)) {
      return (
        <View className={styles.answerTags}>
          {answer.map((item, index) => (
            <Text key={index} className={styles.answerTag}>{item}</Text>
          ))}
        </View>
      )
    }

    if (question.type === 'number') {
      return <Text className={styles.numberAnswer}>{answer}</Text>
    }

    if (question.type === 'text') {
      return <Text className={styles.textAnswer}>{answer}</Text>
    }

    return <Text className={styles.textAnswer}>{answer}</Text>
  }

  const renderAnsweringQuestion = (question: FollowupQuestion, index: number) => {
    const currentAnswer = answers[question.id]
    const isAnswered = currentAnswer && (!Array.isArray(currentAnswer) || currentAnswer.length > 0)

    return (
      <View key={question.id} className={styles.questionItem}>
        <Text className={styles.questionText}>
          {index + 1}. {question.question}
          {question.required && <Text className={styles.questionRequired}>*</Text>}
        </Text>
        <Text className={styles.questionType}>{getQuestionTypeText(question.type)}</Text>

        {(question.type === 'single' || question.type === 'multiple') && question.options && (
          <View className={styles.optionList}>
            {question.options.map((option, optIndex) => {
              const isSelected = isAnswered && (
                question.type === 'multiple'
                  ? Array.isArray(currentAnswer) && (currentAnswer as string[]).includes(option)
                  : currentAnswer === option
              )

              return (
                <View
                  key={optIndex}
                  className={classnames(styles.optionItem, isSelected && styles.selected)}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (question.type === 'single') {
                      handleSingleSelect(question.id, option)
                    } else {
                      handleMultipleSelect(question.id, option)
                    }
                  }}>
                  <View className={classnames(
                    question.type === 'multiple' ? styles.optionCheckbox : styles.optionRadio,
                    isSelected && styles.selected
                  )}>
                    {isSelected && question.type === 'multiple' && '✓'}
                  </View>
                  <Text>{option}</Text>
                </View>
              )
            })}
          </View>
        )}

        {question.type === 'number' && (
          <Input
            className={styles.numberInput}
            type='digit'
            placeholder='请输入数字'
            value={(currentAnswer as string) || ''}
            onInput={(e) => handleNumberInput(question.id, e.detail.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {question.type === 'text' && (
          <Textarea
            className={styles.textInput}
            placeholder='请输入内容'
            value={(currentAnswer as string) || ''}
            onInput={(e) => handleTextInput(question.id, e.detail.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </View>
    )
  }

  const renderQuestion = (question: FollowupQuestion, index: number, answers?: Record<string, string | string[]>) => {
    const hasAnswer = answers && answers[question.id]

    return (
      <View key={question.id} className={styles.questionItem}>
        <Text className={styles.questionText}>
          {index + 1}. {question.question}
          {question.required && <Text className={styles.questionRequired}>*</Text>}
        </Text>
        <Text className={styles.questionType}>{getQuestionTypeText(question.type)}</Text>

        {(question.type === 'single' || question.type === 'multiple') && question.options && (
          <View className={styles.optionList}>
            {question.options.map((option, optIndex) => {
              const isSelected = hasAnswer && (
                question.type === 'multiple'
                  ? Array.isArray(answers![question.id]) && (answers![question.id] as string[]).includes(option)
                  : answers![question.id] === option
              )

              return (
                <View
                  key={optIndex}
                  className={classnames(styles.optionItem, isSelected && styles.selected)}>
                  <View className={classnames(
                    question.type === 'multiple' ? styles.optionCheckbox : styles.optionRadio,
                    isSelected && styles.selected
                  )}>
                    {isSelected && question.type === 'multiple' && '✓'}
                  </View>
                  <Text>{option}</Text>
                </View>
              )
            })}
          </View>
        )}

        {activeTab === 'completed' && renderAnswer(question, answers)}
      </View>
    )
  }

  const renderCard = (followup: FollowupRecord) => {
    const isExpanded = expandedId === followup.id
    const isAnswering = currentAnsweringId === followup.id
    const completedCount = followup.answers
      ? Object.keys(followup.answers).filter((key) => followup.answers![key]).length
      : 0
    const progress = followup.status === 'completed' ? 100 : 0

    return (
      <View key={followup.id}>
        <View
          className={styles.questionnaireCard}
          onClick={() => handleCardClick(followup.id)}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>{followup.title}</Text>
            <View className={classnames(styles.statusBadge, followup.status)}>
              {getStatusText(followup.status)}
            </View>
          </View>

          <Text className={styles.cardDate}>
            截止日期：{getRelativeDateText(followup.date)} · {formatDate(followup.date)}
          </Text>

          <View className={styles.cardProgress}>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${progress}%` }} />
            </View>
            <Text className={styles.progressText}>
              {activeTab === 'completed'
                ? `${completedCount}/${followup.questions.length}`
                : `共 ${followup.questions.length} 题`}
            </Text>
          </View>

          <Text className={styles.cardMeta}>
            {followup.questions.filter((q) => q.required).length} 道必答题 · {followup.questions.length - followup.questions.filter((q) => q.required).length} 道选答题
          </Text>

          <View className={classnames(styles.expandIcon, isExpanded && styles.expanded)}>
            {isExpanded ? '▲' : '▼'}
          </View>

          {isExpanded && (
            <View className={styles.detailSection} onClick={(e) => e.stopPropagation()}>
              {isAnswering ? (
                <>
                  <Text className={styles.detailTitle}>答题中</Text>
                  {followup.questions.map((question, index) =>
                    renderAnsweringQuestion(question, index)
                  )}
                  <View className={styles.actionSection}>
                    <View
                      className={styles.cancelBtn}
                      onClick={handleCancelAnswer}>
                      取消
                    </View>
                    <View
                      className={styles.startBtn}
                      onClick={() => handleSubmitAnswer(followup)}>
                      提交
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text className={styles.detailTitle}>问卷详情</Text>

                  {followup.status === 'completed' && (
                    <View className={styles.completionInfo}>
                      <Text className={styles.completionText}>完成时间</Text>
                      <Text className={styles.completionValue}>{formatDate(followup.completedDate || followup.date)}</Text>
                    </View>
                  )}

                  {followup.questions.map((question, index) =>
                    renderQuestion(question, index, followup.answers)
                  )}

                  {followup.doctorAdvice && (
                    <View className={styles.doctorAdviceSection}>
                      <Text className={styles.doctorAdviceTitle}>
                        <Text className={styles.doctorAdviceIcon}>💬</Text>
                        医生建议
                      </Text>
                      <Text className={styles.doctorAdviceContent}>{followup.doctorAdvice}</Text>
                    </View>
                  )}

                  {followup.status === 'pending' && (
                    <View className={styles.actionSection}>
                      <View
                        className={classnames(styles.startBtn, followup.status === 'expired' && styles.disabled)}
                        onClick={handleStartQuestionnaire.bind(null, followup)}>
                        开始答题
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderEmpty = () => (
    <View className={styles.emptyState}>
      <Text className={styles.emptyIcon}>📋</Text>
      <Text className={styles.emptyText}>
        {activeTab === 'pending' ? '暂无待完成问卷' : '暂无已完成问卷'}
      </Text>
    </View>
  )

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>随访问卷</Text>
        <Text className={styles.headerSubtitle}>
          共 {followups.length} 份问卷，待完成 {pendingFollowups.length} 份
        </Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => {
              setActiveTab(tab.key as 'pending' | 'completed')
              setExpandedId(null)
            }}>
            {tab.label}
            {tab.key === 'pending' && pendingFollowups.length > 0 && ` (${pendingFollowups.length})`}
            {tab.key === 'completed' && completedFollowups.length > 0 && ` (${completedFollowups.length})`}
          </View>
        ))}
      </View>

      <View className={styles.section}>
        {currentList.length > 0 ? currentList.map(renderCard) : renderEmpty()}
      </View>
    </ScrollView>
  )
}

export default QuestionnairePage
