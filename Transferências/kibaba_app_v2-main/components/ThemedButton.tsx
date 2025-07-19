"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useTheme } from "../theme/ThemeContext"
import { Icon } from "../App"

interface ThemedButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  icon?: {
    name: string
    family: string
  }
  fullWidth?: boolean
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  icon,
  fullWidth = false,
}) => {
  const { colors, isDark } = useTheme()

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary.orange,
          borderColor: colors.primary.orange,
        }
      case "secondary":
        return {
          backgroundColor: colors.primary.red,
          borderColor: colors.primary.red,
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.primary.orange,
        }
      default:
        return {
          backgroundColor: colors.primary.orange,
          borderColor: colors.primary.orange,
        }
    }
  }

  const getTextColor = () => {
    if (variant === "outline") {
      return colors.primary.orange
    }
    return colors.primary.white
  }

  const buttonStyle = getButtonStyle()
  const textColor = getTextColor()

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, fullWidth && styles.fullWidth]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <Icon family={icon.family} name={icon.name} size={18} color={textColor} style={styles.icon} />}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  fullWidth: {
    width: "100%",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
})

export default ThemedButton
