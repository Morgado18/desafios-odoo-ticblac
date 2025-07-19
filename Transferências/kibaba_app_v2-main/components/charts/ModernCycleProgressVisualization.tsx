"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from "react-native"
import { Svg, Circle, Path, G, Text as SvgText, Line } from "react-native-svg"
import { useTheme } from "../theme/ThemeContext"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_SIZE = Math.min(SCREEN_WIDTH - 40, 300)
const STROKE_WIDTH = 12
const RADIUS = CHART_SIZE / 2 - STROKE_WIDTH / 2 - 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ModernCycleProgressVisualizationProps {
  currentDay: number
  cycleLength: number
  periodLength: number
  ovulationDay: number
  fertileWindowStart: number
  fertileWindowEnd: number
}

const ModernCycleProgressVisualization: React.FC<ModernCycleProgressVisualizationProps> = ({
  currentDay = 14,
  cycleLength = 28,
  periodLength = 5,
  ovulationDay = 14,
  fertileWindowStart = 11,
  fertileWindowEnd = 17,
}) => {
  const { theme } = useTheme()
  const [progressAnimation] = useState(new Animated.Value(0))
  const [phaseAnimation] = useState(new Animated.Value(0))
  const [markerAnimation] = useState(new Animated.Value(0))

  // Calculate progress percentage
  const progressPercentage = (currentDay / cycleLength) * 100

  // Calculate angles for different phases
  const periodEndAngle = (periodLength / cycleLength) * 360
  const fertileStartAngle = (fertileWindowStart / cycleLength) * 360
  const fertileEndAngle = (fertileWindowEnd / cycleLength) * 360
  const ovulationAngle = (ovulationDay / cycleLength) * 360
  const currentDayAngle = (currentDay / cycleLength) * 360

  // Animation effect
  useEffect(() => {
    Animated.sequence([
      Animated.timing(progressAnimation, {
        toValue: progressPercentage,
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(phaseAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(markerAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1.2),
          useNativeDriver: false,
        }),
      ]),
    ]).start()
  }, [currentDay, cycleLength])

  // Interpolate for animated stroke dashoffset
  const animatedStrokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  })

  // Helper function to convert degrees to radians
  const degToRad = (deg) => (deg * Math.PI) / 180

  // Helper function to calculate point on circle
  const pointOnCircle = (angle, radius) => {
    const x = CHART_SIZE / 2 + radius * Math.cos(degToRad(angle - 90))
    const y = CHART_SIZE / 2 + radius * Math.sin(degToRad(angle - 90))
    return { x, y }
  }

  // Generate arc path
  const generateArc = (startAngle, endAngle, radius) => {
    const start = pointOnCircle(startAngle, radius)
    const end = pointOnCircle(endAngle, radius)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
  }

  // Render phase markers
  const renderPhaseMarkers = () => {
    const phaseOpacity = phaseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.8],
    })

    return (
      <Animated.View style={{ opacity: phaseOpacity }}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          {/* Period Phase */}
          <Path
            d={generateArc(0, periodEndAngle, RADIUS)}
            stroke={theme.colors.error}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />

          {/* Fertile Window */}
          <Path
            d={generateArc(fertileStartAngle, fertileEndAngle, RADIUS)}
            stroke={theme.colors.primary}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />

          {/* Ovulation Day Marker */}
          <G>
            {/* Ovulation line */}
            <Line
              x1={CHART_SIZE / 2}
              y1={CHART_SIZE / 2}
              x2={pointOnCircle(ovulationAngle, RADIUS + 15).x}
              y2={pointOnCircle(ovulationAngle, RADIUS + 15).y}
              stroke={theme.colors.primary}
              strokeWidth={2}
              strokeDasharray="3,3"
            />

            {/* Ovulation point */}
            <Circle
              cx={pointOnCircle(ovulationAngle, RADIUS).x}
              cy={pointOnCircle(ovulationAngle, RADIUS).y}
              r={6}
              fill={theme.colors.primary}
              stroke="white"
              strokeWidth={2}
            />

            {/* Ovulation label */}
            <SvgText
              x={pointOnCircle(ovulationAngle, RADIUS + 25).x}
              y={pointOnCircle(ovulationAngle, RADIUS + 25).y}
              fontSize="10"
              fill={theme.colors.primary}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Ovulação
            </SvgText>
          </G>
        </Svg>
      </Animated.View>
    )
  }

  // Render day markers
  const renderDayMarkers = () => {
    return (
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        {Array.from({ length: cycleLength }).map((_, i) => {
          const angle = (i / cycleLength) * 360
          const point = pointOnCircle(angle, RADIUS)
          const isSpecialDay = i + 1 === 1 || i + 1 === ovulationDay || i + 1 === cycleLength
          const size = isSpecialDay ? 4 : 2
          const color = isSpecialDay ? theme.colors.accent : theme.colors.text + "40"

          return <Circle key={`day-${i}`} cx={point.x} cy={point.y} r={size} fill={color} opacity={0.7} />
        })}
      </Svg>
    )
  }

  // Render current day marker
  const renderCurrentDayMarker = () => {
    const markerScale = markerAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1.2, 1],
    })

    const point = pointOnCircle(currentDayAngle, RADIUS)

    return (
      <Animated.View
        style={{
          position: "absolute",
          left: point.x - 10,
          top: point.y - 10,
          transform: [{ scale: markerScale }],
        }}
      >
        <View style={[styles.currentDayMarker, { backgroundColor: theme.colors.accent }]}>
          <Text style={styles.currentDayText}>{currentDay}</Text>
        </View>
      </Animated.View>
    )
  }

  // Render cycle info
  const renderCycleInfo = () => {
    // Calculate days until next period
    const daysUntilNextPeriod = cycleLength - currentDay

    // Determine current phase
    let currentPhase = ""
    let phaseColor = ""

    if (currentDay <= periodLength) {
      currentPhase = "Período Menstrual"
      phaseColor = theme.colors.error
    } else if (currentDay >= fertileWindowStart && currentDay <= fertileWindowEnd) {
      currentPhase = "Janela Fértil"
      phaseColor = theme.colors.primary
    } else if (currentDay === ovulationDay) {
      currentPhase = "Dia da Ovulação"
      phaseColor = theme.colors.primary
    } else if (currentDay < fertileWindowStart) {
      currentPhase = "Fase Folicular"
      phaseColor = theme.colors.secondary
    } else {
      currentPhase = "Fase Lútea"
      phaseColor = theme.colors.tertiary
    }

    return (
      <View style={styles.infoContainer}>
        <Text style={[styles.phaseText, { color: phaseColor }]}>{currentPhase}</Text>
        <Text style={[styles.daysText, { color: theme.colors.text }]}>
          {daysUntilNextPeriod > 0 ? `${daysUntilNextPeriod} dias até o próximo período` : "Período atual"}
        </Text>
        <Text style={[styles.cycleText, { color: theme.colors.text + "80" }]}>
          Dia {currentDay} de {cycleLength}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        <Circle
          cx={CHART_SIZE / 2}
          cy={CHART_SIZE / 2}
          r={RADIUS}
          stroke={theme.colors.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Animated.Circle
          cx={CHART_SIZE / 2}
          cy={CHART_SIZE / 2}
          r={RADIUS}
          stroke={theme.colors.accent}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animatedStrokeDashoffset}
        />
      </Svg>
      {renderPhaseMarkers()}
      {renderDayMarkers()}
      {renderCurrentDayMarker()}
      {renderCycleInfo()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  currentDayMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  currentDayText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  phaseText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  daysText: {
    fontSize: 14,
  },
  cycleText: {
    fontSize: 12,
  },
})

export default ModernCycleProgressVisualization
