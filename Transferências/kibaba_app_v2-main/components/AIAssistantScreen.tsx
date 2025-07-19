"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"
// Import the TabIndicator component
import TabIndicator from "./TabIndicator"

const { width } = Dimensions.get("window")

// Mock data for cycle tracking (similar to what we used in FertilityScreen)
const cycleData = {
  currentCycle: {
    startDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    length: 28,
    periodDays: [
      { date: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), flow: "Moderado" },
      { date: new Date(new Date().getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(), flow: "Intenso" },
      { date: new Date(new Date().getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), flow: "Intenso" },
      { date: new Date(new Date().getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(), flow: "Moderado" },
      { date: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), flow: "Leve" },
    ],
  },
  nextPeriod: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  fertileWindow: [
    new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    new Date(), // today
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  ],
}

// Helper function to format date
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${day}/${month}`
}

// Helper function to format time
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// Helper function to format full date in Portuguese
const formatFullDate = (date) => {
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

  return `${day} de ${month}`
}

const AIAssistantScreen = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("chat")
  const [tabsWidth, setTabsWidth] = useState(width)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá, eu sou Mwana, sua assistente de saúde feminina. Como posso ajudar você hoje?",
      timestamp: new Date(),
      suggestions: [
        "Como funciona meu ciclo menstrual?",
        "Quando é meu período fértil?",
        "O que significa muco cervical elástico?",
        "Dicas para aliviar cólicas menstruais",
      ],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Refs
  const scrollViewRef = useRef(null)

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

    // Start pulse animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start()
  }, [])

  // Get active tab index for TabIndicator
  const getActiveTabIndex = () => {
    return activeTab === "chat" ? 0 : 1
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages, isTyping])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      generateResponse(input)
      setIsTyping(false)
    }, 1500)
  }

  // Generate AI response based on user input
  const generateResponse = (userInput) => {
    const userInputLower = userInput.toLowerCase()
    let response = ""
    let suggestions = []

    // Simple pattern matching for responses
    if (userInputLower.includes("ciclo menstrual") || userInputLower.includes("como funciona")) {
      response =
        "O ciclo menstrual é o processo natural que o corpo feminino passa mensalmente para se preparar para uma possível gravidez. Um ciclo típico dura cerca de 28 dias, mas pode variar de 21 a 35 dias. O ciclo começa no primeiro dia da menstruação e termina no dia anterior à próxima menstruação. Durante o ciclo, seu corpo passa por várias fases, incluindo a fase folicular, ovulação e fase lútea."
      suggestions = ["O que acontece durante a ovulação?", "Por que meu ciclo é irregular?", "Como rastrear meu ciclo?"]
    } else if (
      userInputLower.includes("período fértil") ||
      userInputLower.includes("ovulação") ||
      userInputLower.includes("fertil")
    ) {
      const ovulationDay = cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)]
      response = `Seu período fértil atual é de ${formatDate(cycleData.fertileWindow[0])} a ${formatDate(cycleData.fertileWindow[cycleData.fertileWindow.length - 1])}, com ovulação prevista para ${formatFullDate(ovulationDay)}. Durante este período, a probabilidade de concepção é mais alta, especialmente nos 2-3 dias antes da ovulação e no dia da ovulação.`
      suggestions = [
        "Como aumentar minhas chances de engravidar?",
        "Como identificar a ovulação?",
        "O que é temperatura basal?",
      ]
    } else if (userInputLower.includes("muco") || userInputLower.includes("corrimento")) {
      response =
        "O muco cervical muda ao longo do ciclo menstrual. Durante o período fértil, especialmente próximo à ovulação, o muco torna-se mais claro, elástico e escorregadio, semelhante à clara de ovo. Esta mudança facilita a passagem dos espermatozoides. Observar essas mudanças pode ajudar a identificar seus dias mais férteis."
      suggestions = [
        "Como verificar o muco cervical?",
        "Outros sinais de fertilidade?",
        "O muco pode indicar problemas de saúde?",
      ]
    } else if (userInputLower.includes("cólica") || userInputLower.includes("dor")) {
      response =
        "Para aliviar cólicas menstruais, você pode tentar: aplicar calor na região abdominal, fazer exercícios leves como caminhada ou yoga, massagear o abdômen com movimentos circulares, tomar chá de gengibre ou camomila, e manter uma alimentação equilibrada. Na tradição Mumuila, o chá de folhas de abacateiro é usado para aliviar cólicas."
      suggestions = [
        "Remédios naturais para cólicas",
        "Quando devo procurar um médico?",
        "Exercícios para aliviar cólicas",
      ]
    } else if (userInputLower.includes("próxima menstruação") || userInputLower.includes("próximo período")) {
      response = `Sua próxima menstruação está prevista para começar em ${formatFullDate(cycleData.nextPeriod)}. Lembre-se que esta é uma previsão baseada nos seus ciclos anteriores e pode variar.`
      suggestions = [
        "Por que minha menstruação atrasou?",
        "Como me preparar para a menstruação?",
        "Sintomas pré-menstruais comuns",
      ]
    } else if (
      userInputLower.includes("tradicional") ||
      userInputLower.includes("ancestral") ||
      userInputLower.includes("mumuila")
    ) {
      response =
        "Na tradição das mulheres Mumuilas de Angola, o ciclo menstrual é visto como um sinal de poder feminino e conexão com a terra. Elas utilizam ervas locais como folhas de abacateiro para aliviar cólicas e regular o fluxo. Também observam as fases da lua, acreditando que o ciclo menstrual está intimamente ligado ao ciclo lunar."
      suggestions = ["Mais sobre remédios tradicionais", "Ritual da lua cheia", "Ervas para fertilidade"]
    } else if (
      userInputLower.includes("gravidez") ||
      userInputLower.includes("engravidar") ||
      userInputLower.includes("concepção")
    ) {
      response =
        "Para aumentar suas chances de concepção, é importante ter relações sexuais durante seu período fértil, especialmente 2-3 dias antes da ovulação. Manter um estilo de vida saudável, com alimentação equilibrada, exercícios regulares e redução do estresse também pode ajudar. Monitorar sua temperatura basal e observar mudanças no muco cervical são métodos naturais para identificar seu período mais fértil."
      suggestions = ["Como calcular meu período fértil?", "Sinais de ovulação", "Vitaminas para fertilidade"]
    } else {
      response =
        "Entendo sua pergunta. Como assistente especializada em saúde feminina, posso ajudar com informações sobre ciclo menstrual, fertilidade, sintomas e práticas tradicionais angolanas para saúde da mulher. Poderia elaborar um pouco mais sobre o que gostaria de saber?"
      suggestions = [
        "Como funciona meu ciclo menstrual?",
        "Quando é meu período fértil?",
        "Dicas para aliviar cólicas",
        "Tradições Mumuilas para saúde feminina",
      ]
    }

    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
      suggestions,
    }

    setMessages([...messages, assistantMessage])
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: suggestion,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      generateResponse(suggestion)
      setIsTyping(false)
    }, 1500)
  }

  // Componente de Padrão Geométrico
  const GeometricPattern = () => (
    <View style={styles.patternContainer}>
      <View style={styles.patternRow}>
        <View style={[styles.patternElement, styles.patternTriangle]} />
        <View style={[styles.patternElement, styles.patternCircle]} />
        <View style={[styles.patternElement, styles.patternDot]} />
      </View>
    </View>
  )

  // Render message bubble
  const renderMessage = (message, index) => {
    const isUser = message.role === "user"

    return (
      <View
        key={message.id}
        style={[styles.messageBubbleContainer, isUser ? styles.userMessageContainer : styles.assistantMessageContainer]}
      >
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.assistantMessageBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}>
            {message.content}
          </Text>

          <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.assistantMessageTime]}>
            {formatTime(message.timestamp)}
          </Text>

          {!isUser && message.suggestions && (
            <View style={styles.suggestionsContainer}>
              {message.suggestions.map((suggestion, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionClick(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    )
  }

  // Render chat tab content
  const renderChatTab = () => {
    return (
      <View style={styles.tabContent}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => renderMessage(message, index))}

          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDotMiddle]} />
                  <View style={styles.typingDot} />
                </View>
                <Text style={styles.typingText}>Mwana está digitando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isTyping && (
          <View style={styles.feedbackContainer}>
            <TouchableOpacity style={styles.feedbackButton}>
              <Icon family="Feather" name="thumbs-up" size={16} color="#F9A826" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton}>
              <Icon family="Feather" name="thumbs-down" size={16} color="#F9A826" />
            </TouchableOpacity>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Pergunte sobre seu ciclo, fertilidade, saúde..."
            placeholderTextColor="#777777"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.micButton}>
            <Icon family="Feather" name="mic" size={20} color="#F9A826" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!input.trim()}
          >
            <Icon family="Feather" name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    )
  }

  // Render insights tab content
  const renderInsightsTab = () => {
    return (
      <ScrollView
        style={styles.insightsContainer}
        contentContainerStyle={styles.insightsContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightCardGradient} />
          <View style={styles.insightCardHeader}>
            <Icon family="Feather" name="calendar" size={16} color="#F9A826" />
            <Text style={styles.insightCardTitle}>Seu Ciclo Atual</Text>
          </View>

          <View style={styles.insightCardContent}>
            <View style={styles.cycleInfoItem}>
              <View style={styles.cycleInfoItemLeft}>
                <Icon family="Feather" name="calendar" size={16} color="#F9A826" />
                <Text style={styles.cycleInfoItemText}>Duração do Ciclo</Text>
              </View>
              <Text style={styles.cycleInfoItemValue}>{cycleData.currentCycle.length} dias</Text>
            </View>

            <View style={styles.cycleInfoItem}>
              <View style={styles.cycleInfoItemLeft}>
                <Icon family="Feather" name="moon" size={16} color="#E57373" />
                <Text style={styles.cycleInfoItemText}>Próxima Menstruação</Text>
              </View>
              <Text style={styles.cycleInfoItemValue}>{formatDate(cycleData.nextPeriod)}</Text>
            </View>

            <View style={styles.cycleInfoItem}>
              <View style={styles.cycleInfoItemLeft}>
                <Icon family="Feather" name="droplet" size={16} color="#F9A826" />
                <Text style={styles.cycleInfoItemText}>Janela Fértil</Text>
              </View>
              <Text style={styles.cycleInfoItemValue}>
                {formatDate(cycleData.fertileWindow[0])} -{" "}
                {formatDate(cycleData.fertileWindow[cycleData.fertileWindow.length - 1])}
              </Text>
            </View>

            <View style={styles.cycleInfoItem}>
              <View style={styles.cycleInfoItemLeft}>
                <Icon family="Feather" name="star" size={16} color="#FFFFFF" />
                <Text style={styles.cycleInfoItemText}>Ovulação</Text>
              </View>
              <Text style={styles.cycleInfoItemValue}>
                {formatDate(cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)])}
              </Text>
            </View>
          </View>
        </View>

        {/* Traditional Wisdom Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightCardHeader}>
            <Text style={styles.insightCardTitle}>Sabedoria Tradicional</Text>
          </View>

          <View style={styles.insightCardContent}>
            <View style={styles.wisdomItem}>
              <View style={styles.wisdomIconContainer}>
                <Icon family="Feather" name="feather" size={16} color="#F9A826" />
              </View>
              <View style={styles.wisdomTextContainer}>
                <Text style={styles.wisdomTitle}>Chá de Folhas de Abacateiro</Text>
                <Text style={styles.wisdomDescription}>
                  Tradicionalmente usado pelas mulheres Mumuilas para aliviar cólicas e regular o ciclo menstrual.
                </Text>
              </View>
            </View>

            <View style={styles.wisdomItem}>
              <View style={styles.wisdomIconContainer}>
                <Icon family="Feather" name="moon" size={16} color="#F9A826" />
              </View>
              <View style={styles.wisdomTextContainer}>
                <Text style={styles.wisdomTitle}>Ritual da Lua Cheia</Text>
                <Text style={styles.wisdomDescription}>
                  As mamãs da ilha realizam rituais durante a lua cheia para potencializar a fertilidade.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightCardHeader}>
            <Text style={styles.insightCardTitle}>Perguntas Frequentes</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.insightCardContent}>
            <TouchableOpacity
              style={styles.faqButton}
              onPress={() => handleSuggestionClick("Como identificar meu período fértil?")}
            >
              <Icon family="Feather" name="info" size={12} color="#F9A826" />
              <Text style={styles.faqButtonText}>Como identificar meu período fértil?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.faqButton}
              onPress={() => handleSuggestionClick("O que causa cólicas menstruais?")}
            >
              <Icon family="Feather" name="info" size={12} color="#F9A826" />
              <Text style={styles.faqButtonText}>O que causa cólicas menstruais?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.faqButton}
              onPress={() => handleSuggestionClick("Como a lua afeta o ciclo menstrual?")}
            >
              <Icon family="Feather" name="info" size={12} color="#F9A826" />
              <Text style={styles.faqButtonText}>Como a lua afeta o ciclo menstrual?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerBold}>Nota:</Text> Mwana é uma assistente de IA treinada em saúde feminina e
            tradições angolanas. Suas respostas são baseadas em conhecimentos médicos e culturais, mas não substituem o
            aconselhamento médico profissional.
          </Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.assistantInfo}>
          <View style={styles.avatarContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>MW</Text>
              </View>
            </Animated.View>
            <View style={styles.statusIndicator} />
          </View>

          <View style={styles.assistantDetails}>
            <View style={styles.assistantNameContainer}>
              <Text style={styles.assistantName}>Mwana</Text>
              <Icon family="Feather" name="star" size={14} color="#F9A826" />
            </View>
            <Text style={styles.assistantRole}>Assistente de Saúde Feminina</Text>
          </View>
        </View>

        <View style={styles.aiSpecialistBadge}>
          <Text style={styles.aiSpecialistText}>IA Especializada</Text>
        </View>

        <GeometricPattern />
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View
          style={styles.tabsHeader}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout
            setTabsWidth(width)
          }}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "chat" && styles.activeTab]}
            onPress={() => setActiveTab("chat")}
          >
            <Text style={[styles.tabText, activeTab === "chat" && styles.activeTabText]}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "insights" && styles.activeTab]}
            onPress={() => setActiveTab("insights")}
          >
            <Text style={[styles.tabText, activeTab === "insights" && styles.activeTabText]}>Insights</Text>
          </TouchableOpacity>

          {/* Use the TabIndicator component */}
          <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={2} containerWidth={tabsWidth} />
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>{activeTab === "chat" ? renderChatTab() : renderInsightsTab()}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Fundo escuro inspirado no padrão
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
    borderBottomColor: "#E57373", // Vermelho do padrão
  },
  patternCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF", // Branco do padrão
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  assistantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(249, 168, 38, 0.2)", // Amarelo/laranja com transparência
    borderWidth: 2,
    borderColor: "rgba(249, 168, 38, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  statusIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981", // Verde para indicar online
    borderWidth: 2,
    borderColor: "#1E1E1E", // Borda da cor do fundo
  },
  assistantDetails: {
    justifyContent: "center",
  },
  assistantNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  assistantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Texto branco para contraste
  },
  assistantRole: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para o subtítulo
  },
  aiSpecialistBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  aiSpecialistText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  tabsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A", // Fundo escuro para as abas
    borderRadius: 10,
    padding: 4,
    position: "relative",
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 1,
  },
  activeTab: {
    // Active styling handled by the indicator
  },
  tabText: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para o texto inativo
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "bold",
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  // Chat Tab Styles
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContentContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageBubbleContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  assistantMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userMessageBubble: {
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
  },
  assistantMessageBubble: {
    backgroundColor: "#2A2A2A", // Fundo escuro para as mensagens do assistente
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#121212", // Texto escuro para contraste com o fundo amarelo
  },
  assistantMessageText: {
    color: "#FFFFFF", // Texto branco para contraste
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: "rgba(18, 18, 18, 0.7)", // Texto escuro com transparência
  },
  assistantMessageTime: {
    color: "#AAAAAA", // Cinza claro para o tempo
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: "#3A3A3A", // Fundo um pouco mais claro para os botões
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
  },
  suggestionText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  typingContainer: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A", // Fundo escuro para o indicador de digitação
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    marginRight: 3,
    opacity: 0.6,
  },
  typingDotMiddle: {
    opacity: 0.8,
  },
  typingText: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para o texto
  },
  feedbackContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },
  feedbackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A", // Fundo escuro para os botões
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    backgroundColor: "#2A2A2A", // Fundo escuro para o container de input
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
    backgroundColor: "#1E1E1E", // Fundo mais escuro para o input
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
  },
  sendButtonDisabled: {
    backgroundColor: "#3A3A3A", // Fundo mais escuro para o botão desativado
  },
  // Insights Tab Styles
  insightsContainer: {
    flex: 1,
  },
  insightsContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  insightCard: {
    backgroundColor: "#2A2A2A", // Fundo escuro para os cards
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  insightCardGradient: {
    height: 2,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
  },
  insightCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  insightCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    marginLeft: 8,
  },
  viewAllLink: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  insightCardContent: {
    padding: 16,
  },
  cycleInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1E1E1E", // Fundo mais escuro para os itens
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  cycleInfoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cycleInfoItemText: {
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
  },
  cycleInfoItemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
  },
  wisdomItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  wisdomIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  wisdomTextContainer: {
    flex: 1,
  },
  wisdomTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    marginBottom: 2,
  },
  wisdomDescription: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para a descrição
    lineHeight: 18,
  },
  faqButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
    backgroundColor: "#1E1E1E", // Fundo mais escuro para os botões
  },
  faqButtonText: {
    fontSize: 12,
    color: "#FFFFFF", // Texto branco para contraste
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A", // Cor mais escura para o separador
    marginVertical: 16,
  },
  disclaimerContainer: {
    paddingHorizontal: 4,
  },
  disclaimerText: {
    fontSize: 10,
    color: "#AAAAAA", // Cinza claro para o texto
    lineHeight: 16,
  },
  disclaimerBold: {
    fontWeight: "bold",
  },
})

export default AIAssistantScreen

