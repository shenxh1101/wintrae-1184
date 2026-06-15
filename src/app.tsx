import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import './app.scss'

const App: React.FC<{ children: React.ReactNode }> = (props) => {
  useEffect(() => {
    console.log('[App] 应用启动')
  }, [])

  useDidShow(() => {
    console.log('[App] 应用显示')
  })

  useDidHide(() => {
    console.log('[App] 应用隐藏')
  })

  return props.children
}

export default App
