"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from "react-native"
import { Icon } from "../App"
import TabIndicator from "./TabIndicator"
import { cycleOverview } from "../services/authed/main-service"

const { width } = Dimensions.get("window")

// Animated emoji component for more interactive UI
const AnimatedEmoji = ({ emoji, size = 24, style = {} }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ])

    // Random interval for pulse animation
    const interval = setInterval(
      () => {
        pulseAnimation.start()
      },
      Math.random() * 5000 + 5000,
    )

    return () => clearInterval(interval)
  }, [])

  return <Animated.Text style={[{ fontSize: size, transform: [{ scale: scaleAnim }] }, style]}>{emoji}</Animated.Text>
}

// Interactive cycle phase visualization component
const CyclePhaseVisualization = ({ currentPhase, cycleLength = 28 }) => {
  const phases = [
    { name: "Menstrual", days: [1, 2, 3, 4, 5], color: "#E57373", emoji: "🌊" },
    { name: "Folicular", days: [6, 7, 8, 9, 10, 11, 12], color: "#81C784", emoji: "🌱" },
    { name: "Ovulação", days: [13, 14, 15, 16], color: "#64B5F6", emoji: "🥚" },
    { name: "Lútea", days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], color: "#BA68C8", emoji: "🌙" },
  ];

  const currentPhaseObj = phases.find((phase) => phase.name === currentPhase) || phases[0];
  const currentDay = currentPhaseObj.days[0];

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentDay / cycleLength,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [currentDay]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.cycleVisualization}>
      <View style={styles.cycleLabels}>
        {phases.map((phase, index) => (
          <View
            key={index}
            style={[
              styles.phaseLabel,
              { flex: phase.days.length / cycleLength },
              currentPhase === phase.name && styles.activePhaseLabel,
            ]}
          >
            <AnimatedEmoji emoji={phase.emoji} size={16} style={{ marginRight: 4 }} />
            <Text
              style={[styles.phaseLabelText, currentPhase === phase.name && { color: phase.color, fontWeight: "bold" }]}
            >
              {phase.name}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.cycleProgressContainer}>
        <View style={styles.cycleProgressBackground}>
          {Array.from({ length: cycleLength }).map((_, i) => (
            <View key={i} style={[styles.invisiblePoint, { left: `${(i / cycleLength) * 100}%` }]} />
          ))}
          {phases.map((phase, index) => {
            const startPercent = ((phase.days[0] - 1) / cycleLength) * 100;
            const widthPercent = (phase.days.length / cycleLength) * 100;
            return (
              <View
                key={index}
                style={[
                  styles.phaseSegment,
                  {
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: phase.color,
                    opacity: 0.3,
                  },
                ]}
              />
            );
          })}
          <Animated.View
            style={[
              styles.cycleProgress,
              { width: progressWidth, backgroundColor: currentPhaseObj.color },
            ]}
          />
          <Animated.View
            style={[
              styles.currentDayMarker,
              { left: progressWidth, backgroundColor: currentPhaseObj.color },
            ]}
          >
            <Text style={styles.currentDayText}>{currentDay}</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// Interactive symptom intensity component
const SymptomIntensity = ({ value, max = 5, activeColor = "#F9A826", onChange }) => {
  return (
    <View style={styles.symptomIntensity}>
      {Array.from({ length: max }).map((_, i) => (
        <TouchableOpacity key={i} onPress={() => onChange && onChange(i + 1)} style={styles.intensityDotContainer}>
          <View
            style={[styles.intensityDot, i < value && { backgroundColor: activeColor, transform: [{ scale: 1.2 }] }]}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

// Interactive timeline component
const CycleTimeline = ({ phases }) => {
  const activePhaseIndex = phases.findIndex((phase) => phase.days.some((day) => day.date === new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }))) || 0;

  return (
    <View style={styles.timeline}>
      {phases.map((phase, index) => (
        <React.Fragment key={index}>
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelinePoint,
                index < activePhaseIndex && styles.timelinePointPast,
                index === activePhaseIndex && styles.timelinePointActive,
              ]}
            />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>{phase.date_range}</Text>
              <Text style={[styles.timelineTitle, index === activePhaseIndex && { color: "#F9A826" }]}>
                {phase.phase}
              </Text>
              <Text style={styles.timelineDescription}>{phase.description}</Text>
            </View>
          </View>
          {index < phases.length - 1 && (
            <View style={[styles.timelineConnector, index < activePhaseIndex && styles.timelineConnectorPast]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// Interactive insight card component
const InsightCard = ({ icon, title, description, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.insightItem, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.insightIconContainer}>
          <Icon family="Feather" name={icon} size={20} color="#F9A826" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>{title}</Text>
          <Text style={styles.insightDescription}>{description}</Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const CycleScreen = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview")
  const [tabsWidth, setTabsWidth] = useState(width)

  // State for interactive elements
  const [symptoms, setSymptoms] = useState({
    mood: 3,
    energy: 4,
    libido: 3,
  })

  const [cycleData, setCycleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        setLoading(true);
        const data = await cycleOverview();
        setCycleData(data);
      } catch (err) {
       // setError("Erro ao carregar dados do ciclo");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCycleData();

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
    ]).start();
  }, []);

  /* // Animation for fade in
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
  }, [])
 */
  // Get active tab index for TabIndicator
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "overview":
        return 0
      case "calendar":
        return 1
      case "symptoms":
        return 2
      case "history":
        return 3
      default:
        return 0
    }
  }

  // Timeline data
  const timelinePhases = [
    {
      date: "1-5 Abril",
      title: "Menstruação",
      description: "Fluxo moderado, cólicas leves",
    },
    {
      date: "6-12 Abril",
      title: "Fase Folicular",
      description: "Energia em alta, humor estável",
    },
    {
      date: "13-16 Abril",
      title: "Ovulação",
      description: "Alta fertilidade",
    },
    {
      date: "17-28 Abril",
      title: "Fase Lútea",
      description: "Possíveis sintomas pré-menstruais",
    },
  ]

  // Handle symptom intensity change
  const handleSymptomChange = (symptom, value) => {
    setSymptoms((prev) => ({
      ...prev,
      [symptom]: value,
    }))
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>Meu Ciclo</Text>
        <Text style={styles.headerSubtitle}>Acompanhe e entenda seu ciclo menstrual</Text>
      </Animated.View>

      {/* Tabs */}
      <View
        style={styles.tabsContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setTabsWidth(width)
        }}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Visão Geral</Text>
        </TouchableOpacity>

      {/*   <TouchableOpacity
          style={[styles.tab, activeTab === "calendar" && styles.activeTab]}
          onPress={() => setActiveTab("calendar")}
        >
          <Text style={[styles.tabText, activeTab === "calendar" && styles.activeTabText]}>Calendário</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.tab, activeTab === "symptoms" && styles.activeTab]}
          onPress={() => setActiveTab("symptoms")}
        >
          <Text style={[styles.tabText, activeTab === "symptoms" && styles.activeTabText]}>Sintomas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>

        {/* Use the TabIndicator component */}
        <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={4} containerWidth={tabsWidth} color="#F9A826" />
      </View>

      {activeTab === "overview" && cycleData && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Status do Ciclo</Text>
            </View>
            <View style={styles.statusContent}>
              <View style={styles.statusIconContainer}>
                <Icon family="Feather" name="moon" size={24} color="#E57373" />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusMainText}>Próxima ovulação: {cycleData.proximaOvulacao}</Text>
               {/*  <Text style={styles.statusSubText}>
                  Próxima menstruação: {new Date().getDate() + cycleData.menstrual_cycle_data.duracao_periodo}/05
                </Text> */}
              </View>
            </View>
            <View style={styles.statusFooter}>
              <View style={styles.statusMetric}>
                <Text style={styles.statusMetricLabel}>Duração do Ciclo</Text>
                <Text style={styles.statusMetricValue}>{cycleData.menstrual_cycle_data.duracao_ciclo} dias</Text>
              </View>
              <View style={styles.statusMetric}>
                <Text style={styles.statusMetricLabel}>Duração do Período</Text>
                <Text style={styles.statusMetricValue}>{cycleData.menstrual_cycle_data.duracao_periodo} dias</Text>
              </View>
            </View>
           {/*  <View style={styles.cycleVisualizationContainer}>
              <CyclePhaseVisualization
                currentPhase="Lútea" // Ajustar dinamicamente com base em cycleData.cycle_timeline
                cycleLength={cycleData.menstrual_cycle_data.duracao_ciclo}
              />
            </View> */}
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.cardTitle}>Linha do Tempo do Ciclo</Text>
            <CycleTimeline phases={cycleData.cycle_timeline} />
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Insights do Ciclo</Text>
            <InsightCard
              icon="calendar"
              title="Próxima ovulação"
              description={cycleData.ovulacao}
              onPress={() => console.log("Insight 2 pressed")}
            />
          </View>
        </Animated.View>
      )}
{activeTab === "symptoms" && cycleData && (
        <View style={styles.symptomsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sintomas Registrados</Text>
           {/*  <TouchableOpacity style={styles.cardAction} onPress={()=>{setActiveTab("registerSymtpom")}}>
              <Text style={styles.cardActionText}>Adicionar</Text>
              <Icon family="Feather" name="plus" size={16} color="#F9A826" />
            </TouchableOpacity> */}
          </View>
          <View style={styles.symptomsList}>
            {cycleData.symptoms.length > 0 ? (
              cycleData.symptoms.map((symptom, index) => (
                <React.Fragment key={index}>
                  <View style={styles.symptomItem}>
                    <View style={styles.symptomIcon}>
                      <AnimatedEmoji emoji="😊" size={18} />
                    </View>
                    <View style={styles.symptomContent}>
                      <Text style={styles.symptomTitle}>{symptom.intensidade || "N/D"}</Text>
                      <Text style={styles.symptomValue}>{symptom.mood || "N/D"}</Text>
                    </View>
                    <SymptomIntensity
                      value={symptom.intensidade === "Estável" ? 3 : 0}
                      activeColor="#F9A826"
                      onChange={(value) => handleSymptomChange("mood", value)}
                    />
                  </View>
                  {index < cycleData.symptoms.length - 1 && <View style={styles.symptomDivider} />}
                </React.Fragment>
              ))
            ) : (
              <Animated.View style={{ opacity: fadeAnim }}>
                <View style={styles.placeholderCard}>
                  <AnimatedEmoji emoji="📊" size={48} style={{ marginBottom: 16 }} />
                  <Text style={styles.placeholderText}>Sem Sintomas Registrados</Text>
                  <Text style={styles.placeholderDescription}>
                    Nenhum sintoma foi registrado até o momento. Adicione sintomas para acompanhar seu ciclo!
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      )}

      {activeTab === "history" && cycleData && (
        <View style={styles.symptomsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Histórico de Ciclos</Text>
          </View>
          <View style={styles.symptomsList}>
            {cycleData.cycleDays && cycleData.cycleDays.length > 0 ? (
              cycleData.cycleDays.map((day, index) => (
                <React.Fragment key={index}>
                  <View style={styles.symptomItem}>
                    <View style={styles.symptomIcon}>
                      <AnimatedEmoji emoji="📅" size={18} />
                    </View>
                    <View style={styles.symptomContent}>
                      <Text style={styles.symptomTitle}>
                        {day.created_at
                          ? `${String(new Date(day.created_at).getDate()).padStart(2, "0")}/${String(
                              new Date(day.created_at).getMonth() + 1
                            ).padStart(2, "0")}/${new Date(day.created_at).getFullYear()}`
                          : "N/D"
                        }
                      </Text>
                      <Text style={styles.symptomValue}>Fase: {day.fase || "N/D"} | T. Basal: {day.temperatura_basal ? day.temperatura_basal+"°C" : "N/D"}</Text>
                      <Text style={styles.symptomValue}>Teste Gravidez: {day.teste_gravidez || "N/D"}</Text>
                      <Text style={styles.symptomValue}>Teve Intercurso: {day.teve_intercurso || "N/D"}</Text>
                    </View>
                  </View>
                  {index < cycleData.cycleDays.length - 1 && <View style={styles.symptomDivider} />}
                </React.Fragment>
              ))
            ) : (
              <Animated.View style={{ opacity: fadeAnim }}>
                <View style={styles.placeholderCard}>
                  <AnimatedEmoji emoji="📜" size={48} style={{ marginBottom: 16 }} />
                  <Text style={styles.placeholderText}>Histórico de Ciclos</Text>
                  <Text style={styles.placeholderDescription}>
                    Nenhum dado de ciclo foi registrado até o momento. Comece a acompanhar para ver seu histórico!
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      )}

      {/* Bottom spacing for navigation bar */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
    letterSpacing: 0.25,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
  },
  activeTab: {
    // Active styling is now handled by the TabIndicator
  },
  tabText: {
    fontSize: 14,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F9A826",
    fontWeight: "bold",
  },
  statusCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.25,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(229, 115, 115, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#E57373",
    fontWeight: "bold",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(229, 115, 115, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusMainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statusSubText: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  cycleVisualizationContainer: {
    marginVertical: 16,
  },
  cycleVisualization: {
    width: "100%",
  },
  cycleLabels: {
    flexDirection: "row",
    marginBottom: 8,
  },
  phaseLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activePhaseLabel: {
    transform: [{ scale: 1.05 }],
  },
  phaseLabelText: {
    fontSize: 12,
    color: "#AAAAAA",
    textAlign: "center",
  },
  cycleProgressContainer: {
    height: 24,
    width: "100%",
  },
  cycleProgressBackground: {
    height: 8,
    backgroundColor: "#3A3A3A",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  invisiblePoint: {
    position: "absolute",
    width: 1,
    height: 1,
    backgroundColor: "transparent",
    top: 4,
  },
  phaseSegment: {
    position: "absolute",
    height: "100%",
  },
  cycleProgress: {
    position: "absolute",
    height: "100%",
    borderRadius: 4,
  },
  currentDayMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
    top: -6,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  currentDayText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  statusFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    paddingTop: 12,
  },
  statusMetric: {
    alignItems: "center",
  },
  statusMetricLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  statusMetricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E57373",
  },
  timelineCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.25,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  timelinePoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3A3A3A",
    borderWidth: 2,
    borderColor: "#2A2A2A",
    marginRight: 12,
    marginTop: 2,
  },
  timelinePointPast: {
    backgroundColor: "#E57373",
  },
  timelinePointActive: {
    backgroundColor: "#F9A826",
    borderColor: "rgba(249, 168, 38, 0.3)",
    transform: [{ scale: 1.2 }],
  },
  timelineConnector: {
    width: 2,
    height: 24,
    backgroundColor: "#3A3A3A",
    marginLeft: 7,
    marginBottom: 8,
  },
  timelineConnectorPast: {
    backgroundColor: "#E57373",
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  timelineDescription: {
    fontSize: 12,
    color: "#CCCCCC",
  },
  symptomsCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardActionText: {
    fontSize: 14,
    color: "#F9A826",
    marginRight: 4,
  },
  symptomsList: {
    marginBottom: 8,
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  symptomIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(249, 168, 38, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  symptomContent: {
    flex: 1,
  },
  symptomTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  symptomValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F9A826",
  },
  symptomIntensity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  intensityDotContainer: {
    padding: 4, // Larger touch target
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3A3A3A",
    transition: "all 0.2s",
  },
  intensityDotActive: {
    backgroundColor: "#F9A826",
    transform: [{ scale: 1.2 }],
  },
  symptomDivider: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 4,
  },
  insightsCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#333333",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F9A826",
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(249, 168, 38, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: "#CCCCCC",
    lineHeight: 18,
  },
  placeholderCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    minHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  placeholderDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 80,
  },
})

export default CycleScreen
