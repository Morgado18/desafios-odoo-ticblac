"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated, Dimensions, StyleSheet, View } from "react-native"

const { width } = Dimensions.get("window")

interface TabIndicatorProps {
  activeTabIndex: number
  tabCount: number
  containerWidth?: number
  color?: string
  colors?: string[]
  height?: number
}

const TabIndicator: React.FC<TabIndicatorProps> = ({
  activeTabIndex,
  tabCount,
  containerWidth = width,
  color = "#F9A826",
  colors,
  height = 3,
}) => {
  // Separate animation values for native and JS drivers
  const translateX = useRef(new Animated.Value(0)).current
  const colorIndex = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate the position (with native driver)
    Animated.timing(translateX, {
      toValue: activeTabIndex,
      duration: 300,
      useNativeDriver: true,
    }).start()

    // Animate the color index (with JS driver)
    Animated.timing(colorIndex, {
      toValue: activeTabIndex,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [activeTabIndex])

  // Calculate tab width based on container width and tab count
  const tabWidth = (containerWidth - 8) / tabCount

  // Map the translateX value to the actual position
  const position = translateX.interpolate({
    inputRange: Array.from({ length: tabCount }, (_, i) => i),
    outputRange: Array.from({ length: tabCount }, (_, i) => i * tabWidth),
  })

  // Determine the color to use
  let indicatorColor = color

  // Only use color interpolation if colors array is provided
  if (colors && colors.length > 0) {
    // Ensure we have enough colors
    const safeColors =
      colors.length >= tabCount
        ? colors
        : Array.from({ length: tabCount }, (_, i) => colors[i % colors.length] || color)

    // Create interpolation for color
    indicatorColor = colorIndex.interpolate({
      inputRange: Array.from({ length: tabCount }, (_, i) => i),
      outputRange: safeColors,
    })
  }

  return (
    <View style={styles.container}>
      {/* Position indicator (uses native driver) */}
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            width: tabWidth,
            transform: [{ translateX: position }],
            height,
          },
        ]}
      />

      {/* Color overlay (uses JS driver) */}
      <Animated.View
        style={[
          styles.colorIndicator,
          {
            width: tabWidth,
            transform: [{ translateX: position }],
            borderBottomColor: indicatorColor,
            height,
          },
        ]}
      />

      {/* Invisible anchor points for positioning */}
      <View style={[styles.invisibleAnchorPoint, { left: "25%" }]} />
      <View style={[styles.invisibleAnchorPoint, { left: "50%" }]} />
      <View style={[styles.invisibleAnchorPoint, { left: "75%" }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  tabIndicator: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#3A3A3A",
    borderRadius: 1.5,
    top: 0,
    left: 4,
  },
  colorIndicator: {
    position: "absolute",
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 1.5,
    top: 0,
    left: 4,
    borderBottomWidth: 3,
  },
  invisibleAnchorPoint: {
    position: "absolute",
    width: 1,
    height: 1,
    backgroundColor: "transparent",
    top: "50%",
  },
})

export default TabIndicator
