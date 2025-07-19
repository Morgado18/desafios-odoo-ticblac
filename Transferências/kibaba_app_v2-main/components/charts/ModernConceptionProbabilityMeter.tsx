"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import { Svg, Path, Circle, G, Defs, LinearGradient, Stop, RadialGradient, Text as SvgText } from "react-native-svg"
import { useTheme } from "../theme/ThemeContext"

interface ModernConceptionProbabilityMeterProps {
  percentage: number
  size?: number
}

const ModernConceptionProbabilityMeter: React.FC<ModernConceptionProbabilityMeterProps> = ({
  percentage = 0,
  size = 120,
}) => {
  const { theme } = useTheme()
  const [needleRotation, setNeedleRotation] = useState("0deg")
  const needlePositionAnim = useRef(new Animated.Value(0)).current
  const needleColorAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const glowAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    // Animate needle position
    Animated.timing(needlePositionAnim, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    }).start()

    // Animate needle color
    Animated.timing(needleColorAnim, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start()

    // Pulse animation for center
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine),
        }),
      ]),
    ).start()

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine),
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine),
        }),
      ]),
    ).start()

    // Update needle rotation manually
    const listener = needlePositionAnim.addListener(({ value }) => {
      const rotation = -90 + value * 1.8
      setNeedleRotation(`${rotation}deg`)
    })

    return () => {
      needlePositionAnim.removeListener(listener)
      needlePositionAnim.stopAnimation()
      needleColorAnim.stopAnimation()
      pulseAnim.stopAnimation()
      glowAnim.stopAnimation()
    }
  }, [percentage, needlePositionAnim, needleColorAnim, pulseAnim, glowAnim])

  // Color interpolation based on percentage
  const colorInterpolate = needleColorAnim.interpolate({
    inputRange: [0, 15, 30, 100],
    outputRange: [theme.colors.text + "80", theme.colors.primary, theme.colors.primary, theme.colors.accent],
  })

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={true}
      accessibilityLabel={`Probabilidade de concepção: ${percentage}%`}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={theme.colors.text + "40"} />
            <Stop offset="50%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.accent} />
          </LinearGradient>

          {/* Radial gradient for glow effect */}
          <RadialGradient id="needleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
          </RadialGradient>

          {/* Radial gradient for center glow */}
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.1" />
          </RadialGradient>
        </Defs>

        {/* Background meter track */}
        <Path
          d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
          stroke={theme.colors.card}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="141 141"
          strokeDashoffset="0"
        />

        {/* Meter fill */}
        <Path
          d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
          stroke="url(#meterGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="141 141"
          strokeDashoffset="141"
          transform="rotate(-90, 50, 50)"
        />

        {/* Needle with manual rotation */}
        <G transform={`rotate(-90, 50, 50)`}>
          <G transform={`rotate(${percentage * 1.8}, 50, 50)`}>
            <Circle cx="50" cy="50" r="8" fill="url(#needleGlow)" />
            <Path d="M 50,50 L 50,10" stroke={colorInterpolate} strokeWidth="3" fill="none" strokeLinecap="round" />
            <Circle cx="50" cy="10" r="5" fill={colorInterpolate} />
          </G>
        </G>

        {/* Center point with pulse animation */}
        <Circle cx="50" cy="50" r="8" fill="url(#centerGlow)" />
        <Circle cx="50" cy="50" r="4" fill={theme.colors.primary} />

        {/* Scale markers */}
        <G>
          <Line x1="15" y1="50" x2="20" y2="50" stroke={theme.colors.text + "40"} strokeWidth="2" />
          <Line x1="50" y1="15" x2="50" y2="20" stroke={theme.colors.primary} strokeWidth="2" />
          <Line x1="85" y1="50" x2="80" y2="50" stroke={theme.colors.accent} strokeWidth="2" />

          {/* Percentage markers */}
          <SvgText x="12" y="54" fill={theme.colors.text + "60"} fontSize="8" textAnchor="middle">
            0%
          </SvgText>
          <SvgText x="50" y="12" fill={theme.colors.primary} fontSize="8" textAnchor="middle">
            50%
          </SvgText>
          <SvgText x="88" y="54" fill={theme.colors.accent} fontSize="8" textAnchor="middle">
            100%
          </SvgText>
        </G>
      </Svg>

      <View style={styles.percentageContainer}>
        <Animated.Text
          style={[
            styles.percentageText,
            {
              color: colorInterpolate,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {Math.round(percentage)}%
        </Animated.Text>
      </View>
    </View>
  )
}

// Missing components for TypeScript
const Line = ({ x1, y1, x2, y2, stroke, strokeWidth }) => (
  <Path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={stroke} strokeWidth={strokeWidth} />
)

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  percentageContainer: {
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default ModernConceptionProbabilityMeter
