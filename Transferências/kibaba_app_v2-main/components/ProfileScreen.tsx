"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Importar o Icon de forma diferente para evitar ciclos de require
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { mumuilaColors, patternImageUrl } from "../assets/pattern"

// Add import for TabIndicator at the top of the file
import TabIndicator from "./TabIndicator"

// Update the ProfileScreen component to use the ThemeContext
// First, add the import for useTheme at the top of the file
import { useTheme } from "../theme/ThemeContext"
import { profile, updateProfile } from "../services/authed/main-service"
import apiConfig from "../utils/apiConfig"

const { width } = Dimensions.get("window")

// Define safe easing functions
const safeEasing = {
  linear: (t: number) => t,
  ease: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

// Componente Icon para evitar ciclos de require
const Icon = ({ family, name, size, color, style }) => {
  if (family === "Feather") {
    return <Feather name={name} size={size} color={color} style={style} />
  } else if (family === "MaterialIcons") {
    return <MaterialIcons name={name} size={size} color={color} style={style} />
  } else if (family === "FontAwesome5") {
    return <FontAwesome5 name={name} size={size} color={color} style={style} />
  } else if (family === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
  }

  // Fallback para família de ícones desconhecida
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

interface ProfileData {
  name: string;
  nif: string;
  phone_number: string;
  gender: string;
  username_traditional: string;
  email: string;
  profile_picture: string | null;
  address: string;
  birth_date: string;
  posts: number;
  ciclos: number;
}

const ProfileScreen = () => {
  // Get theme context
  const { isDark, primaryColor, culturalTheme, language, updateAppearance } = useTheme()

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO'); // Formato angolano ou ajuste conforme necessário
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState("account")

  // State for tabsWidth
  const [tabsWidth, setTabsWidth] = useState(width)

  // State for form values with more user details
  /* const [userProfile, setUserProfile] = useState({
    name: "Usuário KANDIMBA",
    email: "usuario@kandimba.com",
    birthDate: "15/05/1990",
    traditionalName: "Kandimba",
    phone: "+244 923 456 789",
    location: "Luanda, Angola",
    culturalTheme: culturalTheme, // Use value from context
    primaryColor: primaryColor, // Use value from context
    language: language, // Use value from context
    reminderTime: "3 dias antes",
  }) */

 /*  {renderInputField("Nome Completo", "name", profileData?.name || "", "user")}
  {renderInputField("Email", "email", profileData?.email || "", "mail", "email-address")}
  {renderInputField("Data de Nascimento", "birthDate", profileData?.birth_date ? formatDate(profileData.birth_date) : "", "calendar")}
  {renderInputField("Nome Tradicional", "traditionalName", profileData?.username_traditional || "", "feather")}
  {renderInputField("Telefone", "phone", profileData?.phone_number || "", "phone", "phone-pad")}
  {renderInputField("Localização", "location", profileData?.address || "", "map-pin")} */

  const renderAccountTab = () => (
  <View style={styles.tabContent}>
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
        <Icon family="Feather" name="user" size={20} color={userProfile.primaryColor} />
        <Text style={[styles.cardTitle, isDark && styles.textDark]}>Informações Pessoais</Text>
      </View>

      <View style={styles.cardContent}>
        {renderInputField("Nome Completo", "name", profileData?.name || "", "user")}
        {renderInputField("Email", "email", profileData?.email || "", "mail", "email-address")}
        {renderInputField("Data de Nascimento", "birthDate", profileData?.birth_date ? formatDate(profileData.birth_date) : "", "calendar")}
       {/*  {renderInputField("Nome Tradicional", "traditionalName", profileData?.username_traditional || "", "feather")} */}
      </View>
    </View>

    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
        <Icon family="Feather" name="map-pin" size={20} color={userProfile.primaryColor} />
        <Text style={[styles.cardTitle, isDark && styles.textDark]}>Informações de Contato</Text>
      </View>

      <View style={styles.cardContent}>
        {renderInputField("Telefone", "phone", profileData?.phone_number || "", "phone", "phone-pad")}
        {renderInputField("Localização", "location", profileData?.address || "", "map-pin")}
      </View>
    </View>

    {formModified && isEditing && (
      <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: userProfile.primaryColor }]}
          onPress={saveProfile}
        >
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </Animated.View>
    )}
  </View>
)

  // State for profile images
  const [profileImage, setProfileImage] = useState(null)
  const [coverImage, setCoverImage] = useState(patternImageUrl)
  //const [userProfile, setUserProfile] = useState(patternImageUrl)

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    birthDate: "",
    traditionalName: "",
    phone: "",
    location: "",
    profile_picture: null,
    primaryColor: mumuilaColors.orange, // Valor padrão laranja
    culturalTheme: "Padrão Mumuila", // Valor padrão
    language: "Português", // Valor padrão
  });

  const [isLoadingImage, setIsLoadingImage] = useState(false)

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false)

  // State to track if form has been modified
  const [formModified, setFormModified] = useState(false)

  // Estados para o modal de seleção de antecedência para lembretes
  const [modalVisible, setModalVisible] = useState(false)
  const [activeField, setActiveField] = useState("")
  const [activeOptions, setActiveOptions] = useState([])
  const reminderSelectScale = useRef(new Animated.Value(1)).current
  const modalOpacity = useRef(new Animated.Value(0)).current
  const slideAnimation = useRef(new Animated.Value(50)).K

  // State for notification settings
  const [notifications, setNotifications] = useState({
    menstruationReminder: true,
    fertilePeriod: true,
    medication: false,
    culturalTips: true,
    communityActivity: true,
    appUpdates: false,
  })

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current
  const profileScale = useRef(new Animated.Value(1)).current
  const editButtonRotate = useRef(new Animated.Value(0)).current
  const saveButtonScale = useRef(new Animated.Value(1)).current
  const languageScaleAnim = useRef(new Animated.Value(1)).current

  // Tab indicator animation
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current

  // Adicionar estados para o alerta personalizado após os outros estados
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'info', 'warning'
    actions: [],
    dismissable: true,
  })
  const alertScaleAnim = useRef(new Animated.Value(0.8)).current
  const alertOpacityAnim = useRef(new Animated.Value(0)).current

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(isDark)

  // Load saved profile data on mount
  /* useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfileImage = await AsyncStorage.getItem("profileImage")
        if (savedProfileImage) {
          setProfileImage(savedProfileImage)
        }

        const savedCoverImage = await AsyncStorage.getItem("coverImage")
        if (savedCoverImage) {
          setCoverImage(savedCoverImage)
        }

        const savedUserProfile = await AsyncStorage.getItem("userProfile")
        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile))
        }

        const savedIsDarkMode = await AsyncStorage.getItem("isDarkMode")
        if (savedIsDarkMode) {
          setIsDarkMode(savedIsDarkMode === "true")
        }

        const savedNotifications = await AsyncStorage.getItem("notifications")
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications))
        }
      } catch (error) {
        console.log("Error loading profile data:", error)
      }
    }

    loadProfileData()
  }, []) */

/*   useEffect(() => {
  const loadAllProfileData = async () => {
    try {
      // 1. Carregar do AsyncStorage
      const savedProfileImage = await AsyncStorage.getItem("profileImage");
      if (savedProfileImage) setProfileImage(savedProfileImage);

      const savedCoverImage = await AsyncStorage.getItem("coverImage");
      if (savedCoverImage) setCoverImage(savedCoverImage);

      const savedUserProfile = await AsyncStorage.getItem("userProfile");
      if (savedUserProfile) setUserProfile(JSON.parse(savedUserProfile));

      const savedIsDarkMode = await AsyncStorage.getItem("isDarkMode");
      if (savedIsDarkMode) setIsDarkMode(savedIsDarkMode === "true");

      const savedNotifications = await AsyncStorage.getItem("notifications");
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      // 2. Buscar dados atualizados da API
      const response = await profile(); // Chama seu service
      setProfileData(response.profile_data);

      // Atualiza userProfile com os dados da API
      setUserProfile(prev => ({
        ...prev,
        name: response.profile_data.name,
        email: response.profile_data.email,
        birthDate: formatDate(response.profile_data.birth_date),
        traditionalName: response.profile_data.username_traditional,
        phone: response.profile_data.phone_number,
        location: response.profile_data.address,
        profile_picture: response.profile_data.profile_picture,
      }));
      setProfileImage(userProfile.profile_picture)

    } catch (error) {
      console.log("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  loadAllProfileData();
}, []); */
useEffect(() => {
  const loadAllProfileData = async () => {
    try {
      setLoadingProfile(true);

      // 1. Buscar dados atualizados da API
      const response = await profile();
      const apiProfileData = response.profile_data;

      // 2. Montar URL completa da imagem se existir
      const fullProfileImageUrl = apiProfileData.profile_picture
        ? `${apiConfig.baseUrl}${apiProfileData.profile_picture}`
        : null;

      // 3. Carregar dados locais do AsyncStorage como fallback
      const savedProfileImage = await AsyncStorage.getItem("profileImage");
      const savedCoverImage = await AsyncStorage.getItem("coverImage");
      const savedUserProfile = await AsyncStorage.getItem("userProfile");
      const savedIsDarkMode = await AsyncStorage.getItem("isDarkMode");
      const savedNotifications = await AsyncStorage.getItem("notifications");

      // 4. Construir o estado inicial priorizando a API
      const initialUserProfile = {
        name: apiProfileData.name || (savedUserProfile ? JSON.parse(savedUserProfile).name : ""),
        email: apiProfileData.email || (savedUserProfile ? JSON.parse(savedUserProfile).email : ""),
        birthDate: apiProfileData.birth_date ? formatDate(apiProfileData.birth_date) : (savedUserProfile ? JSON.parse(savedUserProfile).birthDate : ""),
        traditionalName: apiProfileData.username_traditional || (savedUserProfile ? JSON.parse(savedUserProfile).traditionalName : ""),
        phone: apiProfileData.phone_number || (savedUserProfile ? JSON.parse(savedUserProfile).phone : ""),
        location: apiProfileData.address || (savedUserProfile ? JSON.parse(savedUserProfile).location : ""),
        profile_picture: fullProfileImageUrl || savedProfileImage || null,
        primaryColor: primaryColor || mumuilaColors.orange, // Mantém a cor do contexto
        culturalTheme: apiProfileData.culturalTheme || (savedUserProfile ? JSON.parse(savedUserProfile).culturalTheme : "Padrão Mumuila"),
        language: apiProfileData.language || (savedUserProfile ? JSON.parse(savedUserProfile).language : "Português"),
      };

      // 5. Atualizar os estados
      setUserProfile(initialUserProfile);
      setProfileData(apiProfileData);
      setProfileImage(fullProfileImageUrl || savedProfileImage || null);
      setCoverImage(savedCoverImage || patternImageUrl);
      setIsDarkMode(savedIsDarkMode ? savedIsDarkMode === "true" : isDark);
      setNotifications(savedNotifications ? JSON.parse(savedNotifications) : notifications);

    } catch (error) {
      console.log("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  loadAllProfileData();
}, [primaryColor]); // Remova primaryColor se não for necessário, ou adicione outras dependências relevantes

  // Save profile data when updated
  useEffect(() => {
    const saveProfileData = async () => {
      try {
        if (profileImage) {
          await AsyncStorage.setItem("profileImage", profileImage)
        }
        if (coverImage) {
          await AsyncStorage.setItem("coverImage", coverImage)
        }
        await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile))
        await AsyncStorage.setItem("isDarkMode", isDarkMode.toString())
        await AsyncStorage.setItem("notifications", JSON.stringify(notifications))
      } catch (error) {
        console.log("Error saving profile data:", error)
      }
    }

    // Only save when form is modified and saved
    if (!isEditing && formModified) {
      saveProfileData()
    }
  }, [isEditing, formModified, profileImage, coverImage, userProfile, isDarkMode, notifications])

  // Animation for switching tabs
  useEffect(() => {
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    // Animate tab indicator
    let position = 0
    if (activeTab === "appearance") position = 1
    else if (activeTab === "notifications") position = 2

    Animated.timing(tabIndicatorPosition, {
      toValue: position,
      duration: 300,
      useNativeDriver: true,
      // Use a simple easing function that's guaranteed to work
      easing: Platform.select({
        ios: Easing.bezier(0.25, 0.1, 0.25, 1),
        android: safeEasing.easeOut,
        default: safeEasing.easeOut,
      }),
    }).start()
  }, [activeTab])

  // Animation for edit button
  useEffect(() => {
    Animated.timing(editButtonRotate, {
      toValue: isEditing ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      // Use a simple easing function that's guaranteed to work
      easing: Platform.select({
        ios: Easing.bezier(0.42, 0, 0.58, 1),
        android: safeEasing.easeInOut,
        default: safeEasing.easeInOut,
      }),
    }).start()

    // Pulse animation when editing
    if (isEditing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(profileScale, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
            easing: safeEasing.ease,
          }),
          Animated.timing(profileScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: safeEasing.ease,
          }),
        ]),
      ).start()
    } else {
      // Reset scale when not editing
      Animated.timing(profileScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isEditing])

  // Animation for save button when form is modified
  useEffect(() => {
    let animationLoop = null

    if (formModified && isEditing) {
      // Create a safe animation sequence
      const pulseSequence = Animated.sequence([
        Animated.timing(saveButtonScale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(saveButtonScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])

      // Create the loop and store the reference
      animationLoop = Animated.loop(pulseSequence)
      animationLoop.start()
    } else {
      Animated.timing(saveButtonScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    // Clean up animation when component unmounts or effect reruns
    return () => {
      if (animationLoop) {
        animationLoop.stop()
      }
    }
  }, [formModified, isEditing])

  // Rotate animation for edit button
  const spin = editButtonRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Now find the toggleTheme function and replace it with:

  // Toggle dark mode
  const toggleTheme = () => {
    updateAppearance({ isDark: !isDark })
    setFormModified(true)
  }

  // Adicionar função para mostrar alerta personalizado
  const showCustomAlert = (config) => {
    setAlertConfig({
      ...config,
      actions: config.actions || [],
    })
    setAlertVisible(true)

    // Animar entrada do alerta
    Animated.parallel([
      Animated.timing(alertScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7)),
      }),
      Animated.timing(alertOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Adicionar função para esconder alerta personalizado
  const hideCustomAlert = () => {
    // Animar saída do alerta
    Animated.parallel([
      Animated.timing(alertScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(alertOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAlertVisible(false)
    })
  }

  // Substituir toggleEditMode para usar o alerta personalizado
  const toggleEditMode = () => {
    if (isEditing && formModified) {
      // Perguntar se deseja descartar alterações
      showCustomAlert({
        title: "Descartar alterações",
        message: "Você tem alterações não salvas. Deseja descartar essas alterações?",
        type: "warning",
        actions: [
          {
            text: "Cancelar",
            onPress: () => hideCustomAlert(),
            primary: false,
          },
          {
            text: "Descartar",
            onPress: () => {
              hideCustomAlert()
              setIsEditing(false)
              setFormModified(false)
            },
            primary: true,
            destructive: true,
          },
        ],
      })
    } else {
      // Alternar modo de edição
      const newEditingState = !isEditing
      setIsEditing(newEditingState)

      if (newEditingState) {
        // Se entrando no modo de edição, mostrar uma mensagem
        showCustomAlert({
          title: "Modo de Edição",
          message: "Agora você pode editar seu perfil. Toque nos campos para modificá-los.",
          type: "info",
          actions: [
            {
              text: "Entendi",
              onPress: () => hideCustomAlert(),
              primary: true,
            },
          ],
        })
      }
    }
  }

  // Find the handleInputChange function and modify it to update the global theme context when appearance settings change:

  // Handle form changes
  const handleInputChange = (field, value) => {
    setUserProfile({
      ...userProfile,
      [field]: value,
    })
    setFormModified(true)

    // Update global theme context for appearance settings
    if (field === "primaryColor" || field === "culturalTheme" || field === "language") {
      updateAppearance({ [field]: value })
    }
  }

  // Handle notification toggle
  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
    setFormModified(true)
  }

  // Find the saveProfile function and modify it to ensure appearance settings are saved:

  // Substituir a função saveProfile para usar o alerta personalizado
  /* const saveProfile = () => {
    // Mostrar alerta de salvamento
    showCustomAlert({
      title: "Salvando Perfil",
      message: "Aguarde enquanto salvamos suas alterações...",
      type: "info",
      dismissable: false,
    })

    console.log(profileData);
    // Simular um delay para indicar que está salvando
    setTimeout(() => {
      // Ensure appearance settings are updated in the global context
      updateAppearance({
        primaryColor: userProfile.primaryColor,
        culturalTheme: userProfile.culturalTheme,
        language: userProfile.language,
      })

      // Mostrar alerta de sucesso
      showCustomAlert({
        title: "Perfil Atualizado",
        message: "Suas informações foram atualizadas com sucesso!",
        type: "success",
        actions: [
          {
            text: "OK",
            onPress: () => {
              hideCustomAlert()
            },
            primary: true,
          },
        ],
      })
      setIsEditing(false)
      setFormModified(false)
      
    }, 1500)
  } */

/*     const saveProfile = async () => {
  try {
    showCustomAlert({
      title: "Salvando Perfil",
      message: "Aguarde enquanto salvamos suas alterações...",
      type: "info",
      dismissable: false,
    });

    const profileUpdateData = {
      name: userProfile.name,
      email: userProfile.email,
      phone_number: userProfile.phone,
      nif: profileData?.nif || "", 
      gender: profileData?.gender || "", 
      address: userProfile.location,
      birth_date: userProfile.birthDate, 
      password: userProfile.password || undefined,
    };

    const response = await updateProfile(profileUpdateData);

    showCustomAlert({
      title: "Perfil Atualizado",
      message: "Suas informações foram atualizadas com sucesso!",
      type: "success",
      actions: [
        {
          text: "OK",
          onPress: () => {
            hideCustomAlert();
            setProfileData((prev) => ({
              ...prev,
              name: userProfile.name,
              email: userProfile.email,
              phone_number: userProfile.phone,
              address: userProfile.location,
              birth_date: userProfile.birthDate,
            }));
          },
          primary: true,
        },
      ],
    });

    updateAppearance({
      primaryColor: userProfile.primaryColor,
      culturalTheme: userProfile.culturalTheme,
      language: userProfile.language,
    });

    setIsEditing(false);
    setFormModified(false);

  } catch (error) {
    let errorMessage = "Ocorreu um erro ao atualizar o perfil. Tente novamente.";

    if (error.response && error.response.status === 422) {
      const errors = error.response.data.errors;
      if (errors.name) errorMessage = "Erro: Nome é obrigatório!";
      else if (errors.phone_number) errorMessage = "Erro: Telefone é obrigatório!";
      else if (errors.nif) errorMessage = "Erro: NIF é obrigatório!";
      else if (errors.gender) errorMessage = "Erro: Gênero é obrigatório!";
      else if (errors.address) errorMessage = "Erro: Localização é obrigatória!";
      else if (errors.birth_date) errorMessage = "Erro: Data de nascimento é obrigatória!";
      else errorMessage = "Erro: Preencha todos os campos obrigatórios corretamente!";
    } else if (error.response && error.response.data.error) {
      errorMessage = `Erro no servidor: ${error.response.data.error}`;
    }

    showCustomAlert({
      title: "Erro",
      message: errorMessage,
      type: "error",
      actions: [
        {
          text: "OK",
          onPress: () => hideCustomAlert(),
          primary: true,
        },
      ],
    });
  }
}; */

const saveProfile = async () => {
  try {
    showCustomAlert({
      title: "Salvando Perfil",
      message: "Aguarde enquanto salvamos suas alterações...",
      type: "info",
      dismissable: false,
    });

    const profileUpdateData = {
      name: userProfile.name,
      email: userProfile.email,
      phone_number: userProfile.phone,
      nif: profileData?.nif || "",
      gender: profileData?.gender || "",
      address: userProfile.location,
      birth_date: userProfile.birthDate,
      password: userProfile.password || undefined,
    };

    // Enviar os dados e a imagem, se existir
    const response = await updateProfile(profileUpdateData, profileImage);

    // Atualizar o estado com a nova URL da imagem retornada pela API
    if (response.profile_picture) {
      const fullProfileImageUrl = `${apiConfig.baseUrl}${response.profile_picture}`;
      setProfileImage(fullProfileImageUrl);
      setUserProfile((prev) => ({
        ...prev,
        profile_picture: fullProfileImageUrl,
      }));
    }

    // Sincronizar o userProfile com os valores atuais, incluindo primaryColor
    setUserProfile((prev) => ({
      ...prev,
      name: profileUpdateData.name,
      email: profileUpdateData.email,
      phone: profileUpdateData.phone_number,
      location: profileUpdateData.address,
      birthDate: profileUpdateData.birth_date,
      primaryColor: primaryColor, // Garante que a cor atual do contexto seja mantida
    }));

    showCustomAlert({
      title: "Perfil Atualizado",
      message: "Suas informações foram atualizadas com sucesso!",
      type: "success",
      actions: [
        {
          text: "OK",
          onPress: () => {
            hideCustomAlert();
            setProfileData((prev) => ({
              ...prev,
              name: userProfile.name,
              email: userProfile.email,
              phone_number: userProfile.phone,
              address: userProfile.location,
              birth_date: userProfile.birthDate,
              profile_picture: response.profile_picture,
            }));
          },
          primary: true,
        },
      ],
    });

    // Atualizar o contexto global com as aparências
    updateAppearance({
      primaryColor: userProfile.primaryColor,
      culturalTheme: userProfile.culturalTheme,
      language: userProfile.language,
    });

    setIsEditing(false);
    setFormModified(false);

  } catch (error) {
    let errorMessage = "Ocorreu um erro ao atualizar o perfil. Tente novamente.";

    if (error.response && error.response.status === 422) {
      const errors = error.response.data.errors;
      if (errors.name) errorMessage = "Erro: Nome é obrigatório!";
      else if (errors.phone_number) errorMessage = "Erro: Telefone é obrigatório!";
      else if (errors.nif) errorMessage = "Erro: NIF é obrigatório!";
      else if (errors.gender) errorMessage = "Erro: Gênero é obrigatório!";
      else if (errors.address) errorMessage = "Erro: Localização é obrigatória!";
      else if (errors.birth_date) errorMessage = "Erro: Data de nascimento é obrigatória!";
      else if (errors.img) errorMessage = "Erro: Falha ao carregar a imagem!";
      else errorMessage = "Erro: Preencha todos os campos obrigatórios corretamente!";
    } else if (error.response && error.response.data.error) {
      errorMessage = `Erro no servidor: ${error.response.data.error}`;
    }

    showCustomAlert({
      title: "Erro",
      message: errorMessage,
      type: "error",
      actions: [
        {
          text: "OK",
          onPress: () => hideCustomAlert(),
          primary: true,
        },
      ],
    });
  }
};
  // Modificar a função pickProfileImage para usar o alerta personalizado
  const pickProfileImage = async () => {
    if (!isEditing) {
      // Se não estiver em modo de edição, ative o modo de edição primeiro
      setIsEditing(true)
      return
    }

    try {
      setIsLoadingImage(true)
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        showCustomAlert({
          title: "Permissão Necessária",
          message: "Precisamos de permissão para acessar sua galeria de fotos.",
          type: "warning",
          actions: [
            {
              text: "OK",
              onPress: () => hideCustomAlert(),
              primary: true,
            },
          ],
        })
        setIsLoadingImage(false)
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri)
        setFormModified(true)
      }
      setIsLoadingImage(false)
    } catch (error) {
      console.log("Error picking image:", error)
      showCustomAlert({
        title: "Erro",
        message: "Ocorreu um erro ao selecionar a imagem. Por favor, tente novamente.",
        type: "error",
        actions: [
          {
            text: "OK",
            onPress: () => hideCustomAlert(),
            primary: true,
          },
        ],
      })
      setIsLoadingImage(false)
    }
  }

  // Modificar a função pickCoverImage para usar o alerta personalizado
  const pickCoverImage = async () => {
    if (!isEditing) return

    try {
      setIsLoadingImage(true)
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        showCustomAlert({
          title: "Permissão Necessária",
          message: "Precisamos de permissão para acessar sua galeria de fotos.",
          type: "warning",
          actions: [
            {
              text: "OK",
              onPress: () => hideCustomAlert(),
              primary: true,
            },
          ],
        })
        setIsLoadingImage(false)
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCoverImage(result.assets[0].uri)
        setFormModified(true)
      }
      setIsLoadingImage(false)
    } catch (error) {
      console.log("Error picking cover image:", error)
      showCustomAlert({
        title: "Erro",
        message: "Ocorreu um erro ao selecionar a imagem de capa. Por favor, tente novamente.",
        type: "error",
        actions: [
          {
            text: "OK",
            onPress: () => hideCustomAlert(),
            primary: true,
          },
        ],
      })
      setIsLoadingImage(false)
    }
  }

  // Render input field with label
  const renderInputField = (label, field, placeholder, icon, keyboardType = "default", secureTextEntry = false) => {
    const currentValue = userProfile[field] || ""

    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, isDark && styles.labelDark]}>{label}</Text>
        <View
          style={[
            styles.textInputContainer,
            isEditing ? styles.inputEditable : styles.inputDisabled,
            isDark && styles.inputDark,
          ]}
        >
          <View style={styles.inputIconContainer}>
            <Icon
              family="Feather"
              name={icon}
              size={18}
              color={isEditing ? userProfile.primaryColor : isDark ? "#777777" : "#999999"}
            />
          </View>
          
          <TextInput
            style={[styles.input, isDark && styles.inputTextDark]}
            value={currentValue}
            onChangeText={(text) => handleInputChange(field, text)}
            placeholder={placeholder}
            placeholderTextColor={isDark ? "#777" : "#999"}
            editable={isEditing}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
          />
          {isEditing && (
            <TouchableOpacity
              style={styles.inputActionButton}
              onPress={() => {
                // Clear the field value if there's a value, otherwise do nothing
                if (currentValue.length > 0) {
                  handleInputChange(field, "")
                }
              }}
            >
              <Icon
                family="Feather"
                name={currentValue.length > 0 ? "x-circle" : "edit-2"}
                size={16}
                color={userProfile.primaryColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  // Render select field with label and options
  const renderSelectField = (label, field, options, disabled = !isEditing) => {
    const openModal = () => {
      if (disabled) return

      setActiveField(field)
      setActiveOptions(options)
      setModalVisible(true)
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }

    const closeModal = () => {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false)
      })
    }

    const selectOption = (option) => {
      handleInputChange(activeField, option)
      closeModal()
    }

    // Animação de pressionar
    const onPressIn = () => {
      if (disabled) return

      Animated.timing(reminderSelectScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }

    const onPressOut = () => {
      if (disabled) return

      Animated.timing(reminderSelectScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, isDark && styles.labelDark]}>{label}</Text>
        <Animated.View style={{ transform: [{ scale: reminderSelectScale }] }}>
          <TouchableOpacity
            style={[
              styles.selectInput,
              isEditing && !disabled ? styles.inputEditable : styles.inputDisabled,
              isDark && styles.inputDark,
            ]}
            disabled={disabled}
            onPress={openModal}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.9}
          >
            <View style={styles.selectTextContainer}>
              <View style={styles.reminderTimeIconContainer}>
                <Icon
                  family="Feather"
                  name="clock"
                  size={18}
                  color={isDark ? "#fff" : isEditing ? userProfile.primaryColor : "#999"}
                />
                <Text
                  style={[
                    styles.selectText,
                    isDark && styles.textDark,
                    isEditing && !disabled && { color: userProfile.primaryColor },
                  ]}
                >
                  {userProfile[field]}
                </Text>
              </View>
            </View>
            <Icon
              family="Feather"
              name="chevron-down"
              size={18}
              color={isDark ? "#fff" : isEditing ? userProfile.primaryColor : "#999"}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  // Render switch setting with improved design
  const renderSwitchSetting = (title, description, value, onValueChange, icon) => (
    <View
      style={[
        styles.switchContainer,
        isDark && styles.switchContainerDark,
        value && styles.switchContainerActive,
        value && isDark && styles.switchContainerActiveDark,
      ]}
    >
      <View style={styles.switchIconContainer}>
        <Icon
          family="Feather"
          name={icon}
          size={20}
          color={value ? userProfile.primaryColor : isDark ? "#777" : "#999"}
        />
      </View>
      <View style={styles.switchTextContainer}>
        <Text style={[styles.switchTitle, isDark && styles.textDark, value && { color: userProfile.primaryColor }]}>
          {title}
        </Text>
        <Text style={[styles.switchDescription, isDark && styles.descriptionDark]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: isDark ? "#444" : "#e0e0e0",
          true: `${userProfile.primaryColor}aa`,
        }}
        thumbColor={value ? userProfile.primaryColor : "#ffffff"}
        ios_backgroundColor={isDark ? "#333" : "#e0e0e0"}
      />
    </View>
  )

  // Render color option with improved design
  const renderColorOption = (color, name, isSelected) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: color }, isSelected && styles.colorOptionSelected]}
      onPress={() => {
        if (isEditing) {
          handleInputChange("primaryColor", color)
        } else if (!isSelected) {
          showCustomAlert({
            title: "Modo de Edição Necessário",
            message: "Ative o modo de edição para alterar a cor principal.",
            type: "info",
            actions: [
              {
                text: "OK",
                onPress: () => hideCustomAlert(),
                primary: true,
              },
            ],
          })
        }
      }}
    >
      {isSelected && (
        <View style={styles.colorSelectedCheck}>
          <Icon family="Feather" name="check" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  )

  // Render language option with improved design
  const renderLanguageOption = (language, nativeName, flagIcon, isSelected) => {
    return (
      <Animated.View
        style={[styles.languageOptionContainer, isSelected && { transform: [{ scale: languageScaleAnim }] }]}
      >
        <TouchableOpacity
          style={[
            styles.languageOption,
            isDark && styles.languageOptionDark,
            isSelected && styles.languageOptionSelected,
            isSelected && { borderColor: userProfile.primaryColor },
          ]}
          onPress={() => {
            if (isEditing) {
              Animated.sequence([
                Animated.timing(languageScaleAnim, {
                  toValue: 1.05,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(languageScaleAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start()

              handleInputChange("language", language)
            } else if (!isSelected) {
              showCustomAlert({
                title: "Modo de Edição Necessário",
                message: "Ative o modo de edição para alterar o idioma.",
                type: "info",
                actions: [
                  {
                    text: "OK",
                    onPress: () => hideCustomAlert(),
                    primary: true,
                  },
                ],
              })
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.languageFlagContainer}>
            <Text style={styles.languageFlag}>{flagIcon}</Text>
          </View>

          <View style={styles.languageTextContainer}>
            <Text
              style={[
                styles.languageName,
                isDark && styles.textDark,
                isSelected && { color: userProfile.primaryColor, fontWeight: "bold" },
              ]}
            >
              {language}
            </Text>
            <Text style={[styles.languageNativeName, isDark && styles.descriptionDark]}>{nativeName}</Text>
          </View>

          {isSelected && (
            <View style={[styles.languageSelectedIndicator, { backgroundColor: userProfile.primaryColor }]}>
              <Icon family="Feather" name="check" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const initialTheme = {
  isDark: false,
  primaryColor: mumuilaColors.orange,
  culturalTheme: "Padrão Mumuila",
  language: "Português",
  updateAppearance: () => {},
};

  // Render cultural theme with improved design
  const renderCulturalThemeOption = (name, description, isSelected, imageSource) => {
    // Simplified description for better UI
    const shortDescription = description.length > 60 ? description.substring(0, 60) + "..." : description

    return (
      <TouchableOpacity
        style={[
          styles.culturalThemeOption,
          isSelected && styles.culturalThemeOptionSelected,
          isDark && styles.culturalThemeOptionDark,
        ]}
        onPress={() => {
          if (isEditing) {
            handleInputChange("culturalTheme", name)
          } else if (!isSelected) {
            showCustomAlert({
              title: "Modo de Edição Necessário",
              message: "Ative o modo de edição para alterar o tema cultural.",
              type: "info",
              actions: [
                {
                  text: "OK",
                  onPress: () => hideCustomAlert(),
                  primary: true,
                },
              ],
            })
          }
        }}
      >
        <View style={styles.culturalThemeImageContainer}>
          <Image
            source={imageSource}
            style={[styles.culturalThemeImage, isSelected && styles.culturalThemeImageSelected]}
            resizeMode="cover"
          />
          {isSelected && (
            <View style={[styles.culturalThemeSelectedIndicator, { backgroundColor: userProfile.primaryColor }]}>
              <Icon family="Feather" name="check" size={16} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.culturalThemeTextContainer}>
          <Text
            style={[
              styles.culturalThemeName,
              isSelected && { color: userProfile.primaryColor },
              isDark && styles.textDark,
            ]}
          >
            {name}
          </Text>
          <Text style={[styles.culturalThemeDescription, isDark && styles.descriptionDark]} numberOfLines={2}>
            {shortDescription}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.culturalThemeInfoButton}
          onPress={() => {
            showCustomAlert({
              title: name,
              message: description,
              type: "info",
              actions: [
                {
                  text: "OK",
                  onPress: () => hideCustomAlert(),
                  primary: true,
                },
              ],
            })
          }}
        >
          <Icon family="Feather" name="info" size={18} color={isDark ? "#777" : "#999"} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  // Render account tab content with improved organization
 /*  const renderAccountTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="user" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Informações Pessoais</Text>
        </View>

        <View style={styles.cardContent}>
          {renderInputField("Nome Completo", "name", "Digite seu nome", "user")}
          {renderInputField("Email", "email", "Digite seu email", "mail", "email-address")}
          {renderInputField("Data de Nascimento", "birthDate", "DD/MM/AAAA", "calendar")}
          {renderInputField("Nome Tradicional", "traditionalName", "Ex: Kandimba", "feather")}
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="map-pin" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Informações de Contato</Text>
        </View>

        <View style={styles.cardContent}>
          {renderInputField("Telefone", "phone", "+244 9XX XXX XXX", "phone", "phone-pad")}
          {renderInputField("Localização", "location", "Luanda, Angola", "map-pin")}
        </View>
      </View>

      {formModified && isEditing && (
        <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: userProfile.primaryColor }]}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  ) */

  // Render appearance tab with improved organization and interaction
  const renderAppearanceTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name={isDark ? "moon" : "sun"} size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Tema da Interface</Text>
        </View>

        <View style={styles.cardContent}>
          <View
            style={[
              styles.themeContainer,
              isDark && styles.themeContainerDark,
              { borderColor: userProfile.primaryColor },
            ]}
          >
            <View style={styles.themeTextContainer}>
              <Icon family="Feather" name={isDark ? "moon" : "sun"} size={24} color={userProfile.primaryColor} />
              <View style={styles.themeTextWrapper}>
                <Text style={[styles.themeTitle, isDark && styles.textDark]}>
                  {isDark ? "Modo Escuro" : "Modo Claro"}
                </Text>
                <Text style={[styles.themeSubtitle, isDark && styles.descriptionDark]}>
                  {isDark ? "Interface escura, ideal para uso noturno" : "Interface clara, ideal para uso diurno"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#e0e0e0",
                true: `${userProfile.primaryColor}aa`,
              }}
              thumbColor={isDark ? userProfile.primaryColor : "#ffffff"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="droplet" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Cor Principal</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.colorDescription, isDark && styles.descriptionDark]}>
            Escolha a cor que será aplicada aos elementos principais do aplicativo
          </Text>

          <View style={styles.colorOptionsContainer}>
            {renderColorOption(mumuilaColors.red, "Vermelho", userProfile.primaryColor === mumuilaColors.red)}
            {renderColorOption(mumuilaColors.orange, "Laranja", userProfile.primaryColor === mumuilaColors.orange)}
            {renderColorOption("#3B82F6", "Azul", userProfile.primaryColor === "#3B82F6")}
            {renderColorOption("#10B981", "Verde", userProfile.primaryColor === "#10B981")}
            {renderColorOption("#8B5CF6", "Roxo", userProfile.primaryColor === "#8B5CF6")}
          </View>

          <View style={[styles.colorPreviewContainer, isDark && styles.colorPreviewContainerDark]}>
            <Text style={[styles.colorPreviewText, isDark && styles.textDark]}>Pré-visualização:</Text>
            <View style={styles.colorPreviewElements}>
              <TouchableOpacity style={[styles.colorPreviewButton, { backgroundColor: userProfile.primaryColor }]}>
                <Text style={styles.colorPreviewButtonText}>Botão</Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.colorPreviewBadge,
                  {
                    backgroundColor: `${userProfile.primaryColor}20`,
                    borderColor: userProfile.primaryColor,
                  },
                ]}
              >
                <Text style={[styles.colorPreviewBadgeText, { color: userProfile.primaryColor }]}>Indicador</Text>
              </View>

              <View style={[styles.colorPreviewIcon, { backgroundColor: userProfile.primaryColor }]}>
                <Icon family="Feather" name="star" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="layout" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Tema Cultural</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.culturalThemeContainer}>
            {renderCulturalThemeOption(
              "Padrão Mumuila",
              "Inspirado nas tradições e cores vibrantes das mulheres Mumuilas do sul de Angola.",
              userProfile.culturalTheme === "Padrão Mumuila",
              require("../assets/theme-mumuila.jpg"),
            )}
            {renderCulturalThemeOption(
              "Tecido da Ilha",
              "Baseado nos padrões dos tecidos tradicionais das mamãs da ilha de Luanda.",
              userProfile.culturalTheme === "Tecido da Ilha",
              require("../assets/theme-ilha.png"),
            )}
            {renderCulturalThemeOption(
              "Baobá",
              "Inspirado na árvore sagrada de Angola, símbolo de força e resistência.",
              userProfile.culturalTheme === "Baobá",
              require("../assets/theme-baoba.jpg"),
            )}
            {renderCulturalThemeOption(
              "Moderno",
              "Um design contemporâneo que combina elementos modernos com toques culturais sutis.",
              userProfile.culturalTheme === "Moderno",
              require("../assets/theme-moderno.jpg"),
            )}
          </View>
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="globe" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Idioma</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.languageDescription, isDark && styles.descriptionDark]}>
            Selecione o idioma principal do aplicativo
          </Text>

          <View style={styles.languageOptionsGrid}>
            {renderLanguageOption("Português", "Português de Angola", "🇦🇴", userProfile.language === "Português")}
            {renderLanguageOption("English", "English", "🇬🇧", userProfile.language === "English")}
            {renderLanguageOption("Kimbundu", "Kimbundu", "🇦🇴", userProfile.language === "Kimbundu")}
            {renderLanguageOption("Umbundu", "Umbundu", "🇦🇴", userProfile.language === "Umbundu")}
          </View>

          {isEditing && (
            <View style={styles.languageNotice}>
              <Icon
                family="Feather"
                name="info"
                size={16}
                color={userProfile.primaryColor}
                style={styles.languageNoticeIcon}
              />
              <Text style={[styles.languageNoticeText, isDark && styles.descriptionDark]}>
                Algumas alterações podem exigir reiniciar o aplicativo para serem aplicadas completamente.
              </Text>
            </View>
          )}

          <View style={[styles.languagePreviewContainer, isDark && styles.languagePreviewContainerDark]}>
            <Text style={[styles.languagePreviewTitle, isDark && styles.textDark]}>Exemplo no idioma selecionado:</Text>

            <View style={[styles.languagePreviewCard, isDark && styles.languagePreviewCardDark]}>
              <View style={styles.languagePreviewHeader}>
                <Icon family="Feather" name="globe" size={18} color={userProfile.primaryColor} />
                <Text style={[styles.languagePreviewHeaderText, { color: userProfile.primaryColor }]}>
                  {userProfile.language === "Português"
                    ? "Exemplo de Texto"
                    : userProfile.language === "English"
                      ? "Text Example"
                      : userProfile.language === "Kimbundu"
                        ? "Mukanda Kwenda"
                        : userProfile.language === "Umbundu"
                          ? "Ondaka Yokulikisa"
                          : "Exemplo de Texto"}
                </Text>
              </View>

              <Text style={[styles.languagePreviewContent, isDark && styles.textDark]}>
                {userProfile.language === "Português"
                  ? "Olá! Como você está hoje? Este é um exemplo de como o texto aparecerá no idioma selecionado."
                  : userProfile.language === "English"
                    ? "Hello! How are you today? This is an example of how text will appear in the selected language."
                    : userProfile.language === "Kimbundu"
                      ? "Kiambote! Wala kiambote lelu? Kiki mukanda wa kumonika mu kimbundu."
                      : userProfile.language === "Umbundu"
                        ? "Okuliwa! Ove uli vi lelo? Ndika ondaka yokulikisa mu umbundu."
                        : "Olá! Como você está hoje? Este é um exemplo de como o texto aparecerá no idioma selecionado."}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {formModified && isEditing && (
        <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: userProfile.primaryColor }]}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
    </View>
  )

  // Render notifications tab with improved organization and error fixes
  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="bell" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Ciclo Menstrual</Text>
        </View>

        <View style={styles.cardContent}>
          {renderSwitchSetting(
            "Lembrete de Menstruação",
            "Receba um aviso antes do início previsto da menstruação",
            notifications.menstruationReminder,
            () => toggleNotification("menstruationReminder"),
            "calendar",
          )}

          {renderSwitchSetting(
            "Alerta de Período Fértil",
            "Seja notificada quando estiver no seu período fértil",
            notifications.fertilePeriod,
            () => toggleNotification("fertilePeriod"),
            "activity",
          )}

          {renderSelectField("Antecedência para Lembretes", "reminderTime", [
            "1 dia antes",
            "2 dias antes",
            "3 dias antes",
            "5 dias antes",
            "7 dias antes",
          ])}
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="heart" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Saúde e Bem-estar</Text>
        </View>

        <View style={styles.cardContent}>
          {renderSwitchSetting(
            "Lembretes de Medicação",
            "Receba lembretes para tomar medicamentos",
            notifications.medication,
            () => toggleNotification("medication"),
            "thermometer",
          )}

          {renderSwitchSetting(
            "Dicas Culturais",
            "Receba dicas baseadas na sabedoria tradicional angolana",
            notifications.culturalTips,
            () => toggleNotification("culturalTips"),
            "book-open",
          )}
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.cardHeader, { borderBottomColor: isDark ? "#333" : "#f0f0f0" }]}>
          <Icon family="Feather" name="users" size={20} color={userProfile.primaryColor} />
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Comunidade e Aplicativo</Text>
        </View>

        <View style={styles.cardContent}>
          {renderSwitchSetting(
            "Atividade da Comunidade",
            "Receba notificações sobre novos posts e comentários",
            notifications.communityActivity,
            () => toggleNotification("communityActivity"),
            "message-circle",
          )}

          {renderSwitchSetting(
            "Atualizações do Aplicativo",
            "Seja notificada sobre novas funcionalidades e atualizações",
            notifications.appUpdates,
            () => toggleNotification("appUpdates"),
            "download",
          )}
        </View>
      </View>

      {formModified && isEditing && (
        <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: userProfile.primaryColor }]}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )

  // Utility function to get active tab index
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "account":
        return 0
      case "appearance":
        return 1
      case "notifications":
        return 2
      default:
        return 0
    }
  }

  // Modal para seleção de opções
  const renderSelectionModal = () => {
    if (!modalVisible) return null

    return (
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => {
            Animated.parallel([
              Animated.timing(modalOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(slideAnimation, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setModalVisible(false)
            })
          }}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            isDark && styles.modalContainerDark,
            {
              opacity: modalOpacity,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              {activeField === "reminderTime" ? "Antecedência para Lembretes" : "Selecione uma opção"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Animated.parallel([
                  Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                  Animated.timing(slideAnimation, {
                    toValue: 50,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                ]).start(() => {
                  setModalVisible(false)
                })
              }}
              style={styles.modalCloseButton}
            >
              <Icon family="Feather" name="x" size={20} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContent, isDark && { borderTopColor: "#444" }]}>
            {activeOptions.map((option, index) => {
              const isSelected = userProfile[activeField] === option
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemSelected,
                    isSelected && { backgroundColor: `${userProfile.primaryColor}15` },
                    index === activeOptions.length - 1 && { borderBottomWidth: 0 },
                    isDark && { borderBottomColor: "#444" },
                  ]}
                  onPress={() => {
                    handleInputChange(activeField, option)
                    Animated.parallel([
                      Animated.timing(modalOpacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                      Animated.timing(slideAnimation, {
                        toValue: 50,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                    ]).start(() => {
                      setModalVisible(false)
                    })
                  }}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionIconContainer}>
                      <Icon
                        family="Feather"
                        name={
                          option === "1 dia antes"
                            ? "clock"
                            : option === "2 dias antes"
                              ? "calendar"
                              : option === "3 dias antes"
                                ? "calendar"
                                : option === "5 dias antes"
                                  ? "calendar-plus"
                                  : "calendar-plus"
                        }
                        size={20}
                        color={isSelected ? userProfile.primaryColor : isDark ? "#aaa" : "#666"}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && { color: userProfile.primaryColor, fontWeight: "600" },
                          isDark && { color: isSelected ? userProfile.primaryColor : "#fff" },
                        ]}
                      >
                        {option}
                      </Text>
                      <Text style={[styles.optionDescription, isDark && { color: "#aaa" }]}>
                        {option === "1 dia antes"
                          ? "Lembrete no dia anterior"
                          : option === "2 dias antes"
                            ? "Lembrete dois dias antes"
                            : option === "3 dias antes"
                              ? "Lembrete três dias antes"
                              : option === "5 dias antes"
                                ? "Lembrete cinco dias antes"
                                : "Lembrete uma semana antes"}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={[styles.selectedCheckmark, { backgroundColor: userProfile.primaryColor }]}>
                      <Icon family="Feather" name="check" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: userProfile.primaryColor }]}
            onPress={() => {
              Animated.parallel([
                Animated.timing(modalOpacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(slideAnimation, {
                  toValue: 50,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                setModalVisible(false)
              })
            }}
          >
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  // Renderizar o alerta personalizado
  const renderCustomAlert = () => {
    if (!alertVisible) return null

    return (
      <View style={styles.alertOverlay}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (alertConfig.dismissable) {
              hideCustomAlert()
            }
          }}
        >
          <View style={styles.alertBackdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.alertContainer,
            isDark && styles.alertContainerDark,
            {
              opacity: alertOpacityAnim,
              transform: [{ scale: alertScaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.alertIconContainer,
              alertConfig.type === "success"
                ? styles.alertSuccessIconContainer
                : alertConfig.type === "error"
                  ? styles.alertErrorIconContainer
                  : alertConfig.type === "warning"
                    ? styles.alertWarningIconContainer
                    : { backgroundColor: userProfile.primaryColor },
            ]}
          >
            <Icon
              family="Feather"
              name={
                alertConfig.type === "success"
                  ? "check-circle"
                  : alertConfig.type === "error"
                    ? "alert-circle"
                    : alertConfig.type === "warning"
                      ? "alert-triangle"
                      : "info"
              }
              size={28}
              color="#fff"
            />
          </View>

          <Text style={[styles.alertTitle, isDark && styles.alertTitleDark]}>{alertConfig.title}</Text>

          <Text style={[styles.alertMessage, isDark && styles.alertMessageDark]}>{alertConfig.message}</Text>

          {alertConfig.type === "info" && !alertConfig.actions.length && (
            <ActivityIndicator size="large" color={userProfile.primaryColor} style={styles.alertLoader} />
          )}

          {alertConfig.actions.length > 0 && (
            <View style={[styles.alertActions, alertConfig.actions.length > 1 && styles.alertActionsMultiple]}>
              {alertConfig.actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alertButton,
                    action.primary && styles.alertButtonPrimary,
                    action.primary && { backgroundColor: userProfile.primaryColor },
                    action.destructive && styles.alertButtonDestructive,
                    alertConfig.actions.length > 1 && styles.alertButtonMultiple,
                  ]}
                  onPress={action.onPress}
                >
                  <Text
                    style={[
                      styles.alertButtonText,
                      action.primary && styles.alertButtonTextPrimary,
                      action.destructive && styles.alertButtonTextDestructive,
                    ]}
                  >
                    {action.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      {renderSelectionModal()}
      {renderCustomAlert()}

      {/* Edit Mode Indicator */}
      {isEditing && (
        <View style={[styles.editModeIndicator, { backgroundColor: userProfile.primaryColor }]}>
          <Icon family="Feather" name="edit-2" size={16} color="#fff" style={styles.editModeIcon} />
          <Text style={styles.editModeText}>Modo de Edição</Text>
        </View>
      )}

      {/* Profile Header with Cover Photo */}
      <View style={styles.profileHeaderContainer}>
        {/* Cover Photo */}
        <TouchableOpacity
          style={styles.coverPhotoContainer}
          onPress={pickCoverImage}
          activeOpacity={isEditing ? 0.7 : 1}
        >
          <Image source={{ uri: coverImage }} style={styles.coverPhoto} resizeMode="cover" />
          {isEditing && (
            <View style={styles.editCoverOverlay}>
              {isLoadingImage ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <>
                  <Icon family="Feather" name="camera" size={24} color="#fff" />
                  <Text style={styles.editCoverText}>Alterar capa</Text>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={pickProfileImage}
              activeOpacity={isEditing ? 0.7 : 1}
              style={styles.profileImageTouchable}
            >
              <Animated.View style={{ transform: [{ scale: profileScale }] }}>
                <View style={[styles.avatar, { borderColor: userProfile.primaryColor }]}>
                  {isLoadingImage ? (
                    <ActivityIndicator size="large" color={userProfile.primaryColor} />
                  ) : profileImage ? (
                    <Image  source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Icon family="Feather" name="user" size={50} color="#fff" />
                  )}

                  {isEditing && !isLoadingImage && (
                    <View style={styles.changePhotoOverlay}>
                      <Icon family="Feather" name="camera" size={20} color="#fff" />
                      <Text style={styles.changePhotoText}>Alterar</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: userProfile.primaryColor }]}
              onPress={toggleEditMode}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Icon family="Feather" name={isEditing ? "check" : "edit-2"} size={16} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isDark && styles.textDark, { color: isDark ? "#fff" : "#333" }]}>
              {userProfile.name}
            </Text>
            <Text style={[styles.profileEmail, isDark && styles.descriptionDark]}>{userProfile.email}</Text>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: userProfile.primaryColor }]}>{profileData?.posts || 0}</Text>
              <Text style={[styles.statLabel, isDark && styles.descriptionDark]}>Posts</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: isDark ? "#333" : "#eee" }]} />

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: userProfile.primaryColor }]}>{profileData?.ciclos || 0}</Text>
              <Text style={[styles.statLabel, isDark && styles.descriptionDark]}>Ciclos</Text>
            </View>

           {/*  <View style={[styles.statDivider, { backgroundColor: isDark ? "#333" : "#eee" }]} /> */}

            {/* <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: userProfile.primaryColor }]}>6</Text>
              <Text style={[styles.statLabel, isDark && styles.descriptionDark]}>Meses</Text>
            </View> */}
          </View>

          {/* <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: `${userProfile.primaryColor}20`,
                  borderColor: userProfile.primaryColor,
                },
              ]}
            >
              <Icon family="Feather" name="award" size={12} color={userProfile.primaryColor} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, { color: userProfile.primaryColor }]}>Desde 2023</Text>
            </View>
          </View> */}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, isDark && styles.tabsContainerDark]}>
        <View
          style={[styles.tabsHeader, isDark && styles.tabsHeaderDark]}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout
            setTabsWidth(width)
          }}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "account" && styles.activeTab]}
            onPress={() => setActiveTab("account")}
          >
            <Icon
              family="Feather"
              name="user"
              size={16}
              color={activeTab === "account" ? (isDark ? "#fff" : userProfile.primaryColor) : isDark ? "#aaa" : "#666"}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "account" && styles.activeTabText,
                isDark && styles.tabTextDark,
                activeTab === "account" && isDark && styles.activeTabTextDark,
                activeTab === "account" && { color: userProfile.primaryColor },
              ]}
            >
              Conta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "appearance" && styles.activeTab]}
            onPress={() => setActiveTab("appearance")}
          >
            <Icon
              family="Feather"
              name={isDark ? "moon" : "sun"}
              size={16}
              color={
                activeTab === "appearance" ? (isDark ? "#fff" : userProfile.primaryColor) : isDark ? "#aaa" : "#666"
              }
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "appearance" && styles.activeTabText,
                isDark && styles.tabTextDark,
                activeTab === "appearance" && isDark && styles.activeTabTextDark,
                activeTab === "appearance" && { color: userProfile.primaryColor },
              ]}
            >
              Aparência
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "notifications" && styles.activeTab]}
            onPress={() => setActiveTab("notifications")}
          >
            <Icon
              family="Feather"
              name="bell"
              size={16}
              color={
                activeTab === "notifications" ? (isDark ? "#fff" : userProfile.primaryColor) : isDark ? "#aaa" : "#666"
              }
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "notifications" && styles.activeTabText,
                isDark && styles.tabTextDark,
                activeTab === "notifications" && isDark && styles.activeTabTextDark,
                activeTab === "notifications" && { color: userProfile.primaryColor },
              ]}
            >
              Notificações
            </Text>
          </TouchableOpacity>

          {/* Use TabIndicator component */}
          <TabIndicator
            activeTabIndex={getActiveTabIndex()}
            tabCount={3}
            containerWidth={tabsWidth}
            isDark={isDark}
            activeColor={userProfile.primaryColor}
          />
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {activeTab === "account" && renderAccountTab()}
          {activeTab === "appearance" && renderAppearanceTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
        </Animated.View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  // Edit Mode Indicator
  editModeIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: mumuilaColors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  editModeIcon: {
    marginRight: 6,
  },
  editModeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Profile Header
  profileHeaderContainer: {
    position: "relative",
  },
  coverPhotoContainer: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  editCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editCoverText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
    marginTop: -60,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImageTouchable: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: mumuilaColors.black,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: "hidden",
  },
  /* avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  }, */
  avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60, // Para manter circular
      resizeMode: 'cover', // Ou 'contain' conforme necessidade
      overflow: 'hidden', // Importante para o borderRadius funcionar
      // Garantir que a imagem não ultrapasse os limites
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
  },
  changePhotoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: mumuilaColors.orange,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // New profile stats
  profileStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: mumuilaColors.orange,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: `rgba(247, 163, 37, 0.1)`,
    borderWidth: 1,
    borderColor: mumuilaColors.orange,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: {
    marginRight: 5,
  },
  badgeText: {
    fontSize: 12,
    color: mumuilaColors.orange,
    fontWeight: "500",
  },
  // Tabs
  tabsContainer: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  tabsContainerDark: {
    backgroundColor: "#121212",
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 4,
    position: "relative",
    marginBottom: 20,
  },
  tabsHeaderDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  tabIcon: {
    marginRight: 6,
  },
  activeTab: {
    // Active styling handled by the indicator
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabTextDark: {
    color: "#aaa",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  activeTabTextDark: {
    color: "#fff",
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  cardContent: {
    padding: 16,
  },
  // Input Fields
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  labelDark: {
    color: "#ddd",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  inputIconContainer: {
    marginRight: 10,
  },
  inputActionButton: {
    padding: 5,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#333",
  },
  inputTextDark: {
    color: "#fff",
  },
  inputDark: {
    color: "#fff",
    borderColor: "#444",
    backgroundColor: "#333",
  },
  inputEditable: {
    borderColor: mumuilaColors.orange,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    color: "#666",
  },
  selectInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectTextContainer: {
    flex: 1,
  },
  selectText: {
    fontSize: 15,
    color: "#333",
  },
  // Text Styles
  textDark: {
    color: "#fff",
  },
  descriptionDark: {
    color: "#aaa",
  },
  // Save Button
  saveButton: {
    backgroundColor: mumuilaColors.orange,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Theme Container
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  themeContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  themeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeTextWrapper: {
    marginLeft: 12,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  themeSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  // Color Options
  colorOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  colorSelectedCheck: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  colorDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  // Color Preview
  colorPreviewContainer: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
  },
  colorPreviewContainerDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  colorPreviewText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  colorPreviewElements: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorPreviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colorPreviewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  colorPreviewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  colorPreviewBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  colorPreviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  // Switch Settings
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  switchContainerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  switchContainerActive: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderLeftWidth: 3,
    borderLeftColor: mumuilaColors.orange,
  },
  switchContainerActiveDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  switchIconContainer: {
    marginRight: 12,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  switchDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  // Cultural Theme
  culturalThemeContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  culturalThemeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  culturalThemeOptionDark: {
    backgroundColor: "#333",
    borderColor: "#444",
  },
  culturalThemeOptionSelected: {
    borderColor: mumuilaColors.orange,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  culturalThemeImageContainer: {
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  culturalThemeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f0f0f0", // Placeholder color
  },
  culturalThemeImageSelected: {
    borderWidth: 2,
    borderColor: mumuilaColors.orange,
  },
  culturalThemeSelectedIndicator: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: mumuilaColors.orange,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  culturalThemeTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  culturalThemeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  culturalThemeInfoButton: {
    padding: 6,
  },
  culturalThemeDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  // Language Options - New Styles
  languageDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  languageOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  languageOptionContainer: {
    width: "48%",
    marginBottom: 12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    height: 80,
  },
  languageOptionDark: {
    backgroundColor: "#333",
    borderColor: "#444",
  },
  languageOptionSelected: {
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  languageFlagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  languageNativeName: {
    fontSize: 12,
    color: "#666",
  },
  languageSelectedIndicator: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: mumuilaColors.orange,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  languageNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  languageNoticeIcon: {
    marginRight: 8,
  },
  languageNoticeText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  // Language Preview
  languagePreviewContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  languagePreviewContainerDark: {
    opacity: 0.9,
  },
  languagePreviewTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  languagePreviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languagePreviewCardDark: {
    backgroundColor: "#333",
    borderColor: "#444",
  },
  languagePreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languagePreviewHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  languagePreviewContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 16,
  },
  languagePreviewFooter: {
    alignItems: "flex-end",
  },
  languagePreviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  languagePreviewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  // Notification Groups
  notificationGroup: {
    marginBottom: 20,
  },
  notificationGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    paddingLeft: 4,
  },
  // Modal de seleção
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: "80%",
  },
  modalContainerDark: {
    backgroundColor: "#222",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    padding: 5,
  },
  modalContent: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionItemSelected: {
    borderRadius: 8,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  selectedCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: mumuilaColors.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: mumuilaColors.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reminderTimeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
  },
  // Alerta personalizado
  alertOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  alertBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  alertContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    maxWidth: 400,
  },
  alertContainerDark: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
  },
  alertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  alertSuccessIconContainer: {
    backgroundColor: "#10B981", // Verde
  },
  alertErrorIconContainer: {
    backgroundColor: "#EF4444", // Vermelho
  },
  alertWarningIconContainer: {
    backgroundColor: "#F59E0B", // Laranja
  },
  alertInfoIconContainer: {
    backgroundColor: mumuilaColors.orange,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  alertTitleDark: {
    color: "#fff",
  },
  alertMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  alertMessageDark: {
    color: "#aaa",
  },
  alertLoader: {
    marginVertical: 10,
  },
  alertActions: {
    width: "100%",
    marginTop: 10,
  },
  alertActionsMultiple: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  alertButtonPrimary: {
    backgroundColor: mumuilaColors.orange,
  },
  alertButtonDestructive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  alertButtonMultiple: {
    flex: 1,
    marginHorizontal: 5,
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  alertButtonTextPrimary: {
    color: "#fff",
  },
  alertButtonTextDestructive: {
    color: "#EF4444",
  },
})

export default ProfileScreen
