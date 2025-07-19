"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Platform,
  TextInput,
} from "react-native"

import * as Notifications from 'expo-notifications';

// Import SVG components
import Svg, { Circle, G } from "react-native-svg"

// Import the Icon component from App.tsx
import { Icon } from "../App"

// Import theme context
import { useTheme } from "../theme/ThemeContext"

import { getHomeData, record_daily_mood } from '../services/authed/main-service';

const { width } = Dimensions.get("window")

// Mock data for cycle tracking - com datas reais
const cycleData = {
  currentCycle: {
    startDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000), // 14 dias atrás
    length: 28, // Duração total do ciclo em dias
    periodDays: 5, // Duração da menstruação em dias
  },
  // Calculado dinamicamente com base na data de início e duração do ciclo
  get nextPeriod() {
    const nextPeriodDate = new Date(this.currentCycle.startDate)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + this.currentCycle.length)
    return nextPeriodDate
  },
  // Janela fértil calculada dinamicamente (geralmente dias 10-16 de um ciclo de 28 dias)
  get fertileWindow() {
    const fertileStart = new Date(this.currentCycle.startDate)
    fertileStart.setDate(fertileStart.getDate() + 10) // Começa aproximadamente no dia 10

    const fertileEnd = new Date(this.currentCycle.startDate)
    fertileEnd.setDate(fertileEnd.getDate() + 16) // Termina aproximadamente no dia 16

    return {
      start: fertileStart,
      end: fertileEnd,
      // Dia da ovulação (geralmente dia 14 de um ciclo de 28 dias)
      ovulation: new Date(new Date(this.currentCycle.startDate).setDate(this.currentCycle.startDate.getDate() + 14)),
    }
  },
}

// Format date to dd/mm
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${day}/${month}`
}

// Calculate days difference between two dates
const daysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Get current day of the week and date in Portuguese
const getCurrentDateFormatted = () => {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const now = new Date()
  const dayOfWeek = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]

  return `${dayOfWeek}, ${day} de ${month}`
}

interface HomeData {
  second_username: string;
  username_traditional: string;
 // username_suffix: number,
  notifications_count: number;
  menstrual_cycle: {
    dia_ovulacao: number;
    ovulacao: string;
    dias_passados_desde_inicio: number;
  };
  proxima_menstruacao: string;
  fertile_period: {
    inicio_periodo_fertil: string;
    fim_periodo_fertil: string;
  };
  ancestral_tip_random: {
    id: number;
    titulo: string;
    conteudo: string;
    fonte: string | null;
    idioma: string;
  }[];
  types_symptoms: {
    id: number;
    tipo: string;
  }[];
  reminder: {
    message: string;
  };
}


/* Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
}); */


const HomeScreen = () => {

  

  // Get theme context
  const { isDark, primaryColor, colors } = useTheme()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const notificationAnim = useRef(new Animated.Value(-100)).current
  const circleProgress = useRef(new Animated.Value(0)).current
  const tipFadeAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const waveAnim = useRef(new Animated.Value(0)).current

  // State for selected mood and symptoms
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const[currentCycleDay, setCurrentCycleDay] = useState(null);

  // State for cultural tips
  const [currentTips, setCurrentTip] = useState(0)
  // const [currentTip, setCurrentTip] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
 /*  const culturalTips = [
    "As mulheres Mumuilas tradicionalmente usam chá de folhas de abacateiro para aliviar cólicas menstruais.",
    "Na tradição angolana, o baobá simboliza fertilidade e força feminina.",
    "As mamãs da ilha recomendam gengibre com mel para regular o ciclo menstrual.",
    "Segundo a sabedoria tradicional, a fase da lua cheia está associada à ovulação.",
    "O nome Kandimba significa 'coelho' em Kimbundu, simbolizando fertilidade e agilidade.",
    
  ] */

    const [culturalTips, setCulturalTips] = useState([
      {
        id: 0,
        titulo: "Dica Cultural",
        conteudo: "Carregando sabedoria ancestral...",
        fonte: null,
        idioma: "pt",
      },
    ]);


    

    
    /* const culturalTips = homeData?.ancestral_tip_random?.length > 0 
      ? homeData.ancestral_tip_random 
      : [{
          id: 0,
          titulo: "Dica Cultural",
          conteudo: "Carregando sabedoria ancestral...",
          fonte: null,
          idioma: "pt"
        }]; */

/*  const culturalTips = homeData?.ancestral_tip_random?.length > 0 
  ? homeData.ancestral_tip_random 
  : [{
      id: 0,
      titulo: "Dica Cultural",
      conteudo: "Carregando sabedoria ancestral...",
      fonte: null,
      idioma: "pt"
    }]; */
 

/* const culturalTips = homeData?.ancestral_tip_random?.length > 0
  ? homeData.ancestral_tip_random
  : [{
      id: 0,
      titulo: "Dica Cultural",
      conteudo: "Carregando sabedoria ancestral...",
      fonte: null,
      idioma: "pt"
    }];

const currentTip = culturalTips[currentTipIndex];

const nextTip = () => {
  setCurrentTipIndex((prevIndex) => (prevIndex + 1) % culturalTips.length);
}; */  
 
/* const culturalTips = homeData?.ancestral_tip_random?.length > 0
  ? homeData.ancestral_tip_random
  : [{
      id: 0,
      titulo: "Dica Cultural",
      conteudo: "Carregando sabedoria ancestral...",
      fonte: null,
      idioma: "pt"
    }]; */

/*   const culturalTips2 = homeData?.ancestral_tip_random ?? []).length > 0
  ? homeData!.ancestral_tip_random
  : [{
      id: 0,
      titulo: "Dica Cultural",
      conteudo: "Carregando sabedoria ancestral...",
      fonte: null,
      idioma: "pt"
    }]; */

/*   const culturalTips = (2==2
  ? homeData.ancestral_tip_random
  : [{
      id: 0,
      titulo: "Dica Cultural",
      conteudo: "Carregando sabedoria ancestral...",
      fonte: null,
      idioma: "pt"
    }]
) as {
  id: number;
  titulo: string;
  conteudo: string;
  fonte: string | null;
  idioma: string;
}[];
  */

const currentTip = culturalTips[currentTipIndex];

// Atualiza o índice para ver a próxima dica
const nextTip = () => {
  setCurrentTipIndex((prevIndex) =>
    (prevIndex + 1) % culturalTips.length
  );
}; 

  // Calcular dados do ciclo com base em datas reais
  const today = new Date()

  // Calcular o dia atual do ciclo
  const cycleStartTime = cycleData.currentCycle.startDate.getTime()
  const todayTime = today.getTime()
  //const currentCycleDay = Math.floor((todayTime - cycleStartTime) / (24 * 60 * 60 * 1000)) + 1

  // Calcular o progresso do ciclo (porcentagem)
  const cycleProgress = (currentCycleDay / cycleData.currentCycle.length) * 100

  // Dias até a próxima menstruação
  const daysUntilNextPeriod = daysDifference(today, cycleData.nextPeriod)

  // Verificar se está no período menstrual
  const isInPeriod = currentCycleDay <= cycleData.currentCycle.periodDays

  // Verificar se está na janela fértil
  const isInFertileWindow = today >= cycleData.fertileWindow.start && today <= cycleData.fertileWindow.end

  // Verificar se é dia da ovulação
  const isOvulationDay = today.toDateString() === cycleData.fertileWindow.ovulation.toDateString()

  const [homeData, setHomeData] = useState<HomeData | null>(null);
  
  const [loading, setLoading] = useState(true);

  // Pulse animation for interactive elements
  /* useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start()
  }, []) */

  useEffect(() => {
  if (homeData?.ancestral_tip_random?.length > 0) {
    setCulturalTips(homeData.ancestral_tip_random);
  }
}, [homeData]);
  

  useEffect(() => {
    // 1. Inicia as animações
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    );

    
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await getHomeData();
        setHomeData(data); 
        console.log("Dados recebidos de getHomeData:", data)
        setCurrentCycleDay(data.menstrual_cycle.dia_ovulacao)
      } catch (error) {
        console.log('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    // 3. Inicia ambas as operações
    animation.start();
    fetchHomeData();

    // 4. Cleanup function para parar as animações quando o componente desmontar
    return () => {
      animation.stop();
    };
  }, []); // Dependências vazias = executa apenas no mount

  // Create continuous rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start()
  }, [])

  // Create wave animation for the fertile period indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start()
  }, [])

  // Animation for circle progress
  useEffect(() => {
    // First reset to 0
    circleProgress.setValue(0)

    // Then animate to the current progress with spring physics for more natural motion
    Animated.spring(circleProgress, {
      toValue: cycleProgress > 100 ? 100 : cycleProgress, // Limitar a 100%
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start()
  }, [cycleProgress])

  // Fix the notification animation and positioning
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Show notification after 1 second
    setTimeout(() => {
      Animated.spring(notificationAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()

      // Hide notification after 5 seconds
      setTimeout(() => {
        Animated.timing(notificationAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start()
      }, 5000)
    }, 1000)
  }, [])

  // Animation for cultural tips rotation
  useEffect(() => {
  const interval = setInterval(() => {
    Animated.timing(tipFadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % culturalTips.length);
      Animated.timing(tipFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, 10000);

  return () => clearInterval(interval);
}, [culturalTips.length]);

  // Toggle symptom selection
 /*  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  } */

    

  const toggleSymptom = (symptomName: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomName)) {
        return prev.filter(item => item !== symptomName);
      } else {
        return [...prev, symptomName];
      }
    });
  };

  // Componente de Padrão Geométrico
  const GeometricPattern = () => (
    <View style={styles.patternContainer}>
      <View style={styles.patternRow}>
        <View style={[styles.patternElement, styles.patternTriangle, { borderBottomColor: primaryColor }]} />
        <View style={[styles.patternElement, styles.patternCircle, { backgroundColor: primaryColor }]} />
        <View style={[styles.patternElement, styles.patternDot]} />
      </View>
    </View>
  )
/* 
const renderSymptomTracker = () => {
  // Mapeamento de ícones/emojis para cada tipo de sintoma
  const symptomIcons: Record<string, {icon: string; family: string; emoji: string}> = {
    "Fluxo": { icon: "droplet", family: "Feather", emoji: "💧" },
    "Cólicas": { icon: "activity", family: "Feather", emoji: "😣" },
    "Dor de Cabeça": { icon: "alert-circle", family: "Feather", emoji: "🤕" },
    "Inchaço": { icon: "thermometer", family: "Feather", emoji: "🎈" },
    "Dor nas Costas": { icon: "alert-triangle", family: "Feather", emoji: "🔙" },
    "Náusea": { icon: "frown", family: "Feather", emoji: "🤢" },
    "Desejos Alimentares": { icon: "coffee", family: "Feather", emoji: "🍫" },
    "Nível de Energia": { icon: "battery", family: "Feather", emoji: "⚡" },
    "Qualidade do Sono": { icon: "moon", family: "Feather", emoji: "😴" },
    "Sensibilidade nos Seios": { icon: "heart", family: "Feather", emoji: "❤️" },
    "Acne": { icon: "sun", family: "Feather", emoji: "😬" }
  };

  // Usar os sintomas da API ou um array vazio se não estiver disponível
  const apiSymptoms = homeData?.types_symptoms || [];

  return (
    <View style={styles.symptomsContainer}>
      {apiSymptoms.map((symptom) => {
        const isSelected = selectedSymptoms.includes(symptom.tipo);
        const iconData = symptomIcons[symptom.tipo] || { 
          icon: "help-circle", 
          family: "Feather", 
          emoji: "❓" 
        };

        return (
          <TouchableOpacity
            key={symptom.id.toString()}
            style={styles.symptomButton}
            activeOpacity={0.7}
            onPress={() => toggleSymptom(symptom.tipo)}
          >
            <Animated.View
              style={[
                styles.symptomIconContainer,
                { 
                  backgroundColor: `rgba(${primaryColor}, 0.1)`, 
                  borderColor: `rgba(${primaryColor}, 0.3)` 
                },
                isSelected && { 
                  backgroundColor: primaryColor, 
                  borderColor: primaryColor 
                },
                isSelected && { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.symptomEmoji}>{iconData.emoji}</Text>
            </Animated.View>
            <Text
              style={[
                styles.symptomLabel,
                { 
                  color: isDark ? colors.dark.textSecondary : colors.light.textSecondary 
                },
                isSelected && { 
                  color: primaryColor, 
                  fontWeight: "600" 
                },
              ]}
            >
              {symptom.tipo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
 */
  // Render mood tracker com humores únicos
  const renderMoodTracker = () => {
    const moods = [
      { id: "Feliz", icon: "smile", label: "Feliz", family: "Feather", emoji: "😊" },
      { id: "Normal", icon: "meh", label: "Normal", family: "Feather", emoji: "😐" },
      { id: "Triste", icon: "frown", label: "Triste", family: "Feather", emoji: "😔" },
      { id: "Irritada", icon: "alert-octagon", label: "Irritada", family: "Feather", emoji: "😡" },
      { id: "Cansada", icon: "cloud-rain", label: "Cansada", family: "Feather", emoji: "😴" },
    ]

    return (
      <View style={styles.moodsContainer}>
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.id
          return (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodButton}
              activeOpacity={0.7}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Animated.View
                style={[
                  styles.moodIconContainer,
                  { backgroundColor: `rgba(${primaryColor}, 0.1)`, borderColor: `rgba(${primaryColor}, 0.3)` },
                  isSelected && { backgroundColor: primaryColor, borderColor: primaryColor },
                  isSelected && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </Animated.View>
              <Text
                style={[
                  styles.moodLabel,
                  { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary },
                  isSelected && { color: primaryColor, fontWeight: "600" },
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  // Adicionar campo de notas
  const renderNotesSection = () => {
    return (
      <View style={styles.notesContainer}>
        <Text
          style={[styles.notesSectionTitle, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}
        >
          Notas do dia
        </Text>
        <View
          style={[
            styles.notesInputContainer,
            {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              borderColor: isDark ? "#3A3A3A" : "#E0E0E0",
            },
          ]}
        >
          <TextInput
            style={[styles.notesInput, { color: isDark ? "#FFFFFF" : "#333333" }]}
            placeholder="Como você está se sentindo hoje? (opcional)"
            placeholderTextColor={isDark ? "#777777" : "#999999"}
            multiline={true}
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </View>
    )
  }

  // Convert rotation value to degrees
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Determinar a cor do progresso com base na fase do ciclo
  const getProgressColor = () => {
    if (isInPeriod) {
      return colors.primary.red // Vermelho para período menstrual
    } else if (isInFertileWindow) {
      return primaryColor // Cor primária para período fértil
    } else {
      return colors.primary.blue // Azul para fase lútea
    }
  }

  // Render cycle progress with real calendar data
  const renderCycleProgress = () => {
    // Create the AnimatedCircle component
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)

    // SVG dimensions and calculations
    const size = 90
    const centerPoint = size / 2
    const strokeWidth = 6
    const radius = (size - strokeWidth) / 2

    // Calculate the progress for the arc
    const progressValue = circleProgress.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    })

    // Cor do progresso baseada na fase atual
    const progressColor = getProgressColor()

    return (
      <View style={styles.cycleProgressContainer}>
        {/* Main circle container with central alignment */}
        <View style={[styles.circleBackground, { backgroundColor: isDark ? "#222222" : "#F5F5F5" }]}>
          {/* Outer glow effect aligned to center */}
          <Animated.View
            style={[
              styles.rotatingGlow,
              {
                transform: [{ rotate }],
                borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                borderTopColor: isDark ? "rgba(249, 168, 38, 0.05)" : "rgba(249, 168, 38, 0.1)",
                borderRightColor: isDark ? "rgba(229, 115, 115, 0.15)" : "rgba(229, 115, 115, 0.2)",
                borderBottomColor: isDark ? "rgba(100, 181, 246, 0.15)" : "rgba(100, 181, 246, 0.2)",
                borderLeftColor: isDark ? "rgba(249, 168, 38, 0.05)" : "rgba(249, 168, 38, 0.1)",
              },
            ]}
          />

          {/* Inner circle with progress aligned to center */}
          <View style={[styles.circleInner, { backgroundColor: isDark ? "#222222" : "#F5F5F5" }]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* Background track centered */}
              <Circle
                cx={centerPoint}
                cy={centerPoint}
                r={radius}
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress arc centered */}
              <G rotation="-90" origin={`${centerPoint},${centerPoint}`}>
                <AnimatedCircle
                  cx={centerPoint}
                  cy={centerPoint}
                  r={radius}
                  stroke={progressColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={[2 * Math.PI * radius * progressValue, 2 * Math.PI * radius * (1 - progressValue)]}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </G>
            </Svg>

            {/* Center text aligned to center point */}
            <View style={styles.circleTextContainer}>
              <Text style={[styles.circleText, { color: primaryColor }]}>Dia {currentCycleDay}</Text>
              {isOvulationDay && (
                <Text style={[styles.circleSubText, { color: isDark ? "#BBBBBB" : "#777777" }]}>Ovulação</Text>
              )}
            </View>
          </View>
        </View>

        {/* Phase indicator dots aligned with the circle */}
        <View style={styles.phaseIndicator}>
          <View
            style={[
              styles.phaseIndicatorDot,
              {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
              },
              isInPeriod && { backgroundColor: colors.primary.red, borderColor: colors.primary.red },
            ]}
          />
          <View
            style={[
              styles.phaseIndicatorLine,
              { backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" },
            ]}
          />
          <View
            style={[
              styles.phaseIndicatorDot,
              {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
              },
              isInFertileWindow && { backgroundColor: primaryColor, borderColor: primaryColor },
            ]}
          />
          <View
            style={[
              styles.phaseIndicatorLine,
              { backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" },
            ]}
          />
          <View
            style={[
              styles.phaseIndicatorDot,
              {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
              },
              !isInPeriod &&
                !isInFertileWindow && { backgroundColor: colors.primary.blue, borderColor: colors.primary.blue },
            ]}
          />
        </View>
      </View>
    )
  }

  // Função para obter a mensagem de fase do ciclo
  const getCyclePhaseMessage = () => {
    if (isInPeriod) {
      return "Você está no seu período menstrual"
    } else if (isOvulationDay) {
      return "Hoje é seu dia de ovulação"
    } else if (isInFertileWindow) {
      return "Você está no seu período fértil"
    } else if (daysUntilNextPeriod <= 7) {
      return `${daysUntilNextPeriod} dias até sua próxima menstruação`
    } else {
      return "Você está na fase lútea do seu ciclo"
    }
  }

  // Botão de salvar com animação
  const SaveButton = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current

    const handlePressIn = () => {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start()
    }

  /*   const handleSaveMoodLog = () => {
      
      if (!selectedMood && selectedSymptoms.length === 0 && !notes.trim()) {
        alert("Por favor, selecione pelo menos um humor, sintoma ou adicione uma nota");
        return;
      }

      alert("Registros salvos com sucesso! 2")

      console.log('Mood selected: '+selectedMood)
      console.log('Notas digitadas:', notes);

      // Limpar seleções após salvar
      setSelectedMood(null)
      setSelectedSymptoms([])
      setNotes("")
    } */

    const handleSaveMoodLog = async () => {
      if (!selectedMood && !notes.trim()) {
        alert("Por favor, selecione um humor ou adicione uma nota");
        return;
      }

      try {
        const response = await record_daily_mood({
          mood: selectedMood,
          descricao: notes
        });

        // Sucesso (status 2xx)
        alert("Registro salvo com sucesso!");

        /* console.log('Mood selected:', selectedMood);
        console.log('Notas digitadas:', notes); */

        setSelectedMood(null);
        setNotes("");

      } catch (error: any) {
        // Erro (ex: 409, 500)
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message); // mostra o que o servidor enviou
          //console.log("Error creating mood log:", error.response.data);
        } else {
          alert("Erro inesperado ao salvar. Tente novamente.");
         // console.log("Erro ao salvar:", error);
        }
      }
    };

    return (
      <TouchableOpacity
        style={styles.saveButtonContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSaveMoodLog}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[styles.saveButton, { backgroundColor: primaryColor, transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.saveButtonText}>Salvar Registros</Text>
          <Icon family="Feather" name="check-circle" size={18} color="#FFFFFF" style={styles.saveButtonIcon} />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#1A1A1A" : "#F8F8F8" }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Notification */}
      <Animated.View
        style={[
          styles.notification,
          {
            transform: [{ translateY: notificationAnim }],
            backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
            borderLeftColor: primaryColor,
            ...Platform.select({
              ios: {
                shadowColor: isDark ? "#000" : "#888",
              },
              android: {
                elevation: 6,
              },
            }),
          },
        ]}
      >
        <View style={[styles.notificationIcon, { backgroundColor: `rgba(${primaryColor}, 0.2)` }]}>
          <Icon family="Feather" name="bell" size={16} color={primaryColor} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>Lembrete</Text>
          <Text style={[styles.notificationText, { color: isDark ? "#BBBBBB" : "#777777" }]}>
            {homeData?.reminder?.message || "Carregando lembrete..."}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.notificationClose,
            { backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" },
          ]}
        >
          <Icon family="Feather" name="x" size={14} color={isDark ? "#AAAAAA" : "#777777"} />
        </TouchableOpacity>
      </Animated.View>

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>Olá, {homeData?.username_traditional ?? 'Kandimba'}</Text>
          <Text style={[styles.headerDate, { color: isDark ? "#BBBBBB" : "#777777" }]}>
            {getCurrentDateFormatted()}
          </Text>
        </View>
        <GeometricPattern /> 
      </Animated.View>
   
      {/* Cycle Card */}
      <Animated.View
        style={[
          styles.cycleCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
            borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
            ...Platform.select({
              ios: {
                shadowColor: isDark ? "#000" : "#888",
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
        <View style={[styles.gradientBar, { backgroundColor: primaryColor }]} />
        <View style={styles.cycleCardContent}>
          {renderCycleProgress()}

          <View style={styles.cycleInfo}>
            <Text style={[styles.cycleTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>Ciclo atual</Text>
            <Text style={[styles.cycleSubtitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>
              {/* {getCyclePhaseMessage()} */} {homeData?.menstrual_cycle.ovulacao || 'Carregando informações do ciclo...'}
            </Text>

            {/* Enhanced badge with animation */}
            <View style={styles.badgeContainer}>
              {isInFertileWindow ? (
                <Animated.View
                  style={[
                    styles.badge,
                    styles.fertileBadge,
                    {
                      backgroundColor: `rgba(${primaryColor}, 0.1)`,
                      borderColor: `rgba(${primaryColor}, 0.3)`,
                      transform: [{ scale: Animated.add(1, Animated.multiply(waveAnim, 0.05)) }],
                    },
                  ]}
                >
                  <Icon family="Feather" name="droplet" size={12} color={primaryColor} />
                  <Text style={[styles.badgeText, styles.fertileBadgeText, { color: primaryColor }]}>
                    Período Fértil
                  </Text>
                </Animated.View>
              ) : isInPeriod ? (
                <View
                  style={[
                    styles.badge,
                    styles.periodBadge,
                    {
                      backgroundColor: "rgba(229, 115, 115, 0.1)",
                      borderColor: "rgba(229, 115, 115, 0.3)",
                    },
                  ]}
                >
                  <Icon family="Feather" name="droplet" size={12} color={colors.primary.red} />
                  <Text style={[styles.badgeText, styles.periodBadgeText, { color: colors.primary.red }]}>
                    Menstruação
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.badge,
                    styles.luteoBadge,
                    {
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)",
                    },
                  ]}
                >
                  <Icon family="Feather" name="moon" size={12} color={isDark ? "#FFFFFF" : "#333333"} />
                  <Text style={[styles.badgeText, styles.luteoBadgeText, { color: isDark ? "#FFFFFF" : "#333333" }]}>
                    Fase Lútea
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View
        style={[
          styles.quickStatsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
              ...Platform.select({
                ios: {
                  shadowColor: isDark ? "#000" : "#888",
                },
                android: {
                  elevation: 5,
                },
              }),
            },
          ]}
        >
          <View
            style={[
              styles.statIconContainer,
              styles.periodIconContainer,
              {
                backgroundColor: "rgba(229, 115, 115, 0.1)",
                borderColor: "rgba(229, 115, 115, 0.3)",
              },
            ]}
          >
            <Icon family="Feather" name="calendar" size={20} color={colors.primary.red} />
          </View>
          <Text style={[styles.statTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Próxima Menstruação</Text>
          <Text style={[styles.statValue, styles.periodValue, { color: colors.primary.red }]}>
            {/* {formatDate(cycleData.nextPeriod)} */} {homeData?.proxima_menstruacao || '--/--'}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
              ...Platform.select({
                ios: {
                  shadowColor: isDark ? "#000" : "#888",
                },
                android: {
                  elevation: 5,
                },
              }),
            },
          ]}
        >
          <View
            style={[
              styles.statIconContainer,
              styles.fertileIconContainer,
              {
                backgroundColor: `rgba(${primaryColor}, 0.1)`,
                borderColor: `rgba(${primaryColor}, 0.3)`,
              },
            ]}
          >
            <Icon family="Feather" name="heart" size={20} color={primaryColor} />
          </View>
          <Text style={[styles.statTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Período Fértil</Text>
          <Text style={[styles.statValue, styles.fertileValue, { color: primaryColor }]}>
            {/* {formatDate(cycleData.fertileWindow.start)} - {formatDate(cycleData.fertileWindow.end)} */}
            {homeData?.fertile_period.inicio_periodo_fertil || '--/--'} - {homeData?.fertile_period.fim_periodo_fertil || '--/--'}
          </Text>
        </View>
      </Animated.View>

      {/* Mood and Symptoms Tracker */}
      <Animated.View
        style={[
          styles.trackerCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
            borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
            ...Platform.select({
              ios: {
                shadowColor: isDark ? "#000" : "#888",
              },
              android: {
                elevation: 5,
              },
            }),
          },
        ]}
      >
        <View style={styles.trackerHeader}>
          <View style={[styles.trackerIconContainer, { backgroundColor: `rgba(${primaryColor}, 0.2)` }]}>
            <Icon family="Feather" name="heart" size={14} color={primaryColor} />
          </View>
          <Text style={[styles.trackerTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>Como você está hoje?</Text>
        </View>

        <View style={styles.trackerContent}>
          <Text style={[styles.trackerSectionTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Humor</Text>
          {renderMoodTracker()}

         {/*  <View style={[styles.sectionDivider, { backgroundColor: isDark ? "#3A3A3A" : "#EEEEEE" }]} /> */}

         {/*  <Text style={[styles.trackerSectionTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Sintomas</Text>
          {renderSymptomTracker()} */}

          <View style={[styles.sectionDivider, { backgroundColor: isDark ? "#3A3A3A" : "#EEEEEE" }]} />

          {renderNotesSection()}

          <SaveButton />
        </View>
      </Animated.View>

      {/* Cycle Analysis */}
      {/* <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>Análise do Ciclo</Text>
        <TouchableOpacity style={styles.seeMoreButton}>
          <Text style={[styles.seeMoreText, { color: primaryColor }]}>Ver mais</Text>
          <Icon family="Feather" name="chevron-right" size={16} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.analysisContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View
          style={[
            styles.analysisCard,
            {
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
              ...Platform.select({
                ios: {
                  shadowColor: isDark ? "#000" : "#888",
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <View
            style={[
              styles.analysisIconContainer,
              styles.cycleIconContainer,
              {
                backgroundColor: `rgba(${primaryColor}, 0.1)`,
                borderColor: `rgba(${primaryColor}, 0.3)`,
              },
            ]}
          >
            <Icon family="Feather" name="calendar" size={16} color={primaryColor} />
          </View>
          <Text style={[styles.analysisTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Duração Média</Text>
          <Text style={[styles.analysisValue, { color: isDark ? "#FFFFFF" : "#333333" }]}>
            {cycleData.currentCycle.length} dias
          </Text>
          <View
            style={[
              styles.analysisBarContainer,
              { backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
            ]}
          >
            <View style={[styles.analysisBar, { width: "80%", backgroundColor: primaryColor }]} />
          </View>
        </View>

        <View
          style={[
            styles.analysisCard,
            {
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
              ...Platform.select({
                ios: {
                  shadowColor: isDark ? "#000" : "#888",
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <View
            style={[
              styles.analysisIconContainer,
              styles.periodIconContainer,
              {
                backgroundColor: "rgba(229, 115, 115, 0.1)",
                borderColor: "rgba(229, 115, 115, 0.3)",
              },
            ]}
          >
            <Icon family="Feather" name="droplet" size={16} color={colors.primary.red} />
          </View>
          <Text style={[styles.analysisTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Menstruação</Text>
          <Text style={[styles.analysisValue, { color: isDark ? "#FFFFFF" : "#333333" }]}>
            {cycleData.currentCycle.periodDays} dias
          </Text>
          <View
            style={[
              styles.analysisBarContainer,
              { backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
            ]}
          >
            <View style={[styles.analysisBar, styles.periodBar, { width: "60%" }]} />
          </View>
        </View>

        <View
          style={[
            styles.analysisCard,
            {
              backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
              borderColor: isDark ? "#3A3A3A" : "#EEEEEE",
              ...Platform.select({
                ios: {
                  shadowColor: isDark ? "#000" : "#888",
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <View
            style={[
              styles.analysisIconContainer,
              styles.tempIconContainer,
              {
                backgroundColor: `rgba(${primaryColor}, 0.1)`,
                borderColor: `rgba(${primaryColor}, 0.3)`,
              },
            ]}
          >
            <Icon family="Feather" name="thermometer" size={16} color={primaryColor} />
          </View>
          <Text style={[styles.analysisTitle, { color: isDark ? "#BBBBBB" : "#777777" }]}>Temperatura</Text>
          <Text style={[styles.analysisValue, { color: isDark ? "#FFFFFF" : "#333333" }]}>36.7°C</Text>
          <View
            style={[
              styles.analysisBarContainer,
              { backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
            ]}
          >
            <View style={[styles.analysisBar, styles.tempBar, { width: "70%" }]} />
          </View>
        </View>
      </Animated.View> */}

      {/* Cultural Wisdom */}
      <Animated.View
  style={[
    styles.wisdomCard,
    {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
      backgroundColor: `rgba(${primaryColor}, 0.05)`,
      borderColor: `rgba(${primaryColor}, 0.2)`,
      ...Platform.select({
        ios: {
          shadowColor: isDark ? "#000" : "#888",
        },
        android: {
          elevation: 5,
        },
      }),
    },
  ]}
>
  <View
    style={[
      styles.wisdomHeader,
      { borderBottomColor: `rgba(${primaryColor}, 0.1)` },
    ]}
  >
    <Icon family="Feather" name="feather" size={16} color={primaryColor} />
    <Text style={[styles.wisdomTitle, { color: isDark ? "#FFFFFF" : "#333333" }]}>
     {/*  {currentTip.titulo || "Sabedoria Ancestral"} */} {culturalTips[currentTipIndex].titulo || "Sabedoria Ancestral"}
    </Text>
  </View>

  <View style={styles.wisdomContent}>
    <Animated.Text style={[styles.wisdomText, { opacity: tipFadeAnim, color: isDark ? "#DDDDDD" : "#555555" }]}>
     {/*  {currentTip.conteudo || "N/D"} */} {culturalTips[currentTipIndex].conteudo || "N/D"}
    </Animated.Text>

    <TouchableOpacity style={styles.wisdomButton} onPress={nextTip}>
      <Text style={[styles.wisdomButtonText, { color: primaryColor }]}>Ver mais sabedoria</Text>
      <Icon family="Feather" name="arrow-right" size={14} color={primaryColor} />
    </TouchableOpacity>
  </View>
      </Animated.View>


      {/* Bottom spacing for navigation bar */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  patternElement: {
    margin: 2,
  },
  patternTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  patternCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF", // Branco do padrão
  },
  notification: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    zIndex: 100,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  notificationText: {
    fontSize: 12,
    marginTop: 2,
  },
  notificationClose: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
    position: "relative",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: 14,
    marginTop: 2,
  },
  cycleCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 20,
  },
  gradientBar: {
    height: 4,
  },
  cycleCardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  cycleProgressContainer: {
    marginRight: 20,
    alignItems: "center",
  },
  circleBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  rotatingGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    top: -5,
    left: -5,
  },
  pulsingCircle: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(249, 168, 38, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.1)",
  },
  circleTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  circleText: {
    fontSize: 16,
    fontWeight: "700",
  },
  circleSubText: {
    fontSize: 10,
    marginTop: 2,
  },
  phaseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  phaseIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  phaseIndicatorActive: {
    backgroundColor: "#F9A826",
    borderColor: "#F9A826",
  },
  phaseIndicatorLine: {
    width: 12,
    height: 1,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cycleSubtitle: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fertileBadge: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  periodBadge: {
    backgroundColor: "rgba(229, 115, 115, 0.1)", // Vermelho com transparência
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  luteoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Branco com transparência
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  fertileBadgeText: {
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  periodBadgeText: {
    color: "#E57373", // Vermelho do padrão
  },
  luteoBadgeText: {
    color: "#FFFFFF", // Branco do padrão
  },
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  periodIconContainer: {
    backgroundColor: "rgba(229, 115, 115, 0.1)", // Vermelho com transparência
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  fertileIconContainer: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  periodValue: {
    color: "#E57373", // Vermelho do padrão
  },
  fertileValue: {
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  trackerCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 20,
  },
  trackerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  trackerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  trackerTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  trackerContent: {
    padding: 16,
  },
  trackerSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  symptomButton: {
    alignItems: "center",
    width: "25%",
    marginBottom: 16,
  },
  symptomIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
  },
  symptomIconSelected: {
    backgroundColor: "#F9A826",
    borderColor: "#F9A826",
  },
  symptomLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  symptomLabelSelected: {
    color: "#F9A826",
    fontWeight: "600",
  },
  symptomEmoji: {
    fontSize: 18,
  },
  sectionDivider: {
    height: 1,
    marginVertical: 20,
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodButton: {
    alignItems: "center",
  },
  moodIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
  },
  moodIconSelected: {
    backgroundColor: "#F9A826",
    borderColor: "#F9A826",
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  moodLabelSelected: {
    color: "#F9A826",
    fontWeight: "600",
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  notesInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  notesInput: {
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  saveButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  saveButtonIcon: {
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 14,
    marginRight: 4,
  },
  analysisContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  analysisCard: {
    width: "31%",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  analysisIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cycleIconContainer: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  tempIconContainer: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  analysisTitle: {
    fontSize: 10,
    marginBottom: 4,
    textAlign: "center",
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  analysisBarContainer: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  analysisBar: {
    height: "100%",
    backgroundColor: "#F9A826",
    borderRadius: 2,
  },
  periodBar: {
    backgroundColor: "#E57373",
  },
  tempBar: {
    backgroundColor: "#64B5F6",
  },
  wisdomCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 20,
  },
  wisdomHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  wisdomTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  wisdomContent: {
    padding: 16,
  },
  wisdomText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
  },
  wisdomButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  wisdomButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  bottomSpacing: {
    height: 80,
  },
})

export default HomeScreen
