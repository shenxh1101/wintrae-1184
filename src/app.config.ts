export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/record/index',
    'pages/reminder/index',
    'pages/followup/index',
    'pages/family/index',
    'pages/bloodpressure/index',
    'pages/bloodsugar/index',
    'pages/medication/index',
    'pages/questionnaire/index',
    'pages/member/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#22c55e',
    navigationBarTitleText: '慢病健康助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f8fafc'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#22c55e',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/record/index',
        text: '记录'
      },
      {
        pagePath: 'pages/reminder/index',
        text: '提醒'
      },
      {
        pagePath: 'pages/followup/index',
        text: '随访'
      },
      {
        pagePath: 'pages/family/index',
        text: '家庭'
      }
    ]
  }
})
