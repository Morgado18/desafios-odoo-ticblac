"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { useTheme } from "../theme/ThemeContext"
import { Icon } from "../App"

interface BottomNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  tabAnimations: Animated.Value[]
}

const ThemedBottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, tabAnimations }) => {
  const { colors, isDark, primaryColor } = useTheme()

  const tabs = [
    { key: "home", icon: "home", label: "Início", family: "Feather" },
    { key: "calendar", icon: "calendar", label: "Calendário", family: "Feather" },
    { key: "fertility", icon: "seedling", label: "Fertilidade", family: "FontAwesome5" },
    { key: "community", icon: "account-group", label: "Comunidade", family: "MaterialCommunityIcons" },
    { key: "profile", icon: "user", label: "Perfil", family: "Feather" },
  ]

  const handleTabPress = (index, key) => {
    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(tabAnimations[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimations[index], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    setActiveTab(key)
  }

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: isDark ? colors.dark.card : colors.light.card,
          borderTopColor: isDark ? colors.dark.border : colors.light.border,
        },
      ]}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => handleTabPress(index, tab.key)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.tabIconContainer,
                {
                  backgroundColor: isActive
                    ? primaryColor
                    : isDark
                      ? "rgba(247, 163, 37, 0.1)"
                      : "rgba(247, 163, 37, 0.15)",
                },
                { transform: [{ scale: tabAnimations[index] }] },
              ]}
            >
              <Icon
                family={tab.family}
                name={tab.icon}
                size={22}
                color={isActive ? colors.primary.black : primaryColor}
              />
            </Animated.View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? primaryColor : isDark ? colors.dark.textSecondary : colors.light.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
})

export default ThemedBottomNav
