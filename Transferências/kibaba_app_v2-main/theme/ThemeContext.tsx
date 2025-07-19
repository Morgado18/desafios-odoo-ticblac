"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Appearance } from "react-native"
import colors from "./colors"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define types for our appearance settings
type AppearanceSettings = {
  isDark: boolean
  primaryColor: string
  culturalTheme: string
  language: string
}

// Define the theme context type with expanded properties
type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
  colors: typeof colors
  primaryColor: string
  culturalTheme: string
  language: string
  updateAppearance: (settings: Partial<AppearanceSettings>) => void
}

// Default appearance settings
const defaultAppearance: AppearanceSettings = {
  isDark: Appearance.getColorScheme() !== "light",
  primaryColor: colors.primary.orange, // Use the color directly from colors object
  culturalTheme: "Padrão Mumuila",
  language: "Português",
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  ...defaultAppearance,
  toggleTheme: () => {},
  colors,
  updateAppearance: () => {},
})

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext)

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for all appearance settings
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance)

  // Load saved appearance settings on mount
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      try {
        const savedAppearance = await AsyncStorage.getItem("appearanceSettings")
        if (savedAppearance) {
          setAppearance(JSON.parse(savedAppearance))
        }
      } catch (error) {
        console.error("Error loading appearance settings:", error)
      }
    }

    loadAppearanceSettings()
  }, [])

  // Save appearance settings when updated
  useEffect(() => {
    const saveAppearanceSettings = async () => {
      try {
        await AsyncStorage.setItem("appearanceSettings", JSON.stringify(appearance))
      } catch (error) {
        console.error("Error saving appearance settings:", error)
      }
    }

    saveAppearanceSettings()
  }, [appearance])

  // Listen for changes in device color scheme
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setAppearance((prev) => ({
        ...prev,
        isDark: colorScheme !== "light",
      }))
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setAppearance((prev) => ({
      ...prev,
      isDark: !prev.isDark,
    }))
  }

  // Function to update appearance settings
  const updateAppearance = (newSettings: Partial<AppearanceSettings>) => {
    setAppearance((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  // Create the theme context value
  const themeContextValue = {
    isDark: appearance.isDark,
    toggleTheme,
    colors,
    primaryColor: appearance.primaryColor,
    culturalTheme: appearance.culturalTheme,
    language: appearance.language,
    updateAppearance,
  }

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>
}

export default ThemeContext
