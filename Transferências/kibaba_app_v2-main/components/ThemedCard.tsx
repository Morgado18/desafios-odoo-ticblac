"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, ImageBackground, StatusBar } from "react-native"
import { useTheme } from "../theme/ThemeContext"
import { Icon } from "../App"

interface HeaderProps {
  onMenuPress: () => void
  title: string
  setActiveTab: (tab: string) => void
  spinValue: Animated.Value
  notificationBounce: Animated.Value
  aiPulse: Animated.Value
}

const ThemedHeader: React.FC<HeaderProps> = ({
  onMenuPress,
  title,
  setActiveTab,
  spinValue,
  notificationBounce,
  aiPulse,
}) => {
  const { colors, isDark } = useTheme()

  // Animation for menu icon rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "light-content"} backgroundColor={colors.primary.black} />
      <ImageBackground
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3902dd26cbbb5414183932c1774dd5bb.jpg-DCcyoOYDvUSQpC03qly8iMUktgUDP4.jpeg",
        }}
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Icon family="Feather" name="menu" size={24} color={colors.primary.white} />
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setActiveTab("notifications")}>
              <Animated.View style={{ transform: [{ scale: notificationBounce }] }}>
                <Icon family="Ionicons" name="notifications" size={24} color={colors.primary.white} />
                <View style={[styles.notificationBadge, { backgroundColor: colors.primary.red }]}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => setActiveTab("ai")}>
              <Animated.View style={{ transform: [{ scale: aiPulse }] }}>
                <Icon family="MaterialIcons" name="smart-toy" size={24} color={colors.primary.white} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  headerBackground: {
    height: 60,
  },
  headerOverlay: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "rgba(26, 26, 26, 0.7)", // Semi-transparent black overlay
  },
  menuButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
})

export default ThemedHeader
