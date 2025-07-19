"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from "react-native"
import {
  Svg,
  Path,
  Circle,
  Line,
  Text as SvgText,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
} from "react-native-svg"
import { useTheme } from "../theme/ThemeContext"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_WIDTH = SCREEN_WIDTH - 40
const CHART_HEIGHT = 200
const PADDING = 20
const INNER_WIDTH = CHART_WIDTH - PADDING * 2
const INNER_HEIGHT = CHART_HEIGHT - PADDING * 2

interface TemperatureDataPoint {
  date: string
  temp: number
  day?: number
}

interface ModernTemperatureChartProps {
  data: TemperatureDataPoint[]
  ovulationThreshold?: number
}

const ModernTemperatureChart: React.FC<ModernTemperatureChartProps> = ({ data = [], ovulationThreshold = 36.7 }) => {
  const { theme } = useTheme()
  const [pathAnimation] = useState(new Animated.Value(0))
  const [pointsAnimation] = useState(new Animated.Value(0))
  const [tooltipVisible, setTooltipVisible] = useState<number | null>(null)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })
  const chartRef = useRef(null)

  // Ensure we have valid data
  const validData =
    data.length > 0
      ? data.map((item, index) => ({
          ...item,
          day: item.day || index + 1,
        }))
      : Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          temp: 36.5 + Math.random() * 0.8,
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
        }))

  // Calculate min and max temperatures for scaling
  const minTemp = Math.min(...validData.map((d) => d.temp)) - 0.1
  const maxTemp = Math.max(...validData.map((d) => d.temp)) + 0.1
  const tempRange = maxTemp - minTemp

  // Generate path for temperature line
  const generatePath = () => {
    if (validData.length === 0) return ""

    return validData
      .map((point, index) => {
        const x = PADDING + (index / (validData.length - 1)) * INNER_WIDTH
        const y = PADDING + INNER_HEIGHT - ((point.temp - minTemp) / tempRange) * INNER_HEIGHT
        return `${index === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")
  }

  // Generate area under the curve
  const generateArea = () => {
    if (validData.length === 0) return ""

    let path = validData
      .map((point, index) => {
        const x = PADDING + (index / (validData.length - 1)) * INNER_WIDTH
        const y = PADDING + INNER_HEIGHT - ((point.temp - minTemp) / tempRange) * INNER_HEIGHT
        return `${index === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")

    // Complete the path to form a closed shape
    const lastX = PADDING + INNER_WIDTH
    const firstX = PADDING
    path += ` L ${lastX} ${PADDING + INNER_HEIGHT} L ${firstX} ${PADDING + INNER_HEIGHT} Z`

    return path
  }

  // Animation effect
  useEffect(() => {
    Animated.sequence([
      Animated.timing(pathAnimation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: false,
      }),
      Animated.timing(pointsAnimation, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: false,
      }),
    ]).start()

    return () => {
      pathAnimation.stopAnimation()
      pointsAnimation.stopAnimation()
    }
  }, [data])

  // Function to calculate the Y position based on temperature
  const getYPosition = (temp) => {
    return PADDING + INNER_HEIGHT - ((temp - minTemp) / tempRange) * INNER_HEIGHT
  }

  // Render axis and grid
  const renderAxisAndGrid = () => {
    const yAxisTicks = 5
    const xAxisTicks = Math.min(validData.length, 7) // Show max 7 ticks on x-axis for clarity

    return (
      <G>
        {/* Y-axis line */}
        <Line
          x1={PADDING}
          y1={PADDING}
          x2={PADDING}
          y2={PADDING + INNER_HEIGHT}
          stroke={theme.colors.text + "40"}
          strokeWidth="1"
        />

        {/* X-axis line */}
        <Line
          x1={PADDING}
          y1={PADDING + INNER_HEIGHT}
          x2={PADDING + INNER_WIDTH}
          y2={PADDING + INNER_HEIGHT}
          stroke={theme.colors.text + "40"}
          strokeWidth="1"
        />

        {/* Y-axis ticks and labels */}
        {Array.from({ length: yAxisTicks }).map((_, i) => {
          const y = PADDING + (i / (yAxisTicks - 1)) * INNER_HEIGHT
          const tempValue = maxTemp - (i / (yAxisTicks - 1)) * tempRange

          return (
            <G key={`y-tick-${i}`}>
              <Line x1={PADDING - 5} y1={y} x2={PADDING} y2={y} stroke={theme.colors.text + "60"} strokeWidth="1" />
              <SvgText x={PADDING - 8} y={y + 4} fontSize="9" fill={theme.colors.text + "80"} textAnchor="end">
                {tempValue.toFixed(1)}°
              </SvgText>
              {/* Horizontal grid line */}
              <Line
                x1={PADDING}
                y1={y}
                x2={PADDING + INNER_WIDTH}
                y2={y}
                stroke={theme.colors.text + "10"}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </G>
          )
        })}

        {/* X-axis ticks and labels */}
        {Array.from({ length: xAxisTicks }).map((_, i) => {
          const x = PADDING + (i / (xAxisTicks - 1)) * INNER_WIDTH
          const dayIndex = Math.floor((i / (xAxisTicks - 1)) * (validData.length - 1))
          const day = validData[dayIndex]?.day || dayIndex + 1

          return (
            <G key={`x-tick-${i}`}>
              <Line
                x1={x}
                y1={PADDING + INNER_HEIGHT}
                x2={x}
                y2={PADDING + INNER_HEIGHT + 5}
                stroke={theme.colors.text + "60"}
                strokeWidth="1"
              />
              <SvgText
                x={x}
                y={PADDING + INNER_HEIGHT + 15}
                fontSize="9"
                fill={theme.colors.text + "80"}
                textAnchor="middle"
              >
                Dia {day}
              </SvgText>
              {/* Vertical grid line */}
              <Line
                x1={x}
                y1={PADDING}
                y2={PADDING + INNER_HEIGHT}
                x2={x}
                stroke={theme.colors.text + "10"}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </G>
          )
        })}
      </G>
    )
  }

  // Render ovulation threshold line
  const renderThresholdLine = () => {
    const y = getYPosition(ovulationThreshold)

    return (
      <G>
        <Line
          x1={PADDING}
          y1={y}
          x2={PADDING + INNER_WIDTH}
          y2={y}
          stroke={theme.colors.primary + "80"}
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
        <SvgText x={PADDING + INNER_WIDTH - 5} y={y - 5} fontSize="9" fill={theme.colors.primary} textAnchor="end">
          Limiar de Ovulação ({ovulationThreshold}°C)
        </SvgText>
      </G>
    )
  }

  // Render data points with tooltips
  const renderDataPoints = () => {
    return validData.map((point, index) => {
      const x = PADDING + (index / (validData.length - 1)) * INNER_WIDTH
      const y = getYPosition(point.temp)
      const isPostOvulation = point.temp > ovulationThreshold
      const isSelected = tooltipVisible === index

      // Interpolate for animated points appearance
      const animatedY = pointsAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [PADDING + INNER_HEIGHT, y],
      })

      const animatedOpacity = pointsAnimation.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 0, 1],
      })

      const pointColor = isPostOvulation ? theme.colors.primary : theme.colors.tertiary
      const pointSize = isSelected ? 6 : 4

      return (
        <G key={`point-${index}`}>
          <AnimatedCircle
            cx={x}
            cy={animatedY}
            r={pointSize}
            fill={pointColor}
            stroke={theme.colors.background}
            strokeWidth="1"
            opacity={animatedOpacity}
          />

          <Circle
            cx={x}
            cy={y}
            r={12}
            fill="transparent"
            onPress={() => setTooltipVisible(tooltipVisible === index ? null : index)}
          />

          {isSelected && (
            <G>
              <Rect
                x={x - 40}
                y={y - 45}
                width="80"
                height="35"
                rx="5"
                fill={theme.colors.card}
                stroke={theme.colors.border}
                strokeWidth="1"
              />
              <SvgText x={x} y={y - 30} fontSize="11" fill={theme.colors.text} textAnchor="middle" fontWeight="bold">
                {point.temp.toFixed(1)}°C
              </SvgText>
              <SvgText x={x} y={y - 15} fontSize="9" fill={theme.colors.text + "80"} textAnchor="middle">
                {new Date(point.date).toLocaleDateString()}
              </SvgText>
              <Path
                d={`M ${x} ${y - 10} L ${x - 5} ${y - 5} L ${x + 5} ${y - 5} Z`}
                fill={theme.colors.card}
                stroke={theme.colors.border}
                strokeWidth="1"
              />
            </G>
          )}
        </G>
      )
    })
  }

  return (
    <View
      style={styles.container}
      ref={chartRef}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        setChartDimensions({ width, height })
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Temperatura Basal</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.tertiary }]} />
            <Text style={[styles.legendText, { color: theme.colors.text + "80" }]}>Pré-ovulação</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.legendText, { color: theme.colors.text + "80" }]}>Pós-ovulação</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Background */}
          <Rect
            x={PADDING}
            y={PADDING}
            width={INNER_WIDTH}
            height={INNER_HEIGHT}
            fill={theme.colors.card + "30"}
            rx={8}
          />

          {/* Axis and grid */}
          {renderAxisAndGrid()}

          {/* Ovulation threshold line */}
          {renderThresholdLine()}

          {/* Area under the curve */}
          <Defs>
            <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.3" />
              <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0.05" />
            </SvgGradient>
          </Defs>
          <AnimatedPath d={generateArea()} fill="url(#areaGradient)" strokeWidth="0" opacity={pathAnimation} />

          {/* Temperature line */}
          <AnimatedPath
            d={generatePath()}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={INNER_WIDTH * 2}
            strokeDashoffset={pathAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [INNER_WIDTH * 2, 0],
            })}
          />

          {/* Data points */}
          {renderDataPoints()}
        </Svg>
      </View>

      <Text style={[styles.legend, { color: theme.colors.text + "60" }]}>Toque nos pontos para ver detalhes</Text>
    </View>
  )
}

// Animated components
const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  legend: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
})

export default ModernTemperatureChart
