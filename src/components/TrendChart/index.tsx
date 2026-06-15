import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import type { TrendDataPoint } from '@/types'

interface TrendChartProps {
  data: TrendDataPoint[]
  color?: string
  color2?: string
  showLegend?: boolean
  legend1?: string
  legend2?: string
  unit?: string
  height?: number
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  color = '#3b82f6',
  color2,
  showLegend = false,
  legend1 = '数值1',
  legend2 = '数值2',
  unit = '',
  height = 300
}) => {
  if (!data || data.length === 0) {
    return (
      <View className={styles.empty}>
        <Text className={styles.emptyText}>暂无数据</Text>
      </View>
    )
  }

  const allValues = data.flatMap((d) => [d.value, d.value2 || 0]).filter((v) => v > 0)
  const maxValue = Math.max(...allValues) * 1.15
  const minValue = Math.min(...allValues) * 0.85
  const valueRange = maxValue - minValue || 1

  const getY = (value: number) => {
    return height - ((value - minValue) / valueRange) * (height - 40) - 20
  }

  const pointWidth = 686 / (data.length + 1)

  const buildPath = (getValue: (d: TrendDataPoint) => number) => {
    return data
      .map((d, i) => {
        const x = pointWidth * (i + 1)
        const y = getY(getValue(d))
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  const buildAreaPath = (getValue: (d: TrendDataPoint) => number) => {
    const path = buildPath(getValue)
    const lastX = pointWidth * data.length
    const firstX = pointWidth
    return `${path} L ${lastX} ${height - 20} L ${firstX} ${height - 20} Z`
  }

  return (
    <View className={styles.container}>
      {showLegend && (
        <View className={styles.legend}>
          <View className={styles.legendItem}>
            <View className={styles.legendDot} style={{ backgroundColor: color }} />
            <Text className={styles.legendText}>{legend1}</Text>
          </View>
          {color2 && (
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: color2 }} />
              <Text className={styles.legendText}>{legend2}</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.chartWrapper}>
        <View className={styles.yAxis}>
          <Text className={styles.yLabel}>{maxValue.toFixed(0)}{unit}</Text>
          <Text className={styles.yLabel}>{((maxValue + minValue) / 2).toFixed(0)}{unit}</Text>
          <Text className={styles.yLabel}>{minValue.toFixed(0)}{unit}</Text>
        </View>

        <View className={styles.chartArea}>
          <svg width='686' height={height} viewBox={`0 0 686 ${height}`}>
            <defs>
              <linearGradient id='gradient1' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor={color} stopOpacity='0.3' />
                <stop offset='100%' stopColor={color} stopOpacity='0' />
              </linearGradient>
              {color2 && (
                <linearGradient id='gradient2' x1='0%' y1='0%' x2='0%' y2='100%'>
                  <stop offset='0%' stopColor={color2} stopOpacity='0.3' />
                  <stop offset='100%' stopColor={color2} stopOpacity='0' />
                </linearGradient>
              )}
            </defs>

            <line x1='0' y1={getY(maxValue)} x2='686' y2={getY(maxValue)} stroke='#f1f5f9' strokeWidth='1' />
            <line x1='0' y1={getY((maxValue + minValue) / 2)} x2='686' y2={getY((maxValue + minValue) / 2)} stroke='#f1f5f9' strokeWidth='1' />
            <line x1='0' y1={getY(minValue)} x2='686' y2={getY(minValue)} stroke='#f1f5f9' strokeWidth='1' />

            {color2 && (
              <>
                <path d={buildAreaPath((d) => d.value2 || 0)} fill='url(#gradient2)' />
                <path d={buildPath((d) => d.value2 || 0)} fill='none' stroke={color2} strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
              </>
            )}

            <path d={buildAreaPath((d) => d.value)} fill='url(#gradient1)' />
            <path d={buildPath((d) => d.value)} fill='none' stroke={color} strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />

            {data.map((d, i) => (
              <React.Fragment key={i}>
                <circle
                  cx={pointWidth * (i + 1)}
                  cy={getY(d.value)}
                  r='6'
                  fill='#ffffff'
                  stroke={color}
                  strokeWidth='2'
                />
                {color2 && d.value2 && (
                  <circle
                    cx={pointWidth * (i + 1)}
                    cy={getY(d.value2)}
                    r='6'
                    fill='#ffffff'
                    stroke={color2}
                    strokeWidth='2'
                  />
                )}
              </React.Fragment>
            ))}
          </svg>

          <View className={styles.xAxis}>
            {data.map((d, i) => (
              <Text key={i} className={styles.xLabel} style={{ left: pointWidth * (i + 1) - 30 }}>
                {d.date}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default TrendChart
