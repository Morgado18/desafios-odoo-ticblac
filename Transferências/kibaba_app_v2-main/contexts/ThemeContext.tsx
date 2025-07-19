"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Appearance } from "react-native"
import colors from "../theme/colors"

// Define the Theme interface with all required properties
export interface Theme {
  mode: "light" | "dark"
  colors: typeof colors
  isDark: boolean
  primaryColor: string
  culturalTheme: string
  language: string
  updateAppearance: (newValues: Partial<Theme>) => void
}

// Create a default theme that explicitly defines all properties
const defaultTheme: Theme = {
  mode: "light",
  colors: colors,
  isDark: false,
  primaryColor: "#F7A325",
  culturalTheme: "Padrão Mumuila",
  language: "Português",
  updateAppearance: () => {},
}

// Create the context with the default theme
const ThemeContext = createContext<Theme>({
  ...defaultTheme,
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark")
  const [primaryColor, setPrimaryColor] = useState("#F7A325")
  const [culturalTheme, setCulturalTheme] = useState("Padrão Mumuila")
  const [language, setLanguage] = useState("Português")

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark")
    })
  }, [])

  const updateAppearance = (newValues: Partial<Theme>) => {
    if (newValues.isDark !== undefined) {
      setIsDark(newValues.isDark)
    }
    if (newValues.primaryColor !== undefined) {
      setPrimaryColor(newValues.primaryColor)
    }
    if (newValues.culturalTheme !== undefined) {
      setCulturalTheme(newValues.culturalTheme)
    }
    if (newValues.language !== undefined) {
      setLanguage(newValues.language)
    }
  }

  const themeValue = {
    mode: isDark ? "dark" : "light",
    colors: colors,
    isDark,
    primaryColor,
    culturalTheme,
    language,
    updateAppearance,
  }

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme
export const useTheme = () => {
  return useContext(ThemeContext)
}

export default ThemeContext
