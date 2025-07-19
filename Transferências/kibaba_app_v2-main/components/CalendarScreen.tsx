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
} from "react-native"
// Adicionar import para LinearGradient
import { LinearGradient } from "expo-linear-gradient"

// Import the Icon component from App.tsx
import { Icon } from "../App"
import { calendar, fertile_window } from "../services/authed/main-service"

const { width } = Dimensions.get("window")

// Helper functions for date manipulation
const addMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const subMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() - months)
  return result
}

const startOfMonth = (date) => {
  const result = new Date(date)
  result.setDate(1)
  return result
}

const endOfMonth = (date) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  result.setDate(0)
  return result
}

const eachDayOfInterval = ({ start, end }) => {
  const days = []
  const current = new Date(start)

  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

// Format date to Portuguese
const formatMonth = (date) => {
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

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const formatFullDate = (date) => {
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

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} de ${month} de ${year}`
}

const formatShortDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${day}/${month}`
}

const CalendarScreen = () => {
  // State for current and selected dates

  const [apiData, setApiData] = useState<{
    moodLogs: Array<{
      id: number;
      date: string;
      mood_with_emoji: string;
      mood: string;
      descricao: string | null;
      fase: string;
      created_at: string;
    }>;
    menstrual_calendar: {
      month: string;
      days: Array<{
        day: number;
        date: string;
        day_of_week: number;
        events: any[];
        is_current_month: boolean;
      }>;
      current_cycle: {
        period_start: string;
        period_end: string;
        fertile_window_start: string;
        fertile_window_end: string;
        ovulation_day: string;
      };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [historyEntryExpanded, setHistoryEntryExpanded] = useState(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const calendarSlideAnim = useRef(new Animated.Value(0)).current
  const monthFadeAnim = useRef(new Animated.Value(1)).current
  const patternAnim = useRef(new Animated.Value(0)).current
  const historyItemAnims = useRef({}).current

  /* const getDayStatus = (date: Date) => {
    if (!apiData?.menstrual_calendar.current_cycle) {
      return { isPeriod: false, isFertile: false, isOvulation: false };
    }

    const { period_start, period_end, fertile_window_start, fertile_window_end, ovulation_day } =
      apiData.menstrual_calendar.current_cycle;

    const isPeriod = date >= new Date(period_start) && date <= new Date(period_end);
    const isFertile = date >= new Date(fertile_window_start) && date <= new Date(fertile_window_end);
    const isOvulation = isSameDay(date, new Date(ovulation_day));

    return { isPeriod, isFertile, isOvulation };
  }; */

  const getDayStatus = (date: Date) => {
  if (!apiData?.menstrual_calendar.current_cycle) {
    return { isPeriod: false, isFertile: false, isOvulation: false, isPeriodStart: false, isPeriodEnd: false };
  }

  const { period_start, period_end, fertile_window_start, fertile_window_end, ovulation_day } =
    apiData.menstrual_calendar.current_cycle;

  // Normalizar datas para evitar problemas de fuso horário
  const normalizeDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Verificar se a data pertence ao mesmo mês do currentDate
  if (!isSameMonth(date, currentDate)) {
    return { isPeriod: false, isFertile: false, isOvulation: false, isPeriodStart: false, isPeriodEnd: false };
  }

  const isPeriod = date >= normalizeDate(period_start) && date <= normalizeDate(period_end);
  const isFertile = date >= normalizeDate(fertile_window_start) && date <= normalizeDate(fertile_window_end);
  const isOvulation = isSameDay(date, normalizeDate(ovulation_day));
  const isPeriodStart = isSameDay(date, normalizeDate(period_start));
  const isPeriodEnd = isSameDay(date, normalizeDate(period_end));

  return { isPeriod, isFertile, isOvulation, isPeriodStart, isPeriodEnd };
};

  // Use esta função para o dia selecionado
  const selectedDayStatus = getDayStatus(selectedDate);

{apiData?.menstrual_calendar.days.map((day, index) => {
  const date = new Date(day.date);
  const { isPeriod, isFertile, isOvulation, isPeriodStart, isPeriodEnd } = getDayStatus(date);
  const isSelected = isSameDay(date, selectedDate);
  const isToday = isSameDay(date, new Date());
  const isCurrentMonth = day.is_current_month;
  const hasEntry = apiData.moodLogs.some((log) => isSameDay(new Date(log.created_at), date));

  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.dayButton,
        !isCurrentMonth && styles.otherMonthDay,
        isSelected && styles.selectedDay,
        isPeriodStart && !isSelected && styles.periodStartDay,
        isPeriodEnd && !isSelected && styles.periodEndDay,
        isPeriod && !isPeriodStart && !isPeriodEnd && !isSelected && styles.periodDay,
        isFertile && !isPeriod && !isSelected && styles.fertileDay,
        isOvulation && !isSelected && styles.ovulationDay,
        isToday && !isSelected && styles.todayDay,
      ]}
      onPress={() => isCurrentMonth && setSelectedDate(date)} // Só seleciona se for do mês atual
    >
      <Text
        style={[
          styles.dayText,
          !isCurrentMonth && styles.otherMonthDayText,
          isSelected && styles.selectedDayText,
          isPeriodStart && !isSelected && styles.periodStartDayText,
          isPeriodEnd && !isSelected && styles.periodEndDayText,
          isPeriod && !isPeriodStart && !isPeriodEnd && !isSelected && styles.periodDayText,
          isFertile && !isPeriod && !isSelected && styles.fertileDayText,
          isOvulation && !isSelected && styles.ovulationDayText,
          isToday && !isSelected && styles.todayDayText,
        ]}
      >
        {day.day}
      </Text>
      {hasEntry && <View style={styles.entryIndicator} />}
    </TouchableOpacity>
  );
})}

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await calendar();
        console.log(data);
       // const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedFlow(null); 
  }, [selectedDate]);

  // Animation for content fade in
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

  // Animation for month change
  const animateMonthChange = (direction) => {
  Animated.timing(monthFadeAnim, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
  }).start(() => {
    const newMonth = direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    const isCurrentMonth = isSameMonth(newMonth, new Date());
    const newSelectedDate = isCurrentMonth ? new Date() : startOfMonth(newMonth);

    setCurrentDate(newMonth);
    setSelectedDate(newSelectedDate);

    calendarSlideAnim.setValue(direction === "next" ? width : -width);

    Animated.parallel([
      Animated.timing(calendarSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(monthFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  });
};

  const prevMonth = () => animateMonthChange('prev');
  const nextMonth = () => animateMonthChange('next');

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Animar o padrão geométrico
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(patternAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(patternAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start()
  }, [])

  // Inicializar animações para itens do histórico
  useEffect(() => {
    if (apiData?.moodLogs) {
      apiData.moodLogs.forEach(log => {
        const dateStr = new Date(log.created_at).toISOString();
        if (!historyItemAnims[dateStr]) {
          historyItemAnims[dateStr] = new Animated.Value(0);
        }
      });
    }
  }, [apiData]);

  // Substituir o componente GeometricPattern por um mais moderno e interativo
  const GeometricPattern = () => (
    <View style={styles.patternContainer}>
      <Animated.View
        style={[
          styles.patternElement,
          styles.patternCircle,
          {
            transform: [
              { translateX: patternAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) },
              { translateY: patternAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.patternElement,
          styles.patternTriangle,
          {
            transform: [{ rotate: patternAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.patternElement,
          styles.patternDot,
          {
            opacity: patternAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
          },
        ]}
      />
    </View>
  )

    const renderHistorySection = () => {
  if (!apiData?.moodLogs || apiData.moodLogs.length === 0) {
    return (
      <View style={styles.emptyHistoryContainer}>
        <Icon family="Feather" name="calendar" size={40} color="#555555" />
        <Text style={styles.emptyHistoryText}>Nenhum registro encontrado</Text>
        <Text style={styles.emptyHistorySubtext}>Registre seu humor diariamente na tela inicial</Text>
      </View>
    );
  }

  // Filtrar logs para o mês atual
  const currentMonthLogs = apiData.moodLogs.filter(log => {
    const logDate = new Date(log.created_at);
    return logDate.getMonth() === selectedDate.getMonth() && 
           logDate.getFullYear() === selectedDate.getFullYear();
  });

  if (currentMonthLogs.length === 0) {
    return (
      <View style={styles.emptyHistoryContainer}>
        <Icon family="Feather" name="calendar" size={40} color="#555555" />
        <Text style={styles.emptyHistoryText}>Nenhum registro encontrado para este mês</Text>
        <Text style={styles.emptyHistorySubtext}>Registre seu humor diariamente na tela inicial</Text>
      </View>
    );
  }

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Histórico de Mood</Text>
      
      {currentMonthLogs.map((log, index) => {
        const logDate = new Date(log.created_at);
        const dateStr = logDate.toISOString();
        const isExpanded = historyEntryExpanded === dateStr;
        const isSelected = isSameDay(logDate, selectedDate);

        // Extrair emoji do mood_with_emoji
        const moodEmoji = log.mood_with_emoji?.split(' ')[0] || '😐';
        const moodText = log.mood || 'Sem registro';

        return (
          <View key={log.id} style={[styles.historyItem, isSelected && styles.historyItemSelected]}>
            <TouchableOpacity 
              style={styles.historyItemHeader} 
              onPress={() => setHistoryEntryExpanded(isExpanded ? null : dateStr)}
            >
              <View style={styles.historyItemDate}>
                <Text style={styles.historyItemDateText}>{formatShortDate(logDate)}</Text>
              </View>

              <View style={styles.historyItemSummary}>
                <View style={styles.historyItemMood}>
                  <Text style={styles.historyItemMoodEmoji}>{moodEmoji}</Text>
                  <Text style={styles.historyItemMoodText}>{moodText}</Text>
                </View>
              </View>

              <Icon 
                family="Feather" 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={18} 
                color="#AAAAAA" 
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.historyItemDetails}>
                {log.descricao && (
                  <View style={styles.historyItemNotes}>
                    <Text style={styles.historyItemNotesTitle}>Notas:</Text>
                    <Text style={styles.historyItemNotesText}>{log.descricao}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}


  // Substituir o botão de hoje por um mais moderno
  const TodayButton = () => {
    return (
      <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
        <LinearGradient
          colors={["rgba(249, 168, 38, 0.2)", "rgba(249, 168, 38, 0.1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.todayButtonGradient}
        >
          <Text style={styles.todayButtonText}>Hoje</Text>
          <Icon family="Feather" name="calendar" size={14} color="#F9A826" style={styles.todayButtonIcon} />
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Adicionar um componente de cabeçalho de dia da semana mais moderno
  const WeekdayHeader = () => {
    const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"]

    return (
      <View style={styles.weekdayHeader}>
        {weekdays.map((day, index) => (
          <View key={index} style={styles.weekdayItem}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>
    )
  }

  // Adicionar um componente de legenda mais moderno
  const CalendarLegend = () => {
    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <LinearGradient colors={["#F9A826", "#F57F17"]} style={[styles.legendDot, styles.fertileLegendDot]} />
          <Text style={styles.legendText}>Hoje</Text>
        </View>

        <View style={styles.legendItem}>
          <LinearGradient colors={["#E57373", "#D32F2F"]} style={[styles.legendDot, styles.periodLegendDot]} />
          <Text style={styles.legendText}>Período Fértil</Text>
        </View>

        <View style={styles.legendItem}>
          <LinearGradient colors={["#FFFFFF", "#E0E0E0"]} style={[styles.legendDot, styles.ovulationLegendDot]} />
          <Text style={styles.legendText}>Ovulação</Text>
        </View>
      </View>
    )
  }

  // Atualizar o return do componente principal para usar os novos componentes
  return (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {loading || !apiData ? (
      <View style={styles.loadingContainer}>
       {/*  <ActivityIndicator size="large" color="#F9A826" /> */}
        <Text style={styles.loadingText}>Carregando calendário...</Text>
      </View>
    ) : (
      <>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.headerTitle}>Calendário</Text>
          <TodayButton />
          <GeometricPattern />
        </Animated.View>

        {/* Calendar Card */}
        <Animated.View style={[styles.calendarCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.monthNavButton} onPress={prevMonth}>
              <Icon family="Feather" name="chevron-left" size={20} color="#F9A826" />
            </TouchableOpacity>
            <Animated.View
              style={[styles.monthContainer, { opacity: monthFadeAnim, transform: [{ translateX: calendarSlideAnim }] }]}
            >
              <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>
            </Animated.View>
            <TouchableOpacity style={styles.monthNavButton} onPress={nextMonth}>
              <Icon family="Feather" name="chevron-right" size={20} color="#F9A826" />
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[styles.calendarGrid, { opacity: monthFadeAnim, transform: [{ translateX: calendarSlideAnim }] }]}
          >
            <WeekdayHeader />
            <View style={styles.daysGrid}>
             {apiData.menstrual_calendar.days.map((day, index) => {
  const date = new Date(day.date);
  const { isPeriod, isFertile, isOvulation, isPeriodStart, isPeriodEnd } = getDayStatus(date);
  const isSelected = isSameDay(date, selectedDate);
  const isToday = isSameDay(date, new Date());
  const isCurrentMonth = day.is_current_month;
  const hasEntry = apiData.moodLogs.some((log) => isSameDay(new Date(log.created_at), date));

  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.dayButton,
        !isCurrentMonth && styles.otherMonthDay,
        isSelected && styles.selectedDay,
        isPeriodStart && !isSelected && styles.periodStartDay,
        isPeriodEnd && !isSelected && styles.periodEndDay,
        isPeriod && !isPeriodStart && !isPeriodEnd && !isSelected && styles.periodDay,
        isFertile && !isPeriod && !isSelected && styles.fertileDay,
        isOvulation && !isSelected && styles.ovulationDay,
        isToday && !isSelected && styles.todayDay,
      ]}
      onPress={() => setSelectedDate(date)}
    >
      <Text
        style={[
          styles.dayText,
          !isCurrentMonth && styles.otherMonthDayText,
          isSelected && styles.selectedDayText,
          isPeriodStart && !isSelected && styles.periodStartDayText,
          isPeriodEnd && !isSelected && styles.periodEndDayText,
          isPeriod && !isPeriodStart && !isPeriodEnd && !isSelected && styles.periodDayText,
          isFertile && !isPeriod && !isSelected && styles.fertileDayText,
          isOvulation && !isSelected && styles.ovulationDayText,
          isToday && !isSelected && styles.todayDayText,
        ]}
      >
        {day.day}
      </Text>
      {hasEntry && <View style={styles.entryIndicator} />}
    </TouchableOpacity>
  );
})}
            </View>
            <CalendarLegend />
          </Animated.View>
        </Animated.View>

        {/* Selected Day Details */}
        <Animated.View style={[styles.dayDetailsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.dayDetailsHeader}>
            <Text style={styles.dayDetailsTitle}>{formatFullDate(selectedDate)}</Text>
          </View>
          <View style={styles.dayStatusContainer}>
            <View style={styles.dayStatusIconContainer}>
              {selectedDayStatus.isPeriod ? (
                <Text style={styles.dayStatusEmoji}>💧</Text>
              ) : selectedDayStatus.isFertile ? (
                <Text style={styles.dayStatusEmoji}>✨</Text>
              ) : selectedDayStatus.isOvulation ? (
                <Text style={styles.dayStatusEmoji}>🥚</Text>
              ) : (
                <Text style={styles.dayStatusEmoji}>📅</Text>
              )}
            </View>
            <Text style={styles.dayStatusText}>
              {selectedDayStatus.isPeriod
                ? "Você está no seu período menstrual"
                : selectedDayStatus.isFertile
                ? "Você está no seu período fértil"
                : selectedDayStatus.isOvulation
                ? "Dia de ovulação"
                : "Dia regular do seu ciclo"}
            </Text>
          </View>
        </Animated.View>

        {/* History Section */}
        {renderHistorySection()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </>
    )}
  </ScrollView>
);
}

// Atualizar os estilos para o novo design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 16,
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    flexDirection: "row",
    padding: 10,
  },
  patternElement: {
    margin: 4,
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
    borderBottomColor: "#E57373",
  },
  patternCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#F9A826",
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  todayButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  todayButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 14,
    color: "#F9A826",
    fontWeight: "600",
    marginRight: 6,
  },
  todayButtonIcon: {
    marginLeft: 2,
  },
  calendarCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  monthNavButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
  },
  monthContainer: {
    flex: 1,
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  calendarGrid: {
    padding: 16,
  },
  weekdayHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekdayItem: {
    width: 30,
    alignItems: "center",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#AAAAAA",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  emptyDay: {
    width: 36,
    height: 36,
    margin: 2,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    position: "relative",
  },
  dayText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: "#777777",
  },
  selectedDay: {
    backgroundColor: "#F9A826",
    ...Platform.select({
      ios: {
        shadowColor: "#F9A826",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selectedDayText: {
    color: "#121212",
    fontWeight: "bold",
  },
  periodDay: {
    backgroundColor: "rgba(229, 115, 115, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  periodDayText: {
    color: "#E57373",
  },
  fertileDay: {
    backgroundColor: "rgba(249, 168, 38, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  fertileDayText: {
    color: "#F9A826",
  },
  ovulationDay: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  ovulationDayText: {
    color: "#000000",
    fontWeight: "bold",
  },
  todayDay: {
    borderWidth: 2,
    borderColor: "#64B5F6",
  },
  todayDayText: {
    color: "#64B5F6",
    fontWeight: "bold",
  },
  periodIndicator: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E57373",
  },
  fertileIndicator: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F9A826",
  },
  ovulationIndicator: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  entryIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#64B5F6",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  periodLegendDot: {
    borderRadius: 6,
  },
  fertileLegendDot: {
    borderRadius: 6,
  },
  ovulationLegendDot: {
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#BBBBBB",
  },
  dayDetailsCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dayDetailsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  dayDetailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  dayDetailsContent: {
    padding: 16,
  },
  dayStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 12,
  },
  dayStatusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dayStatusEmoji: {
    fontSize: 18,
  },
  dayStatusText: {
    fontSize: 14,
    color: "#EEEEEE",
    flex: 1,
  },
  flowContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(229, 115, 115, 0.1)",
    padding: 16,
    borderRadius: 12,
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  flowButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flowButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    marginHorizontal: 4,
  },
  flowButtonContent: {
    alignItems: "center",
  },
  flowDropsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  flowDropIcon: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  flowButtonText: {
    fontSize: 14,
    color: "#BBBBBB",
  },
  flowButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  emptyHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    marginTop: 10,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: "#AAAAAA",
    marginTop: 16,
    textAlign: "center",
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
    textAlign: "center",
  },
  historyItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  historyItemSelected: {
    borderWidth: 1,
    borderColor: "#F9A826",
  },
  historyItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  historyItemDate: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  historyItemDateText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  historyItemSummary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  historyItemMood: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  historyItemMoodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  historyItemMoodText: {
    fontSize: 14,
    color: "#EEEEEE",
  },
  historyItemFlow: {
    backgroundColor: "rgba(229, 115, 115, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  historyItemFlowText: {
    fontSize: 12,
    color: "#E57373",
  },
  historyItemFlowEmoji: {
    fontSize: 10,
  },
  historyItemDetails: {
    padding: 12,
    paddingTop: 0,
    overflow: "hidden",
  },
  historyItemSymptoms: {
    marginBottom: 8,
  },
  historyItemSymptomsTitle: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 6,
  },
  historyItemSymptomsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  historyItemSymptomTag: {
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  historyItemSymptomText: {
    fontSize: 12,
    color: "#F9A826",
  },
  historyItemNotes: {
    marginTop: 8,
  },
  historyItemNotesTitle: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 4,
  },
  historyItemNotesText: {
    fontSize: 13,
    color: "#DDDDDD",
    fontStyle: "italic",
  },
  bottomSpacing: {
    height: 80,
  },

    periodDay: {
    backgroundColor: '#D32F2F', // Fundo vermelho para período
  },
  fertileDay: {
    backgroundColor: '#FFD54F', // Fundo amarelo para janela fértil
  },
  ovulationDay: {
    backgroundColor: '#FFFFFF', // Fundo branco para ovulação
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#F9A826',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  otherMonthDayText: {
    color: '#AAA',
  },
  loadingText:{
    color: "#fff",
  },
})

export default CalendarScreen