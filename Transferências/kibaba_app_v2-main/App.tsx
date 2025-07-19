"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from "react-native"

// Import all icons directly from the root package
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons"

// Import theme provider
import { ThemeProvider, useTheme } from "./theme/ThemeContext"
import ThemedHeader from "./components/ThemedHeader"
import ThemedBottomNav from "./components/ThemedBottomNav"

// Import screen components
import ProfileScreen from "./components/ProfileScreen"
import HomeScreen from "./components/HomeScreen"
import CalendarScreen from "./components/CalendarScreen"
import FertilityScreen from "./components/FertilityScreen"
import CommunityScreen from "./components/CommunityScreen"
import AIAssistantScreen from "./components/AIAssistantScreen"
import WisdomScreen from "./components/WisdomScreen"
import NotificationsScreen from "./components/NotificationsScreen"
import CycleScreen from "./components/CycleScreen"
import HelpSupportScreen from "./components/HelpSupportScreen"
import AboutScreen from "./components/AboutScreen"
import PrivacyTermsScreen from "./components/PrivacyTermsScreen"
import AuthFlow from "./components/AuthFlow"
import ScientificEvidenceScreen from "./components/ScientificEvidenceScreen"
import CreatePostScreen from "./components/CreatePostScreen"
import RegisterSymptomScreen from "./components/RegisterSymptomScreen"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Simplified icon component - export it so it can be used in other components
export const Icon = ({
  family,
  name,
  size,
  color,
  style,
}: {
  family: string
  name: string
  size: number
  color: string
  style?: any
}) => {
  if (family === "Ionicons") {
    return <Ionicons name={name} size={size} color={color} style={style} />
  } else if (family === "MaterialIcons") {
    return <MaterialIcons name={name} size={size} color={color} style={style} />
  } else if (family === "Feather") {
    return <Feather name={name} size={size} color={color} style={style} />
  } else if (family === "FontAwesome5") {
    return <FontAwesome5 name={name} size={size} color={color} style={style} />
  } else if (family === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
  } else if (family === "AntDesign") {
    return <AntDesign name={name} size={size} color={color} style={style} />
  } else if (family === "Entypo") {
    return <Entypo name={name} size={size} color={color} style={style} />
  } else if (family === "FontAwesome") {
    return <FontAwesome name={name} size={size} color={color} style={style} />
  }

  // Fallback for unknown icon family
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        justifyContent: "center",
        alignItems: "center",
        ...(style || {}),
      }}
    >
      <Text style={{ color: "#fff", fontSize: size / 2 }}>{name[0]}</Text>
    </View>
  )
}

// Componente Menu Vertical
const SideMenu = ({ isVisible, onClose, setActiveTab, activeTab, setIsAuthenticated, primaryColor }) => {
  const { colors, isDark } = useTheme()
  const { width } = Dimensions.get("window")
  const menuWidth = width * 0.85
  const slideAnim = useRef(new Animated.Value(-menuWidth)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const itemsAnim = useRef(new Animated.Value(0)).current

  const { logout } = useAuth();

  // Use a default color if primaryColor is not available
  const accentColor = primaryColor || colors.primary.orange

  useEffect(() => {
    if (isVisible) {
      // Abrir menu com animação
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280, // Slightly reduced from 300
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250, // Slightly reduced from 300
          useNativeDriver: true,
        }),
        Animated.timing(itemsAnim, {
          toValue: 1,
          duration: 400, // Reduced from 500
          delay: 80, // Reduced from 100
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Fechar menu com animação
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -menuWidth,
          duration: 250, // Slightly reduced from 300
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250, // Slightly reduced from 300
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible, menuWidth])

  // Definição das seções do menu
  const menuSections = [
    {
      title: "Principal",
      items: [
        { icon: "home", label: "Início", family: "Feather", key: "home" },
        { icon: "calendar", label: "Calendário", family: "Feather", key: "calendar" },
        { icon: "seedling", label: "Fertilidade", family: "FontAwesome5", key: "fertility" },
        { icon: "account-group", label: "Comunidade", family: "MaterialCommunityIcons", key: "community" },
      ],
    },
    {
      title: "Criar",
      items: [
        { icon: "plus", label: "Nova Publicação", family: "Feather", key: "createPost" },
        { icon: "plus", label: "Registar Sintoma", family: "Feather", key: "registerSymptom" },
      ],
    },
    {
      title: "Recursos",
      items: [
        { icon: "book-open", label: "Sabedoria Ancestral", family: "Feather", key: "wisdom" },
       /*  { icon: "robot", label: "Assistente IA", family: "MaterialCommunityIcons", key: "ai" }, */
        { icon: "moon", label: "Ciclo Menstrual", family: "Feather", key: "cycle" },
        { icon: "flask", label: "Evidências Científicas", family: "FontAwesome5", key: "evidence" },
      ],
    },
    {
      title: "Sua Conta",
      items: [
        { icon: "user", label: "Perfil", family: "Feather", key: "profile" },
        { icon: "bell", label: "Notificações", family: "Feather", key: "notifications" },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: "help-circle", label: "Ajuda & Suporte", family: "Feather", key: "help" },
        { icon: "info", label: "Sobre a KIBABA APP", family: "Feather", key: "about" },
        { icon: "shield", label: "Privacidade & Termos", family: "Feather", key: "privacy" },
      ],
    },
  ]

  // Animação para os itens do menu
  const getItemAnimationStyle = (index, sectionIndex) => {
    const delay = 0.03 * (index + sectionIndex * 5) // Reduced delay for faster animation
    return {
      opacity: itemsAnim,
      transform: [
        {
          translateX: itemsAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-15, 0], // Reduced movement for subtler animation
          }),
        },
      ],
    }
  }

  // Função para lidar com o clique nos itens do menu
  const handleMenuItemClick = (key) => {
    console.log("Menu item clicked:", key)

    // Lista de todas as telas válidas
    const validScreens = [
      "home",
      "calendar",
      "fertility",
      "community",
      "profile",
      "ai",
      "wisdom",
      "notifications",
      "cycle",
      "help",
      "about",
      "privacy",
      "evidence",
      "createPost",
      "registerSymptom",
    ]

    if (validScreens.includes(key)) {
      console.log("Navigating to:", key)
      setActiveTab(key)
    }

    // Fechar o menu
    onClose()
  }

  return (
    <Animated.View
      style={[
        styles.menuFullOverlay,
        { opacity: fadeAnim, display: fadeAnim._value === 0 && !isVisible ? "none" : "flex" },
      ]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.menuOverlay} onPress={onClose} activeOpacity={1} />
        <Animated.View
          style={[
            styles.menu,
            {
              width: menuWidth,
              transform: [{ translateX: slideAnim }],
              backgroundColor: isDark ? colors.dark.card : colors.light.card,
            },
          ]}
        >
          <View style={[styles.menuHeader, { backgroundColor: colors.primary.black }]}>
            <View style={styles.menuHeaderContent}>
              <Text style={styles.menuTitle}>KIBABA</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon family="AntDesign" name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.menuScrollContent} showsVerticalScrollIndicator={false}>
            {menuSections.map((section, sectionIndex) => (
              <View key={section.title} style={styles.menuSection}>
                <Text
                  style={[
                    styles.menuSectionTitle,
                    {
                      color: colors.primary.orange, // Using default orange color for section titles
                      opacity: 0.9, // Slightly reduce opacity for better hierarchy
                    },
                  ]}
                >
                  {section.title}
                </Text>

                {section.items.map((item, itemIndex) => (
                  <Animated.View key={item.key} style={getItemAnimationStyle(itemIndex, sectionIndex)}>
                    <TouchableOpacity
                      style={[
                        styles.menuItem,
                        // Add subtle highlight for active item
                        activeTab === item.key && {
                          backgroundColor: isDark ? "rgba(247, 163, 37, 0.08)" : "rgba(247, 163, 37, 0.12)",
                        },
                      ]}
                      activeOpacity={0.6} // Reduced from 0.7 for better feedback
                      onPress={() => handleMenuItemClick(item.key)}
                    >
                      <View
                        style={[
                          styles.menuItemIconContainer,
                          {
                            backgroundColor:
                              activeTab === item.key
                                ? `rgba(247, 163, 37, ${0.2 + sectionIndex * 0.05})`
                                : `rgba(247, 163, 37, ${0.1 + sectionIndex * 0.05})`,
                          },
                        ]}
                      >
                        <Icon family={item.family} name={item.icon} size={22} color={colors.primary.orange} />
                      </View>
                      <Text
                        style={[
                          styles.menuItemText,
                          {
                            color: isDark ? colors.dark.text : colors.light.text,
                            fontWeight: activeTab === item.key ? "600" : "500", // Bold active item
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Icon
                        family="Feather"
                        name="chevron-right"
                        size={18}
                        color={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
                        style={[
                          styles.menuItemArrow,
                          // Make arrow more visible for active item
                          activeTab === item.key && { opacity: 0.8 },
                        ]}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}

                {sectionIndex < menuSections.length - 1 && (
                  <View
                    style={[
                      styles.menuSectionDivider,
                      { backgroundColor: isDark ? colors.dark.border : colors.light.border },
                    ]}
                  />
                )}
              </View>
            ))}

            <View style={styles.menuFooter}>
              <Text
                style={[styles.menuVersion, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}
              >
                KIBABA v1.0.0
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: "rgba(233, 78, 53, 0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(233, 78, 53, 0.2)",
                  },
                ]}
                activeOpacity={0.7}
                /* onPress={() => {
                  onClose()
                  setIsAuthenticated(false)
                }} */
               onPress={async () => {
                  try {
                    await logout();
                    onClose();
                  } catch (error) {
                    console.log("Erro ao fazer logout:", error);
                  }
                }}
              >
                <Icon family="Feather" name="log-out" size={18} color={colors.primary.red} />
                <Text style={[styles.logoutText, { color: colors.primary.red }]}>Sair da conta</Text>
              </TouchableOpacity>

              <Text></Text>
              <Text></Text>
              <Text></Text>
              <Text></Text>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  )
}

// Componente de conteúdo com animações
const AnimatedContent = ({ activeTab, setActiveTab }) => {
  const { colors, isDark } = useTheme()
  const fadeAnim = useRef(new Animated.Value(1)).current
  const [currentTab, setCurrentTab] = useState(activeTab)

  useEffect(() => {
    if (currentTab !== activeTab) {
      // Animar a transição entre tabs
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          delay: 50,
        }),
      ]).start(() => {
        setCurrentTab(activeTab)
      })
    }
  }, [activeTab])

  // Conteúdo da tela baseado na tab ativa
  const renderContent = () => {
    console.log("Rendering content for tab:", currentTab)
    switch (currentTab) {
      case "home":
        return <HomeScreen />
      case "calendar":
        return <CalendarScreen />
      case "fertility":
        return <FertilityScreen />
      case "community":
        return <CommunityScreen activeTab={activeTab} setActiveTab={setActiveTab} />
      case "profile":
        return <ProfileScreen />
      case "ai":
        return <AIAssistantScreen />
      case "wisdom":
        return <WisdomScreen />
      case "notifications":
        return <NotificationsScreen />
      case "cycle":
        return <CycleScreen />
      case "help":
        return <HelpSupportScreen />
      case "about":
        return <AboutScreen />
      case "privacy":
        return <PrivacyTermsScreen />
      case "evidence":
        return <ScientificEvidenceScreen />
      case "createPost":
        return <CreatePostScreen setActiveTab={setActiveTab} />;
      case "registerSymptom": 
        return <RegisterSymptomScreen setActiveTab={setActiveTab} />;
      default:
        console.log("No matching screen for tab:", currentTab)
        return null
    }
  }

  return (
    <Animated.View
      style={[
        styles.content,
        {
          opacity: fadeAnim,
          backgroundColor: isDark ? colors.dark.background : colors.light.background,
        },
      ]}
    >
      {renderContent()}
    </Animated.View>
  )
}

// Main App component wrapped with ThemeProvider
const AppContent = () => {
  const { isDark, primaryColor, culturalTheme, language } = useTheme()
  const [menuVisible, setMenuVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
 // const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { isAuthenticated, logout, loading } = useAuth();

  // Animation refs
  const spinValue = useRef(new Animated.Value(0)).current
  const notificationBounce = useRef(new Animated.Value(0)).current
  const aiPulse = useRef(new Animated.Value(1)).current
  const tabAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current

  // Monitor active tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab)
  }, [activeTab])

  // Monitor theme changes
  useEffect(() => {
    console.log("Theme updated:", { isDark, primaryColor, culturalTheme, language })
  }, [isDark, primaryColor, culturalTheme, language])

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const closeMenu = () => {
    setMenuVisible(false)
  }

  /* const handleAuthentication = () => {
    setIsAuthenticated(true)
  } */

  // If not authenticated, show the auth flow
  /* if (!isAuthenticated) {
    return <AuthFlow onAuthenticate={handleAuthentication} />
  } */

    

  // Enquanto estiver carregando o estado de autenticação, exibir um loading
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000", textAlign: "center", marginTop: 50 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  // Se não estiver autenticado, exibir o fluxo de autenticação
  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  // If authenticated, show the main app
  // Se autenticado, exibir o app principal
  return (
    <SafeAreaView style={styles.container}>
      <ThemedHeader
        onMenuPress={toggleMenu}
        title="KIBABA"
        setActiveTab={setActiveTab}
        spinValue={spinValue}
        notificationBounce={notificationBounce}
        aiPulse={aiPulse}
      />

      <AnimatedContent activeTab={activeTab} setActiveTab={setActiveTab} />

      <ThemedBottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabAnimations={tabAnimations} />

      <SideMenu
        isVisible={menuVisible}
        onClose={closeMenu}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setIsAuthenticated={() => logout()} // Chama a função de logout do contexto
        primaryColor={primaryColor}
      />
    </SafeAreaView>
  );

}

// Componente principal
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  // Estilos do menu vertical refinados
  menuFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Increased from 0.5 for better contrast
  },
  menu: {
    height: "100%",
    borderTopRightRadius: 24, // Increased from 20
    borderBottomRightRadius: 24, // Increased from 20
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.35, // Increased from 0.3
    shadowRadius: 12, // Increased from 10
    elevation: 24, // Increased from 20
  },
  menuHeader: {
    padding: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 0, // Remove this
    borderBottomRightRadius: 0, // Remove this
  },
  menuHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  menuTitle: {
    fontSize: 24, // Increased from 22
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1.2, // Increased from 1
  },
  closeButton: {
    padding: 8,
    borderRadius: 20, // Add rounded corners
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Add subtle background
  },
  menuScrollContent: {
    flex: 1,
    paddingTop: 16, // Increased from 10
  },
  menuSection: {
    paddingVertical: 12, // Increased from 8
  },
  menuSectionTitle: {
    fontSize: 13, 
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10, // Increased from 8
    marginBottom: 12, // Increased from 8
    textTransform: "uppercase",
    letterSpacing: 1.2, // Increased from 1
  },
  menuSectionDivider: {
    height: 1,
    marginVertical: 12, // Increased from 8
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14, // Increased from 12
    paddingHorizontal: 20,
  },
  menuItemIconContainer: {
    width: 40, // Increased from 36
    height: 40, // Increased from 36
    borderRadius: 12, // Increased from 10
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16, // Increased from 15
    flex: 1,
    fontWeight: "500", // Add medium weight
  },
  menuItemArrow: {
    opacity: 0.6, // Increased from 0.5
  },
  menuFooter: {
    padding: 24, // Increased from 20
    alignItems: "center",
    marginTop: 2, // Increased from 10
    marginBottom: 10, // Add bottom margin
  },
  menuVersion: {
    fontSize: 12,
    marginBottom: 20, // Increased from 15
    fontWeight: "500", // Add medium weight
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12, // Increased from 10
    paddingHorizontal: 24, // Increased from 20
    borderRadius: 30,
    width: "100%", // Make button full width
    justifyContent: "center", // Center content
  },
  logoutText: {
    fontSize: 15, // Increased from 14
    fontWeight: "600", // Increased from 500
    marginLeft: 10, // Increased from 8
  },
})
