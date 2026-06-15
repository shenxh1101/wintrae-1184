import type { FollowupRecord } from '@/types'

export const mockFollowups: FollowupRecord[] = [
  {
    id: 'f1',
    title: '6月月度随访问卷',
    date: '2026-06-16',
    status: 'pending',
    questions: [
      {
        id: 'q1',
        question: '近一周血压控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q2',
        question: '近一周血糖控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q3',
        question: '近一周是否出现以下症状？（可多选）',
        type: 'multiple',
        options: ['头晕', '头痛', '胸闷', '胸痛', '气短', '乏力', '失眠', '其他'],
        required: false
      },
      {
        id: 'q4',
        question: '用药依从性如何？',
        type: 'single',
        options: ['完全按照医嘱服药', '偶尔忘记', '经常忘记', '未服药'],
        required: true
      },
      {
        id: 'q5',
        question: '近一周平均运动时长（分钟/天）？',
        type: 'number',
        required: false
      },
      {
        id: 'q6',
        question: '是否有其他需要向医生说明的情况？',
        type: 'text',
        required: false
      }
    ]
  },
  {
    id: 'f2',
    title: '5月月度随访问卷',
    date: '2026-05-15',
    status: 'completed',
    questions: [
      {
        id: 'q1',
        question: '近一周血压控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q2',
        question: '近一周血糖控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q3',
        question: '近一周是否出现以下症状？（可多选）',
        type: 'multiple',
        options: ['头晕', '头痛', '胸闷', '胸痛', '气短', '乏力', '失眠', '其他'],
        required: false
      },
      {
        id: 'q4',
        question: '用药依从性如何？',
        type: 'single',
        options: ['完全按照医嘱服药', '偶尔忘记', '经常忘记', '未服药'],
        required: true
      }
    ],
    answers: {
      q1: '偶尔偏高',
      q2: '很好，都在正常范围',
      q3: ['头晕', '失眠'],
      q4: '完全按照医嘱服药'
    },
    doctorAdvice: '血压偶尔偏高，建议注意监测。失眠症状可以尝试睡前泡脚、听轻音乐等方式改善。继续保持良好的用药习惯。'
  },
  {
    id: 'f3',
    title: '4月月度随访问卷',
    date: '2026-04-15',
    status: 'completed',
    questions: [
      {
        id: 'q1',
        question: '近一周血压控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q2',
        question: '近一周血糖控制情况如何？',
        type: 'single',
        options: ['很好，都在正常范围', '偶尔偏高', '经常偏高', '不清楚'],
        required: true
      },
      {
        id: 'q3',
        question: '用药依从性如何？',
        type: 'single',
        options: ['完全按照医嘱服药', '偶尔忘记', '经常忘记', '未服药'],
        required: true
      }
    ],
    answers: {
      q1: '很好，都在正常范围',
      q2: '很好，都在正常范围',
      q3: '完全按照医嘱服药'
    },
    doctorAdvice: '各项指标控制良好，继续保持。建议适度增加运动，每周运动3-5次，每次30分钟。'
  }
]
