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
import { register } from "../services/auth/authentication"
import { usernames_traditional } from "../services/authed/main-service"

const { width, height } = Dimensions.get("window")

// Update the RegisterScreen component to accept navigation props
const RegisterScreen = ({ onLoginPress, onRegisterSuccess }) => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // State for form values
  /* const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2: Personal Info
    birthDate: "",
    location: "",
    traditionalName: "",

    // Step 3: Health Info
    cycleLength: "28",
    periodLength: "5",
    lastPeriodDate: "",

    // Step 4: Preferences
    interests: [] as string[],
    notifications: true,
    traditionalWisdom: true,
    language: "Português",
  }) */

    const [formData, setFormData] = useState({
      // Step 1: Basic Info
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      nif: "", // Novo campo
      phone_number: "", // Novo campo

      // Step 2: Personal Info
      birthDate: "",
      location: "",
      traditionalName: "",

      // Step 3: Health Info
      cycleLength: "28",
      periodLength: "5",
      lastPeriodDate: "",

      // Step 4: Preferences
      interests: [] as string[],
      notifications: true,
      traditionalWisdom: true,
      language: "Português",
    });
  // Available interests
  const availableInterests = [
    { id: "fertility", label: "Fertilidade", icon: "droplet" },
    { id: "cycle", label: "Ciclo Menstrual", icon: "moon" },
    { id: "traditional", label: "Sabedoria Tradicional", icon: "feather" },
    { id: "health", label: "Saúde Feminina", icon: "heart" },
    { id: "pregnancy", label: "Gravidez", icon: "star" },
    { id: "community", label: "Comunidade", icon: "users" },
  ]

  // State for UI
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const progressAnim = useRef(new Animated.Value((currentStep / totalSteps) * 100)).current
  const stepFadeAnim = useRef(new Animated.Value(1)).current
  const stepSlideAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const patternRotate = useRef(new Animated.Value(0)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.8)).current
  const socialButtonsAnim = useRef(new Animated.Value(0)).current

  // Create animation values for all input fields at the top level
  const nameTranslateY = useRef(new Animated.Value(formData.name ? -25 : 0)).current
  const nameScale = useRef(new Animated.Value(formData.name ? 0.85 : 1)).current

  const emailTranslateY = useRef(new Animated.Value(formData.email ? -25 : 0)).current
  const emailScale = useRef(new Animated.Value(formData.email ? 0.85 : 1)).current

  const passwordTranslateY = useRef(new Animated.Value(formData.password ? -25 : 0)).current
  const passwordScale = useRef(new Animated.Value(formData.password ? 0.85 : 1)).current

  const confirmPasswordTranslateY = useRef(new Animated.Value(formData.confirmPassword ? -25 : 0)).current
  const confirmPasswordScale = useRef(new Animated.Value(formData.confirmPassword ? 0.85 : 1)).current

  const birthDateTranslateY = useRef(new Animated.Value(formData.birthDate ? -25 : 0)).current
  const birthDateScale = useRef(new Animated.Value(formData.birthDate ? 0.85 : 1)).current

  const locationTranslateY = useRef(new Animated.Value(formData.location ? -25 : 0)).current
  const locationScale = useRef(new Animated.Value(formData.location ? 0.85 : 1)).current

  const lastPeriodDateTranslateY = useRef(new Animated.Value(formData.lastPeriodDate ? -25 : 0)).current
  const lastPeriodDateScale = useRef(new Animated.Value(formData.lastPeriodDate ? 0.85 : 1)).current

  const [availableUsernamesTraditional, setAvailableUsernamesTraditional] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await usernames_traditional();
        setAvailableUsernamesTraditional(data.usernames_traditional);
      } catch (error) {
      //  console.error("Erro ao buscar Nomes Tradicionais:", error);
      }
    };   //
    
    fetchData();
  }, []); 

  // Animation for content fade in
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
    ]).start()

    // Animate pattern rotation continuously
    Animated.loop(
      Animated.timing(patternRotate, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  // Animation for step change
  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (currentStep / totalSteps) * 100,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.cubic),
    }).start()

    // Animate step transition
    Animated.sequence([
      // Fade out and slide out current step
      Animated.parallel([
        Animated.timing(stepFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(stepSlideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      // Reset position for next step
      Animated.timing(stepSlideAnim, {
        toValue: 20,
        duration: 0,
        useNativeDriver: true,
      }),
      // Fade in and slide in next step
      Animated.parallel([
        Animated.timing(stepFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stepSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start()
  }, [currentStep])

  // Animate floating labels based on focus and value
  useEffect(() => {
    const isFocused = focusedInput === "name"
    const hasValue = formData.name && formData.name.length > 0

    Animated.parallel([
      Animated.timing(nameTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.name])

  useEffect(() => {
    const isFocused = focusedInput === "email"
    const hasValue = formData.email && formData.email.length > 0

    Animated.parallel([
      Animated.timing(emailTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(emailScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.email])

  useEffect(() => {
    const isFocused = focusedInput === "password"
    const hasValue = formData.password && formData.password.length > 0

    Animated.parallel([
      Animated.timing(passwordTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(passwordScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.password])

  useEffect(() => {
    const isFocused = focusedInput === "confirmPassword"
    const hasValue = formData.confirmPassword && formData.confirmPassword.length > 0

    Animated.parallel([
      Animated.timing(confirmPasswordTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(confirmPasswordScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.confirmPassword])

  useEffect(() => {
    const isFocused = focusedInput === "birthDate"
    const hasValue = formData.birthDate && formData.birthDate.length > 0

    Animated.parallel([
      Animated.timing(birthDateTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(birthDateScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.birthDate])

  useEffect(() => {
    const isFocused = focusedInput === "location"
    const hasValue = formData.location && formData.location.length > 0

    Animated.parallel([
      Animated.timing(locationTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(locationScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.location])

  useEffect(() => {
    const isFocused = focusedInput === "lastPeriodDate"
    const hasValue = formData.lastPeriodDate && formData.lastPeriodDate.length > 0

    Animated.parallel([
      Animated.timing(lastPeriodDateTranslateY, {
        toValue: isFocused || hasValue ? -25 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(lastPeriodDateScale, {
        toValue: isFocused || hasValue ? 0.85 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focusedInput, formData.lastPeriodDate])

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      })
    }
  }

  // Toggle interest selection
  const toggleInterest = (interestId) => {
    const updatedInterests = [...(formData.interests || [])]

    if (updatedInterests.includes(interestId)) {
      // Remove interest
      const index = updatedInterests.indexOf(interestId)
      updatedInterests.splice(index, 1)
    } else {
      // Add interest
      updatedInterests.push(interestId)
    }

    setFormData({
      ...formData,
      interests: updatedInterests,
    })
  }

  // Validate current step
  /* const validateCurrentStep = () => {
    const newErrors = {}

    if (currentStep === 1) {
      // Validate basic info
      if (!formData.name || !formData.name.trim()) {
        newErrors.name = "Nome é obrigatório"
      }

      if (!formData.email || !formData.email.trim()) {
        newErrors.email = "Email é obrigatório"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido"
      }

      if (!formData.password || !formData.password.trim()) {
        newErrors.password = "Senha é obrigatória"
      } else if (formData.password.length < 6) {
        newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Senhas não coincidem"
      }
    } else if (currentStep === 2) {
      // Validate personal info
      if (!formData.birthDate || !formData.birthDate.trim()) {
        newErrors.birthDate = "Data de nascimento é obrigatória"
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthDate)) {
        newErrors.birthDate = "Formato inválido (DD/MM/AAAA)"
      }

      if (!formData.location || !formData.location.trim()) {
        newErrors.location = "Localização é obrigatória"
      }
    } else if (currentStep === 3) {
      // Validate health info
      if (!formData.lastPeriodDate || !formData.lastPeriodDate.trim()) {
        newErrors.lastPeriodDate = "Data do último período é obrigatória"
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.lastPeriodDate)) {
        newErrors.lastPeriodDate = "Formato inválido (DD/MM/AAAA)"
      }
    } else if (currentStep === 4) {
      // Validate preferences
      if (formData.interests.length === 0) {
        newErrors.interests = "Selecione pelo menos um interesse"
      }

      if (!termsAccepted) {
        newErrors.terms = "Você deve aceitar os termos e condições"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  } */

    const validateCurrentStep = () => {
  const newErrors = {};

  if (currentStep === 1) {
    if (!formData.name || !formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.nif || !formData.nif.trim()) newErrors.nif = "NIF é obrigatório";
    if (!formData.phone_number || !formData.phone_number.trim()) newErrors.phone_number = "Número de telefone é obrigatório";
    if (!formData.email || !formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.password || !formData.password.trim()) newErrors.password = "Senha é obrigatória";
    else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem";
  } else if (currentStep === 2) {
    if (!formData.birthDate || !formData.birthDate.trim()) newErrors.birthDate = "Data de nascimento é obrigatória";
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthDate)) newErrors.birthDate = "Formato inválido (DD/MM/AAAA)";
    if (!formData.location || !formData.location.trim()) newErrors.location = "Localização é obrigatória";
  } else if (currentStep === 3) {
    if (!formData.lastPeriodDate || !formData.lastPeriodDate.trim()) newErrors.lastPeriodDate = "Data do último período é obrigatória";
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.lastPeriodDate)) newErrors.lastPeriodDate = "Formato inválido (DD/MM/AAAA)";
  } else if (currentStep === 4) {
    if (formData.interests.length === 0) newErrors.interests = "Selecione pelo menos um interesse";
    if (!termsAccepted) newErrors.terms = "Você deve aceitar os termos e condições";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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

  // Go to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
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

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    } else {
      shakeForm()
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
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

      setCurrentStep(currentStep - 1)
    }
  }

  // Update the handleSubmit function to call onRegisterSuccess when registration is successful

  const handleSubmit = async () => {
  setIsLoading(true);

  try {

    let usernameTraditionalId = null;
    if (formData.traditionalName) {
      const selectedUsername = availableUsernamesTraditional.find(
        (username) => `${username.name} (${username.meaning})` === formData.traditionalName
      );
      usernameTraditionalId = selectedUsername ? selectedUsername.id : null;
    }

    const registrationData = {
      email: formData.email,
      name: formData.name,
      nif: formData.nif,
      password: formData.password,
      phone_number: formData.phone_number,
      birth_date: formData.birthDate,
      address: formData.location,
      username_traditional: usernameTraditionalId || 1,
      data_inicio_ultimo_periodo: formData.lastPeriodDate,
      duracao_ciclo: formData.cycleLength,
      duracao_menstruacao: formData.periodLength,
      regular: "0",
    };

    console.log(registrationData);

    const [day, month, year] = formData.lastPeriodDate.split("/").map(Number);
    const lastPeriod = new Date(year, month - 1, day);
    const cycleDays = parseInt(formData.cycleLength);
    const periodDays = parseInt(formData.periodLength);

    registrationData.data_fim_ultimo_periodo = new Date(lastPeriod.setDate(lastPeriod.getDate() + periodDays - 1))
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");
    registrationData.data_ovulacao = new Date(lastPeriod.setDate(lastPeriod.getDate() + cycleDays - 14))
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");
    registrationData.inicio_da_janela_fertil = new Date(lastPeriod.setDate(lastPeriod.getDate() + cycleDays - 5))
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");
    registrationData.fim_da_janela_fertil = new Date(lastPeriod.setDate(lastPeriod.getDate() + cycleDays))
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");

    const response = await register(registrationData);
    console.log("Registro bem-sucedido:", response);

    setErrors({ success: "Conta criada com sucesso! Redirecionando..." });
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onRegisterSuccess) {
      onRegisterSuccess(); 
    }
  } catch (error) {
    console.log("Erro no registro:", error.response?.data || error.message);
    setErrors({ general: error.response?.data?.message || "Erro ao registrar. Tente novamente." });
    shakeForm();
  } finally {
    setIsLoading(false);
  }
};
  // Modern Geometric Pattern Component
  const ModernGeometricPattern = () => {
    const spin = patternRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    })

    return (
      <Animated.View style={[styles.patternContainer, { transform: [{ rotate: spin }] }]}>
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
      </Animated.View>
    )
  }

  // Render floating label input - modernized
  const renderFloatingLabelInput = (label, field, placeholder, icon, isPassword = false, keyboardType = "default") => {
    const isFocused = focusedInput === field
    const hasValue = formData[field]?.length > 0

    // Determine colors based on focus state
    const borderColor = isFocused ? "#FF9D5C" : hasValue ? "#3A3A3A" : "#3A3A3A"
    const labelColor = isFocused ? "#FF9D5C" : hasValue ? "#AAAAAA" : "#777777"
    const iconColor = isFocused ? "#FF9D5C" : "#777777"
    const backgroundColor = isFocused ? "rgba(255, 157, 92, 0.05)" : "rgba(255, 255, 255, 0.03)"

    // Get the appropriate animation values based on the field
    let labelTranslateY, labelScale

    switch (field) {
      case "name":
        labelTranslateY = nameTranslateY
        labelScale = nameScale
        break
      case "email":
        labelTranslateY = emailTranslateY
        labelScale = emailScale
        break
      case "password":
        labelTranslateY = passwordTranslateY
        labelScale = passwordScale
        break
      case "confirmPassword":
        labelTranslateY = confirmPasswordTranslateY
        labelScale = confirmPasswordScale
        break
      case "birthDate":
        labelTranslateY = birthDateTranslateY
        labelScale = birthDateScale
        break
      case "location":
        labelTranslateY = locationTranslateY
        labelScale = locationScale
        break
      case "lastPeriodDate":
        labelTranslateY = lastPeriodDateTranslateY
        labelScale = lastPeriodDateScale
        break
      default:
        // Fallback to static styling if field doesn't have dedicated animations
        return (
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: borderColor,
                  backgroundColor: backgroundColor,
                  shadowOpacity: isFocused ? 0.2 : 0,
                },
                errors[field] && {
                  borderColor: "#E57373",
                  shadowColor: "#E57373",
                },
              ]}
            >
              <View style={styles.inputIconContainer}>
                <Icon family="Feather" name={icon} size={18} color={iconColor} />
              </View>

              <View style={styles.inputFieldWrapper}>
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
                  <Text style={{ color: labelColor, fontWeight: "500" }}>{placeholder}</Text>
                </View>

                <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) => handleInputChange(field, text)}
                  onFocus={() => setFocusedInput(field)}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={isPassword && !showPassword}
                  keyboardType={keyboardType}
                  autoCapitalize={field === "email" ? "none" : "sentences"}
                  placeholderTextColor="#555555"
                />
              </View>

              {isPassword && (
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Icon family="Feather" name={showPassword ? "eye-off" : "eye"} size={18} color="#AAAAAA" />
                </TouchableOpacity>
              )}
            </View>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </View>
        )
    }

    return (
      <View style={styles.inputWrapper}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              shadowOpacity: isFocused ? 0.2 : 0,
            },
            errors[field] && {
              borderColor: "#E57373",
              shadowColor: "#E57373",
            },
          ]}
        >
          <View style={styles.inputIconContainer}>
            <Icon family="Feather" name={icon} size={18} color={iconColor} />
          </View>

          <View style={styles.inputFieldWrapper}>
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
                  color: labelColor,
                },
              ]}
            >
              {placeholder}
            </Animated.Text>

            <TextInput
              style={styles.input}
              value={formData[field]}
              onChangeText={(text) => handleInputChange(field, text)}
              onFocus={() => setFocusedInput(field)}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry={isPassword && !showPassword}
              keyboardType={keyboardType}
              autoCapitalize={field === "email" ? "none" : "sentences"}
              placeholderTextColor="#555555"
            />
          </View>

          {isPassword && (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Icon family="Feather" name={showPassword ? "eye-off" : "eye"} size={18} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    )
  }

  // Render step 1: Basic Info
  /* const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: stepFadeAnim,
          transform: [{ translateX: stepSlideAnim }, { translateX: shakeAnim }],
        },
      ]}
    >
      <View style={styles.formTitleContainer}>
        <Text style={styles.stepTitle}>Informações Básicas</Text>
        <Text style={{ fontSize: 24, marginLeft: 8 }}>👋</Text>
      </View>
      <Text style={styles.stepDescription}>Crie sua conta para começar sua jornada de saúde e bem-estar</Text>

      {Object.keys(errors).length > 0 && currentStep === 1 && (
        <View style={styles.errorContainer}>
          <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
          <Text style={styles.errorContainerText}>{Object.values(errors)[0]}</Text>
        </View>
      )}

      {renderFloatingLabelInput("Nome Completo", "name", "Nome Completo", "user")}
      {renderFloatingLabelInput("Email", "email", "Email", "mail", false, "email-address")}
      {renderFloatingLabelInput("Senha", "password", "Senha", "lock", true)}
      {renderFloatingLabelInput("Confirmar Senha", "confirmPassword", "Confirmar Senha", "check", true)}
    </Animated.View>
  )
 */
  const renderStep1 = () => (
  <Animated.View
    style={[
      styles.stepContainer,
      {
        opacity: stepFadeAnim,
        transform: [{ translateX: stepSlideAnim }, { translateX: shakeAnim }],
      },
    ]}
  >
    <View style={styles.formTitleContainer}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      <Text style={{ fontSize: 24, marginLeft: 8 }}>👋</Text>
    </View>
    <Text style={styles.stepDescription}>Crie sua conta para começar sua jornada de saúde e bem-estar</Text>

    {Object.keys(errors).length > 0 && currentStep === 1 && (
      <View style={styles.errorContainer}>
        <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
        <Text style={styles.errorContainerText}>{Object.values(errors)[0]}</Text>
      </View>
    )}

    {renderFloatingLabelInput("Nome Completo", "name", "Nome Completo", "user")}
    {renderFloatingLabelInput("NIF", "nif", "NIF", "user")}
    {renderFloatingLabelInput("Número de Telefone", "phone_number", "Número de Telefone", "phone", false, "phone-pad")}
    {renderFloatingLabelInput("Email", "email", "Email", "mail", false, "email-address")}
    {renderFloatingLabelInput("Senha", "password", "Senha", "lock", true)}
    {renderFloatingLabelInput("Confirmar Senha", "confirmPassword", "Confirmar Senha", "check", true)}
  </Animated.View>
);
 
  // Render step 2: Personal Info
  const renderStep2 = () => (
  <Animated.View
    style={[
      styles.stepContainer,
      {
        opacity: stepFadeAnim,
        transform: [{ translateX: stepSlideAnim }, { translateX: shakeAnim }],
      },
    ]}
  >
    <View style={styles.formTitleContainer}>
      <Text style={styles.stepTitle}>Informações Pessoais</Text>
      <Text style={{ fontSize: 24, marginLeft: 8 }}>📋</Text>
    </View>
    <Text style={styles.stepDescription}>Conte-nos um pouco mais sobre você</Text>

    {/* Error message */}
    {Object.keys(errors).length > 0 && currentStep === 2 && (
      <View style={styles.errorContainer}>
        <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
        <Text style={styles.errorContainerText}>{Object.values(errors)[0]}</Text>
      </View>
    )}

    {renderFloatingLabelInput("Data de Nascimento", "birthDate", "Data de Nascimento (DD/MM/AAAA)", "calendar")}
    {renderFloatingLabelInput("Localização", "location", "Cidade, País", "map-pin")}

    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>Nome Tradicional</Text>
      <View
        style={[
          styles.traditionalNameInputContainer,
          focusedInput === "traditionalName" && styles.traditionalNameInputContainerFocused,
        ]}
      >
        <View style={styles.inputIconContainer}>
          <Icon
            family="Feather"
            name="feather"
            size={18}
            color={focusedInput === "traditionalName" ? "#FF9D5C" : "#777777"}
          />
        </View>
        <View style={styles.selectWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Escolha um nome tradicional (opcional)"
            placeholderTextColor="#777777"
            value={formData.traditionalName}
            onChangeText={(text) => handleInputChange("traditionalName", text)}
            onFocus={() => setFocusedInput("traditionalName")}
            onBlur={() => setFocusedInput(null)}
            editable={false} 
          />
        </View>
        <Icon family="Feather" name="chevron-down" size={18} color="#AAAAAA" style={styles.selectIcon} />
      </View>
      <View style={styles.traditionalNameOptions}>
        {availableUsernamesTraditional.map((username) => {
          const displayText = `${username.name} (${username.meaning})`;
          return (
            <TouchableOpacity
              key={username.id}
              style={[
                styles.traditionalNameOption,
                formData.traditionalName === displayText && styles.traditionalNameOptionSelected,
              ]}
              onPress={() => handleInputChange("traditionalName", displayText)}
            >
              <Text
                style={[
                  styles.traditionalNameOptionText,
                  formData.traditionalName === displayText && styles.traditionalNameOptionTextSelected,
                ]}
              >
                {displayText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  </Animated.View>
);

  // Render step 3: Health Info
  const renderStep3 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: stepFadeAnim,
          transform: [{ translateX: stepSlideAnim }, { translateX: shakeAnim }],
        },
      ]}
    >
      <View style={styles.formTitleContainer}>
        <Text style={styles.stepTitle}>Informações de Saúde</Text>
        <Text style={{ fontSize: 24, marginLeft: 8 }}>💗</Text>
      </View>
      <Text style={styles.stepDescription}>Estas informações nos ajudarão a personalizar sua experiência</Text>

      {/* Error message */}
      {Object.keys(errors).length > 0 && currentStep === 3 && (
        <View style={styles.errorContainer}>
          <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
          <Text style={styles.errorContainerText}>{Object.values(errors)[0]}</Text>
        </View>
      )}

      <View style={styles.healthInputContainer}>
        <Text style={styles.inputLabel}>Duração do Ciclo</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{formData.cycleLength} dias</Text>
          <View style={styles.slider}>
            <View
              style={[styles.sliderFill, { width: `${((Number.parseInt(formData.cycleLength) - 21) / 14) * 100}%` }]}
            />
            <View
              style={[styles.sliderThumb, { left: `${((Number.parseInt(formData.cycleLength) - 21) / 14) * 100}%` }]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>21</Text>
            <Text style={styles.sliderLabel}>28</Text>
            <Text style={styles.sliderLabel}>35</Text>
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleInputChange("cycleLength", Math.max(21, Number.parseInt(formData.cycleLength) - 1).toString())
              }
            >
              <Icon family="Feather" name="minus" size={16} color="#FF9D5C" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleInputChange("cycleLength", Math.min(35, Number.parseInt(formData.cycleLength) + 1).toString())
              }
            >
              <Icon family="Feather" name="plus" size={16} color="#FF9D5C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.healthInputContainer}>
        <Text style={styles.inputLabel}>Duração da Menstruação</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{formData.periodLength} dias</Text>
          <View style={styles.slider}>
            <View
              style={[styles.sliderFill, { width: `${((Number.parseInt(formData.periodLength) - 2) / 8) * 100}%` }]}
            />
            <View
              style={[styles.sliderThumb, { left: `${((Number.parseInt(formData.periodLength) - 2) / 8) * 100}%` }]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>2</Text>
            <Text style={styles.sliderLabel}>5</Text>
            <Text style={styles.sliderLabel}>10</Text>
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleInputChange("periodLength", Math.max(2, Number.parseInt(formData.periodLength) - 1).toString())
              }
            >
              <Icon family="Feather" name="minus" size={16} color="#FF9D5C" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleInputChange("periodLength", Math.min(10, Number.parseInt(formData.periodLength) + 1).toString())
              }
            >
              <Icon family="Feather" name="plus" size={16} color="#FF9D5C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {renderFloatingLabelInput(
        "Data do Último Período",
        "lastPeriodDate",
        "Data do Último Período (DD/MM/AAAA)",
        "calendar",
      )}
    </Animated.View>
  )

  // Render step 4: Preferences
  const renderStep4 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: stepFadeAnim,
          transform: [{ translateX: stepSlideAnim }, { translateX: shakeAnim }],
        },
      ]}
    >
      <View style={styles.formTitleContainer}>
        <Text style={styles.stepTitle}>Preferências</Text>
        <Text style={{ fontSize: 24, marginLeft: 8 }}>✨</Text>
      </View>
      <Text style={styles.stepDescription}>Personalize sua experiência no Kandimba</Text>

      {/* Error message */}
      {Object.keys(errors).length > 0 && currentStep === 4 && (
        <View style={styles.errorContainer}>
          <Icon family="Feather" name="alert-circle" size={16} color="#E57373" />
          <Text style={styles.errorContainerText}>{Object.values(errors)[0]}</Text>
        </View>
      )}

      <View style={styles.preferencesContainer}>
        <Text style={styles.inputLabel}>Interesses</Text>
        <Text style={styles.inputDescription}>Selecione os tópicos que mais lhe interessam</Text>

        <View style={styles.interestsContainer}>
          {availableInterests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[styles.interestButton, formData.interests.includes(interest.id) && styles.interestButtonSelected]}
              onPress={() => toggleInterest(interest.id)}
              activeOpacity={0.7}
            >
              <Icon
                family="Feather"
                name={interest.icon}
                size={16}
                color={formData.interests.includes(interest.id) ? "#FF9D5C" : "#AAAAAA"}
              />
              <Text
                style={[
                  styles.interestButtonText,
                  formData.interests.includes(interest.id) && styles.interestButtonTextSelected,
                ]}
              >
                {interest.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>Receber Notificações</Text>
          <Text style={styles.switchDescription}>Lembretes sobre seu ciclo e dicas de saúde</Text>
        </View>
        <TouchableOpacity
          style={[styles.switchButton, formData.notifications && styles.switchButtonActive]}
          onPress={() => handleInputChange("notifications", !formData.notifications)}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              formData.notifications && styles.switchThumbActive,
              {
                transform: [
                  {
                    translateX: formData.notifications ? 22 : 0,
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>Sabedoria Tradicional</Text>
          <Text style={styles.switchDescription}>Receber conteúdo baseado em tradições angolanas</Text>
        </View>
        <TouchableOpacity
          style={[styles.switchButton, formData.traditionalWisdom && styles.switchButtonActive]}
          onPress={() => handleInputChange("traditionalWisdom", !formData.traditionalWisdom)}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              formData.traditionalWisdom && styles.switchThumbActive,
              {
                transform: [
                  {
                    translateX: formData.traditionalWisdom ? 22 : 0,
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={[styles.checkbox, termsAccepted && styles.checkboxChecked, errors.terms && styles.checkboxError]}
          onPress={() => setTermsAccepted(!termsAccepted)}
          activeOpacity={0.7}
        >
          {termsAccepted && <Icon family="Feather" name="check" size={14} color="#1E1E1E" />}
        </TouchableOpacity>
        <View style={styles.termsTextContainer}>
          <Text style={styles.termsText}>
            Eu li e concordo com os <Text style={styles.termsLink}>Termos de Uso</Text> e{" "}
            <Text style={styles.termsLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </View>
    </Animated.View>
  )

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
              Saúde e Sabedoria Feminina {/* <Text style={{ fontSize: 16 }}>✨</Text> */}
            </Text>
            <ModernGeometricPattern />
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.progressSteps}>
              {[1, 2, 3, 4].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.progressStep,
                    step <= currentStep && styles.progressStepActive,
                    step < currentStep && styles.progressStepCompleted,
                  ]}
                >
                  {step < currentStep ? (
                    <Icon family="Feather" name="check" size={12} color="#1E1E1E" />
                  ) : (
                    <Text style={[styles.progressStepText, step === currentStep && styles.progressStepTextActive]}>
                      {step}
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.progressText}>
              Passo {currentStep} de {totalSteps}
            </Text>
          </View>

          {/* Form Steps */}
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              {currentStep > 1 && (
                <TouchableOpacity style={styles.backButton} onPress={goToPreviousStep} activeOpacity={0.7}>
                  <Icon family="Feather" name="arrow-left" size={20} color="#FFFFFF" />
                  <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
              )}

              <Animated.View
                style={{
                  transform: [{ scale: buttonScale }],
                  flex: 1,
                  shadowColor: "#FF9D5C",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
                  onPress={goToNextStep}
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
                    <View style={styles.nextButtonContent}>
                      <Text style={styles.nextButtonText}>{currentStep === totalSteps ? "Finalizar" : "Próximo"}</Text>
                      <Icon family="Feather" name="arrow-right" size={16} color="#1E1E1E" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={onLoginPress}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 30,
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
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#3A3A3A",
    borderRadius: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF9D5C",
    borderRadius: 3,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  progressStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444444",
  },
  progressStepActive: {
    backgroundColor: "#FF9D5C",
    borderColor: "#FF9D5C",
  },
  progressStepCompleted: {
    backgroundColor: "#FF9D5C",
    borderColor: "#FF9D5C",
  },
  progressStepText: {
    fontSize: 12,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  progressStepTextActive: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 12,
    color: "#AAAAAA",
    textAlign: "right",
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
    marginBottom: 24,
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stepDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 24,
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
  errorContainerText: {
    color: "#E57373",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    height: 60,
    paddingHorizontal: 4,
    shadowColor: "#FF9D5C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 2,
  },
  inputFieldWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    position: "relative",
  },
  traditionalNameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
    height: 60,
    paddingHorizontal: 4,
  },
  traditionalNameInputContainerFocused: {
    borderColor: "#FF9D5C",
    shadowColor: "#FF9D5C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  healthInputContainer: {
    marginBottom: 20,
  },
  preferencesContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 12,
  },
  inputIconContainer: {
    paddingHorizontal: 16,
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    top: 20,
    fontSize: 16,
    color: "#777777",
    fontWeight: "500",
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
  selectWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  selectIcon: {
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#E57373",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  traditionalNameOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  traditionalNameOption: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  traditionalNameOptionSelected: {
    backgroundColor: "rgba(255, 157, 92, 0.15)",
    borderColor: "#FF9D5C",
  },
  traditionalNameOptionText: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  traditionalNameOptionTextSelected: {
    color: "#FF9D5C",
    fontWeight: "500",
  },
  sliderContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9D5C",
    textAlign: "center",
    marginBottom: 12,
  },
  slider: {
    height: 8,
    backgroundColor: "#3A3A3A",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#FF9D5C",
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF9D5C",
    top: -6,
    marginLeft: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  sliderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  interestButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  interestButtonSelected: {
    backgroundColor: "rgba(255, 157, 92, 0.15)",
    borderColor: "#FF9D5C",
  },
  interestButtonText: {
    color: "#AAAAAA",
    fontSize: 14,
    marginLeft: 8,
  },
  interestButtonTextSelected: {
    color: "#FF9D5C",
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  switchTextContainer: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  switchDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  switchButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#444444",
    padding: 2,
  },
  switchButtonActive: {
    backgroundColor: "rgba(255, 157, 92, 0.3)",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#AAAAAA",
  },
  switchThumbActive: {
    backgroundColor: "#FF9D5C",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF9D5C",
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  checkboxChecked: {
    backgroundColor: "#FF9D5C",
    borderColor: "#FF9D5C",
  },
  checkboxError: {
    borderColor: "#E57373",
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 20,
  },
  termsLink: {
    color: "#FF9D5C",
    textDecorationLine: "underline",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: "#FF9D5C",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginLeft: 8,
    padding: 4,
  },
  loginButtonText: {
    color: "#FF9D5C",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default RegisterScreen
