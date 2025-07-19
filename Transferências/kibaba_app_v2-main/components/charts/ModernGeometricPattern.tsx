"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import { Svg, Circle, Line, Defs, RadialGradient, LinearGradient, Stop, G, ClipPath, Path } from "react-native-svg"
import { useTheme } from "../theme/ThemeContext"

interface ModernGeometricPatternProps {
  size?: number
  opacity?: number
  animated?: boolean
  variant?: "default" | "complex" | "minimal"
}

const ModernGeometricPattern: React.FC<ModernGeometricPatternProps> = ({
  size = 120,
  opacity = 0.5,
  animated = true,
  variant = "default",
}) => {
  const { theme } = useTheme()
  const rotateAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(opacity)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (animated) {
      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      )

      // Opacity pulsation
      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: opacity + 0.2,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      )

      // Scale animation
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      )

      // Pulse animation for elements
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      )

      rotateAnimation.start()
      opacityAnimation.start()
      scaleAnimation.start()
      pulseAnimation.start()

      return () => {
        rotateAnimation.stop()
        opacityAnimation.stop()
        scaleAnimation.stop()
        pulseAnimation.stop()
      }
    }
  }, [animated, opacity])

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Define different pattern variants
  const renderPattern = () => {
    // Common elements for all variants
    const commonElements = (
      <>
        <Defs>
          <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={theme.colors.secondary} stopOpacity="0.2" />
          </RadialGradient>
          <LinearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={theme.colors.secondary} stopOpacity="0.5" />
          </LinearGradient>
          <ClipPath id="circleClip">
            <Circle cx="60" cy="60" r="60" />
          </ClipPath>
        </Defs>

        {/* Background */}
        <Circle cx="60" cy="60" r="60" fill="url(#radialGrad)" />
      </>
    )

    // Invisible positioning points for all variants
    const positioningPoints = (
      <>
        {/* Anchor points for positioning (invisible) */}
        <Circle cx="60" cy="60" r="1" fill="none" />
        <Circle cx="30" cy="30" r="1" fill="none" />
        <Circle cx="90" cy="30" r="1" fill="none" />
        <Circle cx="30" cy="90" r="1" fill="none" />
        <Circle cx="90" cy="90" r="1" fill="none" />
        <Circle cx="60" cy="20" r="1" fill="none" />
        <Circle cx="20" cy="60" r="1" fill="none" />
        <Circle cx="100" cy="60" r="1" fill="none" />
        <Circle cx="60" cy="100" r="1" fill="none" />
      </>
    )

    switch (variant) {
      case "complex":
        return (
          <>
            {commonElements}
            <G opacity="0.8" clipPath="url(#circleClip)">
              {positioningPoints}

              {/* Complex pattern with more elements */}
              <Circle cx="25" cy="25" r="10" fill="url(#linearGrad)" />
              <Circle cx="60" cy="20" r="8" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="95" cy="30" r="12" fill="url(#linearGrad)" />
              <Circle cx="20" cy="60" r="7" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="100" cy="70" r="9" fill="url(#linearGrad)" />
              <Circle cx="45" cy="90" r="11" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="75" cy="95" r="8" fill="url(#linearGrad)" />

              {/* Additional elements for complex variant */}
              <Path
                d="M30,30 Q60,10 90,30 T60,60 T30,30"
                fill="none"
                stroke={theme.colors.text}
                strokeWidth="0.5"
                opacity="0.2"
              />
              <Path
                d="M30,90 Q60,110 90,90 T60,60 T30,90"
                fill="none"
                stroke={theme.colors.text}
                strokeWidth="0.5"
                opacity="0.2"
              />

              {/* Connecting lines */}
              <Line x1="25" y1="25" x2="60" y2="20" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="60" y1="20" x2="95" y2="30" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="95" y1="30" x2="100" y2="70" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="100" y1="70" x2="75" y2="95" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="75" y1="95" x2="45" y2="90" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="45" y1="90" x2="20" y2="60" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="20" y1="60" x2="25" y2="25" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />

              {/* Additional decorative elements */}
              <Circle cx="60" cy="60" r="25" fill="none" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.2" />
              <Circle cx="60" cy="60" r="40" fill="none" stroke={theme.colors.text} strokeWidth="0.3" opacity="0.1" />
              <Circle cx="60" cy="60" r="55" fill="none" stroke={theme.colors.text} strokeWidth="0.2" opacity="0.05" />
            </G>
          </>
        )

      case "minimal":
        return (
          <>
            {commonElements}
            <G opacity="0.8" clipPath="url(#circleClip)">
              {positioningPoints}

              {/* Minimal pattern with fewer elements */}
              <Circle cx="60" cy="60" r="30" fill="none" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.2" />
              <Circle cx="60" cy="60" r="45" fill="none" stroke={theme.colors.text} strokeWidth="0.3" opacity="0.1" />

              {/* Simple dots at key positions */}
              <Circle cx="60" cy="15" r="4" fill={theme.colors.primary} opacity="0.5" />
              <Circle cx="105" cy="60" r="4" fill={theme.colors.primary} opacity="0.5" />
              <Circle cx="60" cy="105" r="4" fill={theme.colors.primary} opacity="0.5" />
              <Circle cx="15" cy="60" r="4" fill={theme.colors.primary} opacity="0.5" />

              {/* Connecting lines */}
              <Line x1="60" y1="15" x2="105" y2="60" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.3" />
              <Line x1="105" y1="60" x2="60" y2="105" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.3" />
              <Line x1="60" y1="105" x2="15" y2="60" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.3" />
              <Line x1="15" y1="60" x2="60" y2="15" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.3" />
            </G>
          </>
        )

      default: // "default"
        return (
          <>
            {commonElements}
            <G opacity="0.8" clipPath="url(#circleClip)">
              {positioningPoints}

              {/* Visible elements */}
              <Circle cx="25" cy="25" r="10" fill="url(#linearGrad)" />
              <Circle cx="60" cy="20" r="8" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="95" cy="30" r="12" fill="url(#linearGrad)" />
              <Circle cx="20" cy="60" r="7" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="100" cy="70" r="9" fill="url(#linearGrad)" />
              <Circle cx="45" cy="90" r="11" fill={theme.colors.text} opacity="0.3" />
              <Circle cx="75" cy="95" r="8" fill="url(#linearGrad)" />

              {/* Connecting lines */}
              <Line x1="25" y1="25" x2="60" y2="20" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="60" y1="20" x2="95" y2="30" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="95" y1="30" x2="100" y2="70" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="100" y1="70" x2="75" y2="95" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="75" y1="95" x2="45" y2="90" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="45" y1="90" x2="20" y2="60" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />
              <Line x1="20" y1="60" x2="25" y2="25" stroke={theme.colors.text} strokeWidth="0.8" opacity="0.4" />

              {/* Additional decorative elements */}
              <Circle cx="60" cy="60" r="25" fill="none" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.2" />
              <Circle cx="60" cy="60" r="40" fill="none" stroke={theme.colors.text} strokeWidth="0.3" opacity="0.1" />
            </G>
          </>
        )
    }
  }

  return (
    <View style={styles.container} accessibilityLabel="Padrão decorativo geométrico" importantForAccessibility="no">
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolation }, { scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {renderPattern()}
        </Svg>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -20,
    right: -20,
    zIndex: -1,
  },
})

export default ModernGeometricPattern
