"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Easing,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"

const { width, height } = Dimensions.get("window")

// Update the LoginScreen component to accept navigation props
const LoginScreen = ({ onRegisterPress, onLoginSuccess }) => {
  // State for form values
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [focusedInput, setFocusedInput] = useState(null)

  // Animation values - simplified
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const logoScale = useRef(new Animated.Value(0.8)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const socialButtonsAnim = useRef(new Animated.Value(0)).current
  const formBounceAnim = useRef(new Animated.Value(1)).current

  // Animation for content fade in - simplified
  useEffect(() => { 
    // Sequence of animations for initial load
    Animated.sequence([
      // First fade in the logo
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
      // Then animate the logo scale and full fade
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Then slide up the content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // Finally animate in the social buttons
      Animated.timing(socialButtonsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Update the handleLogin function to call onLoginSuccess when login is successful
  /* const handleLogin = async () => {
    // Reset error
    setError("")

    //console.log("Tentativa de login com:", { email, password });
    // Validate form
    if (!email.trim()) {
      setError("Por favor, insira seu email")
      shakeForm()
      return
    }

    if (!password.trim()) {
      setError("Por favor, insira sua senha")
      shakeForm()
      return
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    // Show loading state
    setIsLoading(true)

    try {
      await onLoginSuccess(email, password, rememberMe);
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login. Tente novamente.");
      shakeForm();
    } finally {
      setIsLoading(false);
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, we'll simulate a successful login
      // In a real app, you would check the credentials against a backend
      if (email.includes("@") && password.length >= 6) {
        // Call the onLoginSuccess callback
        if (onLoginSuccess) {
          onLoginSuccess()
        }
      } else {
        // Show error for invalid credentials
        setError("Credenciais inválidas. Por favor, tente novamente.")
        shakeForm()
      }
    }, 1500)
  } */

  const handleLogin = async () => {
    setError("");
    console.log("Tentativa de login com:", { email, password });

    if (!email.trim()) {
        setError("Por favor, insira seu email");
        shakeForm();
        return;
    }

    if (!password.trim()) {
        setError("Por favor, insira sua senha");
        shakeForm();
        return;
    }

    Animated.sequence([
        Animated.timing(buttonScale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }),
    ]).start();

    setIsLoading(true);

    try {
        const response = await onLoginSuccess(email, password, rememberMe);
        console.log("Resposta da API:", response);
    } catch (error) {
        //console.error("Erro no login:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Erro ao fazer login. Tente novamente.");
        shakeForm();
    } finally {
        setIsLoading(false);
    }
  };

  // Shake animation for form errors
  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start()
  }

  // Animate social button press
  const animateSocialButtonPress = (index) => {
    // Simple animation without using pre-created values
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Modern Geometric Pattern Component
  const ModernGeometricPattern = () => {
    return (
      <View
        style={styles.patternContainer}
        accessibilityLabel="Padrão decorativo geométrico"
        importantForAccessibility="no"
      >
        {/* Abstract shapes */}
        <View style={styles.patternRow}>
          <View style={[styles.patternElement, styles.patternCircleGradient]} />
          <View style={[styles.patternElement, styles.patternRing]} />
          <View style={[styles.patternElement, styles.patternDot]} />
        </View>

        <View style={[styles.patternRow, { marginTop: 20 }]}>
          <View style={[styles.patternElement, styles.patternSquareGradient]} />
          <View style={[styles.patternElement, styles.patternTriangleModern]} />
          <View style={[styles.patternElement, styles.patternCircleSmall]} />
        </View>

        <View style={[styles.patternRow, { marginTop: 20 }]}>
          <View style={[styles.patternElement, styles.patternDotLarge]} />
          <View style={[styles.patternElement, styles.patternHexagon]} />
          <View style={[styles.patternElement, styles.patternRectangle]} />
        </View>

        {/* Connecting lines */}
        <View
          style={[styles.patternLine, { width: 30, height: 2, top: 35, left: 40, transform: [{ rotate: "30deg" }] }]}
        />
        <View
          style={[styles.patternLine, { width: 40, height: 2, top: 65, left: 60, transform: [{ rotate: "-30deg" }] }]}
        />
        <View
          style={[styles.patternLine, { width: 35, height: 2, top: 95, left: 50, transform: [{ rotate: "60deg" }] }]}
        />
      </View>
    )
  }

  // Render floating label input - modernized
  const renderFloatingLabelInput = (label, value, setValue, icon, isPassword = false, keyboardType = "default") => {
    const isFocused = focusedInput === label
    const hasValue = value.length > 0
    const inputId = label.toLowerCase().replace(/\s+/g, "")

    // Determine colors based on focus state
    const borderColor = isFocused ? "#FF9D5C" : hasValue ? "#3A3A3A" : "#3A3A3A"
    const labelColor = isFocused ? "#FF9D5C" : hasValue ? "#AAAAAA" : "#777777"
    const iconColor = isFocused ? "#FF9D5C" : "#777777"
    const backgroundColor = isFocused ? "rgba(255, 157, 92, 0.05)" : "rgba(255, 255, 255, 0.03)"

    return (
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            shadowOpacity: isFocused ? 0.2 : 0,
          },
          error &&
            label.toLowerCase().includes(error.toLowerCase().split(" ")[error.toLowerCase().split(" ").length - 1]) && {
              borderColor: "#E57373",
              shadowColor: "#E57373",
            },
        ]}
      >
        <View style={styles.inputIconContainer}>
          <Icon family="Feather" name={icon} size={18} color={iconColor} />
        </View>

        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.floatingLabel,
              {
                transform: [
                  { translateY: isFocused || hasValue ? -25 : 0 },
                  { scale: isFocused || hasValue ? 0.85 : 1 },
                ],
              },
            ]}
          >
            <Text style={{ color: labelColor, fontWeight: "500" }}>{label}</Text>
          </View>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            onFocus={() => {
              setFocusedInput(label)
            }}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={label === "Email" ? "none" : "sentences"}
            placeholderTextColor="#555555"
            accessibilityLabel={label}
          />
        </View>

        {isPassword && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <Icon family="Feather" name={showPassword ? "eye-off" : "eye"} size={18} color="#AAAAAA" />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={styles.backgroundContainer}>
      {/* Background gradient */}
      <View style={styles.gradientBackground} />

      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        {Array.from({ length: 20 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.backgroundDot,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                opacity: Math.random() * 0.5 + 0.1,
              },
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo */} 
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>K</Text>
              <View style={styles.logoGlow} />
            </View>
            <Text style={styles.appName}>KIBABA</Text>
            <Text style={styles.appTagline}>
              Saúde e Sabedoria Feminina{/*  <Text style={{ fontSize: 16 }}>✨</Text> */}
            </Text>
            <ModernGeometricPattern />
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { translateX: shakeAnim }],
              },
            ]}
          >
            <View style={styles.formTitleContainer}>
              <Text style={styles.formTitle}>Entrar</Text>
              <Text style={{ fontSize: 24, marginLeft: 8 }}>👋</Text>
            </View>

            {/* Error message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email Input */}
            {renderFloatingLabelInput("Email", email, setEmail, "mail", false, "email-address")}

            {/* Password Input */}
            {renderFloatingLabelInput("Senha", password, setPassword, "lock", true)}

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Icon family="Feather" name="check" size={12} color="#1E1E1E" />}
                </View>
                <Text style={styles.rememberText}>Lembrar-me</Text>
              </TouchableOpacity>

             {/*  <TouchableOpacity
                style={styles.forgotPasswordButton}
                activeOpacity={0.7}
                onPress={() => {
                  // Simple animation
                  Animated.sequence([
                    Animated.timing(buttonScale, {
                      toValue: 0.95,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                    Animated.timing(buttonScale, {
                      toValue: 1,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                  ]).start()
                }}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity> */}
            </View>

            {/* Login Button */}
            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
                shadowColor: "#FF9D5C",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingDot} />
                    <View style={[styles.loadingDot, { marginLeft: 8 }]} />
                    <View style={[styles.loadingDot, { marginLeft: 8 }]} />
                  </View>
                ) : (
                  /* btn sign in */
                  <View style={styles.loginButtonContent}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                    <Icon family="Feather" name="arrow-right" size={16} color="#1E1E1E" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Social Login */}
            {/* <Animated.View
              style={[
                styles.socialContainer,
                {
                  opacity: socialButtonsAnim,
                },
              ]}
            >
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou continue com</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: "rgba(59, 89, 152, 0.1)" }]}
                  onPress={() => animateSocialButtonPress(0)}
                  activeOpacity={0.8}
                  accessibilityLabel="Entrar com Facebook"
                >
                  <Icon family="FontAwesome" name="facebook" size={20} color="#3b5998" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: "rgba(29, 161, 242, 0.1)" }]}
                  onPress={() => animateSocialButtonPress(1)}
                  activeOpacity={0.8}
                  accessibilityLabel="Entrar com Twitter"
                >
                  <Icon family="FontAwesome" name="twitter" size={20} color="#1DA1F2" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: "rgba(219, 68, 55, 0.1)" }]}
                  onPress={() => animateSocialButtonPress(2)}
                  activeOpacity={0.8}
                  accessibilityLabel="Entrar com Google"
                >
                  <Icon family="FontAwesome" name="google" size={20} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}
                  onPress={() => animateSocialButtonPress(3)}
                  activeOpacity={0.8}
                  accessibilityLabel="Entrar com Apple"
                >
                  <Icon family="FontAwesome" name="apple" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View> */}

            {/* Sign Up Link */}
            <Animated.View
              style={[
                styles.signupContainer,
                {
                  opacity: socialButtonsAnim,
                },
              ]}
            >
              <Text style={styles.signupText}>Não tem uma conta?</Text>
              <TouchableOpacity
                style={styles.signupButton}
                activeOpacity={0.7}
                onPress={() => {
                  onRegisterPress()
                }}
              >
                <Text style={styles.signupButtonText}>
                  Cadastre-se {/* <Text style={{ fontSize: 14 }}>✨</Text> */}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
     {/*  <Text style={styles.developedText}>
        Developed by - morgadoandrade -
      </Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#121212",
    borderWidth: 0,
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  backgroundDot: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "#FF9D5C",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  patternContainer: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  patternElement: {
    margin: 2,
  },
  patternTriangleModern: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FF9D5C",
  },
  patternCircleGradient: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF9D5C",
  },
  patternRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FF9D5C",
    backgroundColor: "transparent",
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  patternDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF9D5C",
  },
  patternLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 157, 92, 0.5)",
  },
  patternSquareGradient: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#FF9D5C",
    transform: [{ rotate: "45deg" }],
  },
  patternCircleSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF9D5C",
    opacity: 0.7,
  },
  patternHexagon: {
    width: 16,
    height: 16,
    backgroundColor: "#FF9D5C",
    borderRadius: 2,
  },
  patternRectangle: {
    width: 18,
    height: 8,
    backgroundColor: "#FF9D5C",
    borderRadius: 4,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF9D5C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#FF9D5C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: "relative",
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 157, 92, 0.3)",
    top: -10,
    left: -10,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(30, 30, 30, 0.5)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 115, 115, 0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  errorText: {
    color: "#E57373",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
    height: 60,
    paddingHorizontal: 4,
    shadowColor: "#FF9D5C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIconContainer: {
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    top: 20,
    fontSize: 16,
    color: "#777777",
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 10,
    fontWeight: "500",
  },
  passwordToggle: {
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF9D5C",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF9D5C",
  },
  rememberText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPasswordButton: {
    padding: 4,
  },
  forgotPasswordText: {
    color: "#FF9D5C",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FF9D5C",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#1E1E1E",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E1E1E",
  },
  socialContainer: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    color: "#AAAAAA",
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
  },
  developedText: {
    color: "#AAAAAA",
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
  },
  signupButton: {
    marginLeft: 8,
    padding: 4,
  },
  signupButtonText: {
    color: "#FF9D5C",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default LoginScreen
