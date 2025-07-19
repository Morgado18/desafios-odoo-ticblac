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
  Pressable,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"
// Add import for TabIndicator at the top of the file
import TabIndicator from "./TabIndicator"
import { ancestralWisdom } from "../services/authed/main-service"

const { width } = Dimensions.get("window")

// Custom hook for animations
const useAnimatedValue = (initialValue = 0) => {
  return useRef(new Animated.Value(initialValue)).current
}

const WisdomScreen = () => {
  // State variables
  const [articlesData, setArticlesData] = useState([]);

  const [activeTab, setActiveTab] = useState("articles")
  const [expandedArticle, setExpandedArticle] = useState(null)
  const [tabsWidth, setTabsWidth] = useState(width)
  const [activeHerb, setActiveHerb] = useState(null)
  const [activeProverb, setActiveProverb] = useState(null)

  // Animation values
  const fadeAnim = useAnimatedValue(0)
  const slideAnim = useAnimatedValue(20)
  const tabIndicatorPosition = useAnimatedValue(0)
 // const articleExpandAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current
  const herbPulseAnims = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current
  const proverbRotateAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current
  const patternRotateAnim = useAnimatedValue(0)
   /*  const articleExpandAnims = useRef(
      articlesData.map(() => new Animated.Value(0))
    ).current; */
    const [articleExpandAnims, setArticleExpandAnims] = useState([]);
    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const response = await ancestralWisdom();
          const articles = response.ancestral_wisdom || [];
          setArticlesData(articles);
          setArticleExpandAnims(articles.map(() => new Animated.Value(0)));
        } catch (error) {
          console.log("Erro ao buscar artigos:", error);
        }
      };
      fetchArticles();
    }, []);

    //console.log(articlesData);
    

  // Toggle article expansion
  const toggleArticle = (index) => {
    const isExpanding = expandedArticle !== index

    // Animate the article expansion/collapse
   if (index >= 0 && index < articleExpandAnims.length && articleExpandAnims[index]) {
      Animated.timing(articleExpandAnims[index], {
        toValue: isExpanding ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    }

    setExpandedArticle(isExpanding ? index : null)
  }

  // Toggle herb highlight
  const toggleHerb = (index) => {
    setActiveHerb(activeHerb === index ? null : index)

    // Pulse animation for the herb
    Animated.sequence([
      Animated.timing(herbPulseAnims[index], {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(herbPulseAnims[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start()
  }

  // Toggle proverb highlight
  const toggleProverb = (index) => {
    setActiveProverb(activeProverb === index ? null : index)

    // Rotate animation for the proverb
    Animated.timing(proverbRotateAnims[index], {
      toValue: proverbRotateAnims[index]._value === 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }

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

    // Continuous rotation for the pattern
    Animated.loop(
      Animated.timing(patternRotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start()
  }, [])

  // Animation for tab change
  useEffect(() => {
    let position = 0
    if (activeTab === "herbs") position = 1
    else if (activeTab === "proverbs") position = 2

    Animated.timing(tabIndicatorPosition, {
      toValue: position,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [activeTab])

  // Tab indicator translation
  const translateX = tabIndicatorPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, width / 3, (width / 3) * 2],
  })

  // Pattern rotation
  const patternRotate = patternRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Articles data
  /* const articles = [
    {
      title: "O Ciclo Menstrual na Tradição Mumuila",
      excerpt: "As mulheres Mumuilas têm uma rica tradição de conhecimentos sobre o ciclo menstrual...",
      content: `As mulheres Mumuilas têm uma rica tradição de conhecimentos sobre o ciclo menstrual, transmitidos de geração em geração. Na cultura Mumuila, a menstruação é vista como um sinal de poder feminino e conexão com a terra. Durante o período menstrual, as mulheres Mumuilas tradicionalmente se reúnem para compartilhar conhecimentos e práticas de autocuidado. Elas utilizam ervas locais como folhas de abacateiro, que são fervidas para fazer um chá que alivia cólicas e regula o fluxo. Outro aspecto importante é a observação das fases da lua. As mulheres Mumuilas acreditam que o ciclo menstrual está intimamente ligado ao ciclo lunar, e muitas planejam atividades importantes com base nessa sincronização.`,
      icon: { family: "Feather", name: "moon" },
      iconColor: "#F9A826",
      emoji: "🌙",
    },
    {
      title: "Sabedoria das Mamãs da Ilha sobre Fertilidade",
      excerpt: "As mamãs da ilha de Luanda guardam conhecimentos ancestrais sobre fertilidade...",
      content: `As mamãs da ilha de Luanda guardam conhecimentos ancestrais sobre fertilidade que combinam observação da natureza, uso de plantas medicinais e rituais específicos. Este conhecimento tem sido preservado e transmitido oralmente por gerações.

Um dos principais ensinamentos é a observação do muco cervical. As mamãs da ilha ensinam as jovens a identificar as mudanças no muco ao longo do ciclo, reconhecendo o período fértil quando o muco se torna transparente e elástico, semelhante à clara de ovo.

Para aumentar as chances de concepção, recomendam uma mistura de gengibre fresco ralado com mel, tomada em jejum durante a fase folicular do ciclo. Esta mistura é considerada aquecedora e fortalecedora do útero.`,
      icon: { family: "Feather", name: "heart" },
      iconColor: "#E57373",
      emoji: "💗",
    },
    {
      title: "Ervas Tradicionais para Saúde Feminina",
      excerpt: "Angola possui uma rica biodiversidade de plantas medicinais usadas para cuidar da saúde feminina...",
      content: `Angola possui uma rica biodiversidade de plantas medicinais que têm sido usadas por gerações para cuidar da saúde feminina. Estas ervas são parte fundamental da medicina tradicional angolana.

O Alecrim (Rosmarinus officinalis) é amplamente utilizado para estimular a circulação sanguínea e aliviar cólicas menstruais. Pode ser preparado como chá ou usado em banhos de assento.

A Artemísia (Artemisia vulgaris), conhecida localmente como "muhangu", é tradicionalmente usada para regular o ciclo menstrual e aliviar sintomas da TPM. É geralmente preparada como infusão.`,
      icon: { family: "Feather", name: "feather" },
      iconColor: "#4CAF50",
      emoji: "🌿",
    },
  ] */

  // Herbs data
  const herbs = [
    {
      name: "Folhas de Abacateiro",
      uses: "Regula hormônios e alivia cólicas menstruais",
      preparation: "Ferva 3-4 folhas em água por 10 minutos. Beba uma xícara por dia.",
      icon: { family: "Feather", name: "leaf" },
      iconColor: "#4CAF50",
      emoji: "🥑",
      benefits: ["Alívio de cólicas", "Equilíbrio hormonal", "Redução de TPM"],
    },
    {
      name: "Gengibre",
      uses: "Aquece o útero e aumenta a fertilidade",
      preparation: "Rale gengibre fresco e misture com mel. Tome uma colher de chá em jejum.",
      icon: { family: "Feather", name: "sun" },
      iconColor: "#FF9800",
      emoji: "🌞",
      benefits: ["Aumento da fertilidade", "Melhora da circulação", "Redução de inflamação"],
    },
    {
      name: "Canela",
      uses: "Melhora a circulação na região pélvica",
      preparation: "Adicione canela em pau ao chá ou prepare como infusão.",
      icon: { family: "Feather", name: "heart" },
      iconColor: "#E57373",
      emoji: "❤️",
      benefits: ["Melhora da circulação", "Regulação do ciclo", "Alívio de cólicas"],
    },
  ]

  // Proverbs data
  const proverbs = [
    {
      proverb: "A mulher é como a lua, tem suas fases e ilumina a escuridão.",
      meaning: "Reconhece os ciclos naturais do corpo feminino e sua capacidade de trazer vida e luz.",
      origin: "Tradição Mumuila",
      emoji: "🌙",
      color: "#9C27B0",
    },
    {
      proverb: "O sangue que desce é o mesmo que nutre a vida.",
      meaning: "Celebra a menstruação como parte do ciclo que permite a fertilidade e a criação de nova vida.",
      origin: "Mamãs da Ilha",
      emoji: "🌊",
      color: "#E57373",
    },
    {
      proverb: "Quem conhece seu corpo, conhece seu caminho.",
      meaning: "Valoriza o autoconhecimento como ferramenta para saúde e bem-estar.",
      origin: "Sabedoria Angolana",
      emoji: "🧠",
      color: "#4CAF50",
    },
  ]

  // Componente de Padrão Geométrico Animado
  const GeometricPattern = () => (
    <Animated.View style={[styles.patternContainer, { transform: [{ rotate: patternRotate }] }]}>
      <View style={styles.patternRow}>
        <View style={[styles.patternElement, styles.patternTriangle]} />
        <View style={[styles.patternElement, styles.patternCircle]} />
        <View style={[styles.patternElement, styles.patternDot]} />
      </View>
      <View style={styles.patternRow}>
        <View style={[styles.patternElement, styles.patternDot]} />
        <View style={[styles.patternElement, styles.patternTriangle]} />
        <View style={[styles.patternElement, styles.patternCircle]} />
      </View>
      <View style={styles.patternRow}>
        <View style={[styles.patternElement, styles.patternCircle]} />
        <View style={[styles.patternElement, styles.patternDot]} />
        <View style={[styles.patternElement, styles.patternTriangle]} />
      </View>

      {/* Pontos invisíveis de posicionamento para alinhamento */}
      <View style={styles.invisibleAnchorPoint} />
      <View style={[styles.invisibleAnchorPoint, { top: "50%", left: "50%" }]} />
      <View style={[styles.invisibleAnchorPoint, { bottom: 0, right: 0 }]} />
    </Animated.View>
  )

  // Add getActiveTabIndex function
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "articles":
        return 0
      case "herbs":
        return 1
      case "proverbs":
        return 2
      default:
        return 0
    }
  }

  // Componente de Emoji Animado
  const AnimatedEmoji = ({ emoji, size = 24, style = {} }) => {
    const scaleAnim = useAnimatedValue(1)

    useEffect(() => {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic),
          }),
        ]),
      ).start()
    }, [])

    return <Animated.Text style={[{ fontSize: size, transform: [{ scale: scaleAnim }] }, style]}>{emoji}</Animated.Text>
  }

  // Componente de Gráfico de Benefícios
  const BenefitsChart = ({ benefits, color }) => {
    const barAnims = useRef(benefits.map(() => new Animated.Value(0))).current

    useEffect(() => {
      // Animate bars sequentially
      benefits.forEach((_, index) => {
        Animated.timing(barAnims[index], {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }).start()
      })
    }, [benefits])

    return (
      <View style={styles.chartContainer}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.chartRow}>
            <Text style={styles.chartLabel}>{benefit}</Text>
            <View style={styles.chartBarContainer}>
              <Animated.View
                style={[
                  styles.chartBar,
                  {
                    backgroundColor: color,
                    width: barAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", `${70 + Math.random() * 30}%`],
                    }),
                  },
                ]}
              />

              {/* Pontos invisíveis para alinhamento */}
              <View style={[styles.invisibleAnchorPoint, { left: "25%" }]} />
              <View style={[styles.invisibleAnchorPoint, { left: "50%" }]} />
              <View style={[styles.invisibleAnchorPoint, { left: "75%" }]} />
            </View>
          </View>
        ))}
      </View>
    )
  }

  // Render articles tab content
    const renderArticlesTab = () => {
    const iconData = [
      { family: "Feather", name: "moon", color: "#F9A826", emoji: "🌙" },
      { family: "Feather", name: "heart", color: "#E57373", emoji: "💗" },
      { family: "Feather", name: "feather", color: "#4CAF50", emoji: "🌿" },
    ];

    return (
      <View style={styles.tabContent}>
        {articlesData.map((article, index) => {
          const icon = iconData[index % iconData.length]; 
          const excerpt = article.conteudo ? article.conteudo/* .substring(0, 100) + "..." */ : "Sem descrição disponível...";
          return (
            <Pressable
              key={index}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => toggleArticle(index)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                    <Icon family={icon.family} name={icon.name} size={18} color={icon.color} />
                  </View>
                  <Text style={styles.cardTitle}>{article?.titulo}</Text>
                  <AnimatedEmoji emoji={icon.emoji} style={styles.titleEmoji} />
                </View>
              </View>
              <View style={styles.cardContent}>
                {expandedArticle === index ? (
                  <Animated.View
                    style={{
                      opacity: articleExpandAnims[index],
                      transform: [
                        {
                          translateY: articleExpandAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <Text style={styles.articleContent}>{article.content}</Text>
                    <View style={[styles.articleImagePlaceholder, { backgroundColor: `${icon.color}10` }]}>
                      <Icon family={icon.family} name={icon.name} size={40} color={icon.color} />
                      <AnimatedEmoji emoji={icon.emoji} size={40} style={{ marginLeft: 10 }} />
                      <View style={[styles.invisibleAnchorPoint, { top: "50%", left: "50%" }]} />
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.readButton,
                        { backgroundColor: `${icon.color}10`, borderColor: `${icon.color}30` },
                      ]}
                      onPress={() => toggleArticle(index)}
                    >
                      <Text style={[styles.readButtonText, { color: icon.color }]}>Mostrar menos</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ) : (
                  <View>
                    <Text style={styles.articleExcerpt}>{excerpt}</Text>
                   {/*  <TouchableOpacity
                      style={[styles.readMoreButton, { backgroundColor: `${icon.color}10` }]}
                      onPress={() => toggleArticle(index)}
                    >
                      <Text style={[styles.readMoreButtonText, { color: icon.color }]}>Ler mais</Text>
                      <Icon
                        family="Feather"
                        name="chevron-down"
                        size={16}
                        color={icon.color}
                        style={{ marginLeft: 5 }}
                      />
                    </TouchableOpacity> */}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  // Render herbs tab content
  const renderHerbsTab = () => {
    return (
      <View style={styles.tabContent}>
        {herbs.map((herb, index) => (
          <Animated.View key={index} style={[styles.card, { transform: [{ scale: herbPulseAnims[index] }] }]}>
            <Pressable
              style={({ pressed }) => [
                styles.cardInner,
                pressed && styles.cardPressed,
                activeHerb === index && styles.activeCard,
              ]}
              onPress={() => toggleHerb(index)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.iconContainer, { backgroundColor: `${herb.iconColor}20` }]}>
                    <Icon family={herb.icon.family} name={herb.icon.name} size={18} color={herb.iconColor} />
                  </View>
                  <Text style={styles.cardTitle}>{herb.name}</Text>
                  <AnimatedEmoji emoji={herb.emoji} style={styles.titleEmoji} />
                </View>
              </View>
              <View style={styles.cardContent}>
                <View style={[styles.herbImagePlaceholder, { backgroundColor: `${herb.iconColor}10` }]}>
                  <Icon family={herb.icon.family} name={herb.icon.name} size={40} color={herb.iconColor} />
                  <AnimatedEmoji emoji={herb.emoji} size={40} style={{ marginLeft: 10 }} />

                  {/* Pontos invisíveis para alinhamento */}
                  <View style={[styles.invisibleAnchorPoint, { top: "50%", left: "50%" }]} />
                </View>

                <View style={styles.herbInfoSection}>
                  <Text style={styles.herbInfoTitle}>Usos:</Text>
                  <Text style={styles.herbInfoText}>{herb.uses}</Text>
                </View>

                <View style={styles.herbInfoSection}>
                  <Text style={styles.herbInfoTitle}>Preparação:</Text>
                  <Text style={styles.herbInfoText}>{herb.preparation}</Text>
                </View>

                {activeHerb === index && (
                  <Animated.View
                    style={{
                      opacity: articleExpandAnims[index],
                      transform: [
                        {
                          translateY: articleExpandAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <Text style={[styles.herbInfoTitle, { marginTop: 16 }]}>Benefícios:</Text>
                    <BenefitsChart benefits={herb.benefits} color={herb.iconColor} />
                  </Animated.View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    )
  }

  // Render proverbs tab content
  const renderProverbsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Provérbios e Sabedoria Popular</Text>
          </View>
          <View style={styles.cardContent}>
            {proverbs.map((proverb, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.proverbContainer,
                  {
                    backgroundColor: `${proverb.color}10`,
                    borderColor: `${proverb.color}30`,
                  },
                  pressed && styles.proverbPressed,
                  activeProverb === index && styles.activeProverb,
                ]}
                onPress={() => toggleProverb(index)}
              >
                <View style={styles.proverbHeader}>
                  <AnimatedEmoji emoji={proverb.emoji} size={24} />
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: proverbRotateAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <Icon
                      family="Feather"
                      name={activeProverb === index ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={proverb.color}
                      style={{ marginLeft: "auto" }}
                    />
                  </Animated.View>
                </View>

                <Text style={[styles.proverbText, { color: proverb.color }]}>{proverb.proverb}</Text>

                {activeProverb === index && (
                  <Animated.View
                    style={{
                      opacity: proverbRotateAnims[index],
                      transform: [
                        {
                          translateY: proverbRotateAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <View style={styles.proverbInfoContainer}>
                      <Text style={styles.proverbInfoLabel}>Significado:</Text>
                      <Text style={styles.proverbInfoText}>{proverb.meaning}</Text>
                    </View>
                    <View style={styles.proverbInfoContainer}>
                      <Text style={styles.proverbInfoLabel}>Origem:</Text>
                      <Text style={styles.proverbInfoText}>{proverb.origin}</Text>
                    </View>

                    <View style={[styles.proverbDivider, { backgroundColor: `${proverb.color}30` }]} />

                    <View style={styles.proverbFooter}>
                      <TouchableOpacity style={[styles.proverbShareButton, { backgroundColor: `${proverb.color}20` }]}>
                        <Icon family="Feather" name="share-2" size={16} color={proverb.color} />
                        <Text style={[styles.proverbShareText, { color: proverb.color }]}>Compartilhar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.proverbFavoriteButton, { backgroundColor: `${proverb.color}20` }]}
                      >
                        <Icon family="Feather" name="heart" size={16} color={proverb.color} />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sabedoria Ancestral</Text>
          <Text style={styles.headerSubtitle}>Conhecimentos tradicionais para saúde feminina</Text>
        </View>
        <GeometricPattern />
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {/* Find the tabsHeader View and add onLayout event handler */}
        <View
          style={styles.tabsHeader}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout
            setTabsWidth(width)
          }}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "articles" && styles.activeTab]}
            onPress={() => setActiveTab("articles")}
          >
            <Icon
              family="Feather"
              name="book-open"
              size={16}
              color={activeTab === "articles" ? "#F9A826" : "#AAAAAA"}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === "articles" && styles.activeTabText]}>Artigos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "herbs" && styles.activeTab]}
            onPress={() => setActiveTab("herbs")}
          >
            <Icon
              family="Feather"
              name="feather"
              size={16}
              color={activeTab === "herbs" ? "#4CAF50" : "#AAAAAA"}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === "herbs" && [styles.activeTabText, { color: "#4CAF50" }]]}>
              Ervas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "proverbs" && styles.activeTab]}
            onPress={() => setActiveTab("proverbs")}
          >
            <Icon
              family="Feather"
              name="message-circle"
              size={16}
              color={activeTab === "proverbs" ? "#9C27B0" : "#AAAAAA"}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === "proverbs" && [styles.activeTabText, { color: "#9C27B0" }]]}>
              Provérbios
            </Text>
          </TouchableOpacity>

          {/* Replace the Animated.View with TabIndicator */}
          <TabIndicator
            activeTabIndex={getActiveTabIndex()}
            tabCount={3}
            containerWidth={tabsWidth}
            colors={["#F9A826", "#4CAF50", "#9C27B0"]}
          />
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {activeTab === "articles" && renderArticlesTab()}
          {activeTab === "herbs" && renderHerbsTab()}
          {activeTab === "proverbs" && renderProverbsTab()}
        </Animated.View>
      </View>

      {/* Bottom spacing for navigation bar */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Fundo escuro inspirado no padrão
    padding: 16,
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    width: 100,
    height: 100,
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
  invisibleAnchorPoint: {
    position: "absolute",
    width: 1,
    height: 1,
    backgroundColor: "transparent",
    top: 0,
    left: 0,
  },
  header: {
    marginBottom: 24,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
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
  headerContent: {
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF", // Texto branco para contraste
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
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
    color: "#AAAAAA", // Cinza claro para o texto inativo
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    width: width / 3 - 8,
    height: "100%",
    backgroundColor: "#3A3A3A", // Fundo um pouco mais claro para o indicador
    borderRadius: 8,
    top: 4,
    left: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#F9A826", // Amarelo/laranja do padrão
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    gap: 16,
  },
  card: {
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
  cardInner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.9,
    backgroundColor: "#333333",
  },
  activeCard: {
    borderColor: "#F9A826",
    borderWidth: 1,
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    flex: 1,
  },
  titleEmoji: {
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
    paddingTop: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para o texto
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readMoreButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  articleContent: {
    fontSize: 14,
    color: "#DDDDDD", // Cinza mais claro para o texto
    lineHeight: 20,
  },
  articleImagePlaceholder: {
    height: 150,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
    flexDirection: "row",
  },
  readButton: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  readButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  herbImagePlaceholder: {
    height: 120,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
    flexDirection: "row",
  },
  herbInfoSection: {
    marginBottom: 12,
  },
  herbInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    marginBottom: 4,
  },
  herbInfoText: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para o texto
    lineHeight: 20,
  },
  chartContainer: {
    marginTop: 8,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    width: "30%",
  },
  chartBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  chartBar: {
    height: "100%",
    borderRadius: 6,
  },
  proverbContainer: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  proverbPressed: {
    opacity: 0.9,
    backgroundColor: "rgba(249, 168, 38, 0.15)",
  },
  activeProverb: {
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.6)",
  },
  proverbHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  proverbText: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    color: "#F9A826", // Amarelo/laranja do padrão
    marginBottom: 8,
  },
  proverbInfoContainer: {
    marginTop: 8,
  },
  proverbInfoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
  },
  proverbInfoText: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para o texto
  },
  proverbDivider: {
    height: 1,
    backgroundColor: "rgba(249, 168, 38, 0.3)",
    marginVertical: 12,
  },
  proverbFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  proverbShareButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  proverbShareText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  proverbFavoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacing: {
    height: 80,
  },
})

export default WisdomScreen