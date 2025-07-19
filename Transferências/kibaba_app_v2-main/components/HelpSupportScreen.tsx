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
  Platform,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"
// Add import for TabIndicator at the top of the file
import TabIndicator from "./TabIndicator"
import { sendFeedback } from "../services/authed/main-service"

const { width } = Dimensions.get("window")
const COLORS = {
  background: "#121212",
  card: "#1E1E1E",
  cardDark: "#181818",
  cardLight: "#252525",
  primary: "#F9A826",
  primaryLight: "rgba(249, 168, 38, 0.15)",
  primaryDark: "#E08A00",
  secondary: "#E57373",
  secondaryLight: "rgba(229, 115, 115, 0.15)",
  secondaryDark: "#C62828",
  tertiary: "#64B5F6",
  tertiaryLight: "rgba(100, 181, 246, 0.15)",
  tertiaryDark: "#1976D2",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textTertiary: "#666666",
  border: "#333333",
  borderLight: "#444444",
  success: "#4CAF50",
  successLight: "rgba(76, 175, 80, 0.15)",
  warning: "#FFC107",
  warningLight: "rgba(255, 193, 7, 0.15)",
  error: "#F44336",
  errorLight: "rgba(244, 67, 54, 0.15)",
  highlight: "#FFFFFF",
  highlightLight: "rgba(255, 255, 255, 0.15)",
  shadow: "#000000",
}
const HelpSupportScreen = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [expandedSupportFAQ, setExpandedSupportFAQ] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const categories = ["Sugestão de Melhoria", "Erro no App", "Informações", "Outro"];
  
  /* const [contactForm, setContactForm] = useState({
    category: selectedCategory,
    message: "",
  }) */
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  // Add state for tabsWidth
  const [tabsWidth, setTabsWidth] = useState(width)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current
  const successAnim = useRef(new Animated.Value(-100)).current

  // Paleta de cores refinada


  // FAQ data
  const faqCategories = [
    {
      title: "Ciclo Menstrual",
      questions: [
        {
          id: "cm1",
          question: "Como o aplicativo calcula meu ciclo menstrual?",
          answer:
            "O Kandimba utiliza um algoritmo avançado que analisa seus dados históricos de ciclo, incluindo duração, sintomas e padrões. Quanto mais você registrar seus dados, mais precisas serão as previsões. Nosso algoritmo também incorpora conhecimentos tradicionais angolanos sobre ciclos femininos.",
        },
        {
          id: "cm2",
          question: "Por que as previsões do meu ciclo estão incorretas?",
          answer:
            "As previsões podem variar devido a diversos fatores como estresse, mudanças na dieta, exercícios, medicamentos ou condições médicas. Se você notar que as previsões estão consistentemente incorretas, continue registrando seus dados regularmente para melhorar a precisão ou consulte um profissional de saúde para verificar se há alguma condição subjacente.",
        },
        {
          id: "cm3",
          question: "Posso editar dados de ciclos passados?",
          answer:
            "Sim, você pode editar dados de ciclos anteriores a qualquer momento. Vá para a visualização de calendário, selecione a data que deseja editar e faça as alterações necessárias. Isso ajudará a melhorar a precisão das previsões futuras.",
        },
      ],
    },
    {
      title: "Fertilidade",
      questions: [
        {
          id: "f1",
          question: "Como o Kandimba identifica meus dias férteis?",
          answer:
            "O Kandimba calcula sua janela fértil com base na duração média dos seus ciclos anteriores, estimando a ovulação aproximadamente 14 dias antes do início do próximo ciclo. A janela fértil inclui os 5 dias anteriores à ovulação e o dia da ovulação. Para maior precisão, o aplicativo também considera dados de temperatura basal e muco cervical, quando disponíveis.",
        },
        {
          id: "f2",
          question: "O que é o MPIQ e como funciona?",
          answer:
            "O MPIQ (Questionário de Identificação da Fase Menstrual) é uma ferramenta que ajuda a identificar em qual fase do ciclo você está atualmente. Ele faz perguntas sobre o número de dias desde o início da menstruação, consistência e aparência do muco cervical, e sensação vaginal. Com base nas respostas, o algoritmo determina se você está na fase folicular, ovulatória ou lútea.",
        },
        {
          id: "f3",
          question: "Posso usar o Kandimba como método contraceptivo?",
          answer:
            "Não, o Kandimba não deve ser usado como método contraceptivo. Embora o aplicativo forneça estimativas sobre seus dias férteis, estas são previsões baseadas em dados históricos e podem não ser 100% precisas. Se você deseja evitar a gravidez, consulte um profissional de saúde para discutir métodos contraceptivos adequados.",
        },
      ],
    },
    {
      title: "Sabedoria Tradicional",
      questions: [
        {
          id: "st1",
          question: "De onde vêm as tradições mencionadas no aplicativo?",
          answer:
            "As tradições e práticas mencionadas no Kandimba são principalmente das mulheres Mumuilas do sul de Angola e das mamãs da ilha de Luanda. Nossa equipe realizou extensas pesquisas de campo, entrevistando anciãs e curandeiras tradicionais para documentar e preservar este conhecimento ancestral sobre saúde feminina e fertilidade.",
        },
        {
          id: "st2",
          question: "Como posso saber mais sobre as tradições angolanas para saúde feminina?",
          answer:
            "O Kandimba oferece uma seção dedicada à 'Sabedoria Ancestral' onde você pode explorar artigos, remédios tradicionais e provérbios relacionados à saúde feminina. Além disso, nossa assistente Mwana pode responder perguntas específicas sobre tradições angolanas. Também recomendamos visitar a seção Comunidade, onde outras usuárias compartilham suas experiências com práticas tradicionais.",
        },
      ],
    },
    {
      title: "Conta e Privacidade",
      questions: [
        {
          id: "cp1",
          question: "Como excluir minha conta e dados?",
          answer:
            "Para excluir sua conta e dados, vá para Configurações > Privacidade > Excluir Minha Conta. Após confirmar, todos os seus dados pessoais serão permanentemente removidos de nossos sistemas em até 30 dias. Note que alguns dados anonimizados podem ser retidos para fins estatísticos, conforme descrito em nossa Política de Privacidade.",
        },
        {
          id: "cp2",
          question: "Meus dados são compartilhados com terceiros?",
          answer:
            "O Kandimba não vende seus dados pessoais. Compartilhamos dados apenas com prestadores de serviços que nos ajudam a operar o aplicativo, quando você opta por compartilhar informações na comunidade, ou se exigido por lei. Todos os dados de saúde são tratados com o mais alto nível de segurança e confidencialidade.",
        },
      ],
    },
  ]

  // Support FAQ data
  const supportFAQs = [
    {
      id: "s1",
      question: "Quanto tempo leva para receber uma resposta?",
      answer:
        "Normalmente respondemos e-mails em até 24 horas durante dias úteis. Para o chat ao vivo, o tempo de espera médio é de 5 minutos durante o horário comercial.",
    },
    {
      id: "s2",
      question: "Como reportar um problema técnico?",
      answer:
        "Para reportar problemas técnicos, use o formulário de contato e inclua: descrição detalhada do problema, passos para reproduzi-lo, modelo do dispositivo e versão do sistema operacional. Screenshots são muito úteis.",
    },
    {
      id: "s3",
      question: "Como solicitar um reembolso?",
      answer:
        "Para solicitar um reembolso de assinatura premium, envie um e-mail para reembolsos@kandimba.co.ao com o assunto 'Solicitação de Reembolso' e inclua seu ID de usuário e o motivo do reembolso. Processamos solicitações em até 5 dias úteis.",
    },
  ]

  // Tutorial data
  const tutorials = [
    /* {
      title: "Primeiros Passos com o Kandimba",
      description: "Aprenda a configurar seu perfil e começar a rastrear seu ciclo",
      type: "video",
      duration: "3:45",
    }, */
   /*  {
      title: "Monitorando sua Fertilidade",
      description: "Como usar os recursos de fertilidade para maximizar suas chances de concepção",
      type: "video",
      duration: "5:12",
    },
    {
      title: "Entendendo seus Dados",
      description: "Guia para interpretar gráficos e análises do seu ciclo",
      type: "article",
      readTime: "4 min",
    },
    {
      title: "Usando o Assistente Mwana",
      description: "Tire o máximo proveito da nossa assistente de IA especializada",
      type: "video",
      duration: "2:30",
    },
    {
      title: "Recursos de Sabedoria Tradicional",
      description: "Explorando o conhecimento ancestral angolano no aplicativo",
      type: "article",
      readTime: "6 min",
    }, */
  ]

  // Webinar data
  const webinars = [
    /* {
      title: "Entendendo seu Ciclo Menstrual",
      presenter: "Dra. Luísa Mendes",
      date: "15 de Abril, 19:00",
    },
    {
      title: "Sabedoria Tradicional Mumuila",
      presenter: "Teresa Nzinga",
      date: "22 de Abril, 18:30",
    }, */
  ]
  


  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqCategories

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

  // Animation for tab change
  useEffect(() => {
    let position = 0
    if (activeTab === "tutorials") position = 1
    else if (activeTab === "contact") position = 2

    Animated.timing(tabIndicatorPosition, {
      toValue: position,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [activeTab])

  // Animation for success message
  useEffect(() => {
    if (showSuccess) {
      Animated.spring(successAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()

      // Hide success message after 3 seconds
      setTimeout(() => {
        Animated.timing(successAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowSuccess(false))
      }, 3000)
    }
  }, [showSuccess])

  // Tab indicator translation
  const translateX = tabIndicatorPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, width / 3, (width / 3) * 2],
  })

  // Handle form submission
  const handleSubmitForm = async () => {
  try {
    if (!selectedCategory || !messageInput) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const feedbackData = {
      category: selectedCategory,
      message: messageInput,
    };

    const response = await sendFeedback(feedbackData);

    if (response.success) {
      alert(response.message);
      setMessageInput("");
      setSelectedCategory("");
      setShowSuccess(true);
    } else {
      if (response.message === 'Erro de validação') {
        const errors = response.errors;
        if (errors.category) {
          alert("Erro: Categoria é obrigatória!");
        } else if (errors.message) {
          alert("Erro: Mensagem é obrigatória!");
        } else {
          alert("Erro: Por favor, preencha todos os campos corretamente!");
        }
      } else if (response.message === 'Houve um erro ao enviar Feedback!') {
        alert("Erro: Não foi possível enviar o feedback. Tente novamente!");
      } else {
        alert("Erro: " + response.message);
      }
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message === 'Erro ao enviar Feedback') {
        alert("Erro no servidor: Não foi possível enviar o feedback.");
      } else {
        alert("Erro: " + error.response.data.message);
      }
    } else {
      alert("Erro de rede: Não foi possível conectar ao servidor.");
    }
  }
};

  // Toggle FAQ expansion
  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  // Toggle Support FAQ expansion
  const toggleSupportFAQ = (id) => {
    setExpandedSupportFAQ(expandedSupportFAQ === id ? null : id)
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

  // Add getActiveTabIndex function
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "faq":
        return 0
      case "tutorials":
        return 1
      case "contact":
        return 2
      default:
        return 0
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? "" : category)); 
  };

  // Render FAQ tab content
  const renderFAQTab = () => {
    return (
      <View style={styles.tabContent}>
        {searchQuery && filteredFAQs.length === 0 ? (
          <View style={styles.emptyResultsContainer}>
            <View style={styles.emptyResultsIconContainer}>
              <Icon family="Feather" name="help-circle" size={32} color="#F9A826" />
            </View>
            <Text style={styles.emptyResultsTitle}>Nenhum resultado encontrado</Text>
            <Text style={styles.emptyResultsText}>Não encontramos respostas para "{searchQuery}"</Text>
            <TouchableOpacity style={styles.emptyResultsButton} onPress={() => setActiveTab("contact")}>
              <Text style={styles.emptyResultsButtonText}>Entrar em Contato</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {filteredFAQs.map(
              (category, i) =>
                category.questions.length > 0 && (
                  <View key={i} style={styles.faqCategoryContainer}>
                    <View style={styles.faqCategoryHeader}>
                      <Text style={styles.faqCategoryTitle}>{category.title}</Text>
                    </View>
                    <View style={styles.faqList}>
                      {category.questions.map((faq) => (
                        <TouchableOpacity
                          key={faq.id}
                          style={styles.faqItem}
                          onPress={() => toggleFAQ(faq.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.faqQuestion}>
                            <Text style={styles.faqQuestionText}>{faq.question}</Text>
                            <Icon
                              family="Feather"
                              name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"}
                              size={18}
                              color="#F9A826"
                            />
                          </View>
                          {expandedFAQ === faq.id && (
                            <View style={styles.faqAnswer}>
                              <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ),
            )}

            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>Não encontrou o que procurava?</Text>
              <TouchableOpacity style={styles.contactButton} onPress={() => setActiveTab("contact")}>
                <Text style={styles.contactButtonText}>Entrar em Contato com Suporte</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    )
  }

  // Render tutorials tab content
  const renderTutorialsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.tutorialsContainer}>
         {/*  {tutorials.map((tutorial, i) => (
            <View key={i} style={styles.tutorialCard}>
              <View style={styles.tutorialIconContainer}>
                <Icon
                  family="Feather"
                  name={tutorial.type === "video" ? "video" : "file-text"}
                  
                  size={24}
                  color="#F9A826"
                />
              </View>
              <View style={styles.tutorialContent}>
                <View style={styles.tutorialHeader}>
                  <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                  <View style={styles.tutorialBadge}>
                    <Text style={styles.tutorialBadgeText}>
                      {tutorial.type === "video" ? tutorial.duration : tutorial.readTime}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
                <TouchableOpacity style={styles.tutorialButton}>
                  <Text style={styles.tutorialButtonText}>Ver tutorial</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))} */}
          <View style={styles.tutorialCard}>
              <View style={styles.tutorialIconContainer}>
                <Icon
                  family="Feather"
                  name={"video"}
                  size={24}
                  color="#F9A826"
                />
              </View>
              <View style={styles.tutorialContent}>
                <View style={styles.tutorialHeader}>
                  <Text style={styles.tutorialTitle}>Tutoriais Indisponível</Text>
                 {/*  <View style={styles.tutorialBadge}>
                    <Text style={styles.tutorialBadgeText}>
                      {tutorial.type === "video" ? tutorial.duration : tutorial.readTime}
                    </Text>
                  </View> */}
                </View>
               {/*  <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
                <TouchableOpacity style={styles.tutorialButton}>
                  <Text style={styles.tutorialButtonText}>Ver tutorial</Text>
                </TouchableOpacity> */}
              </View>
            </View>
        </View>

        <View style={styles.webinarsContainer}>
          <View style={styles.webinarsHeader}>
            <Text style={styles.webinarsTitle}>Webinars e Workshops</Text>
            <Text style={styles.webinarsSubtitle}>Aprenda com especialistas em saúde feminina</Text>
          </View>
          <View style={styles.webinarsList}>
           {/*  {webinars.map((webinar, i) => ( */}
              <View style={styles.webinarItem}>
                <View style={styles.webinarInfo}>
                  <Text style={styles.webinarTitle}>Ainda sem eventos</Text>
                  {/* <Text style={styles.webinarPresenter}>Ainda sem eventos</Text>
                  <View style={styles.webinarDateBadge}>
                    <Text style={styles.webinarDateText}>Ainda sem eventos</Text>
                  </View> */}
                </View>
{/*                 <TouchableOpacity style={styles.webinarButton}>
                  <Text style={styles.webinarButtonText}>Inscrever-se</Text>
                </TouchableOpacity> */}
              </View>
          {/*  ))} */}
          </View>
          {/* <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver todos os eventos</Text>
            <Icon family="Feather" name="chevron-right" size={16} color="#F9A826" />
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }

  // Render contact tab content
  const renderContactTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.contactMethodsContainer}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactTitle}>Entre em Contato</Text>
            <Text style={styles.contactSubtitle}>Nossa equipe está pronta para ajudar</Text>
          </View>
          <View style={styles.contactMethods}>
            <View style={styles.contactMethod}>
              <View style={styles.contactMethodIconContainer}>
                <Icon family="Feather" name="message-circle" size={20} color="#F9A826" />
              </View>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodTitle}>Chat ao Vivo</Text>
                <Text style={styles.contactMethodDescription}>{/* Disponível de segunda a sexta, 8h às 18h */}Indisponível</Text>
              </View>
              <TouchableOpacity style={styles.contactMethodButton}>
                <Text style={styles.contactMethodButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactMethod}>
              <View style={styles.contactMethodIconContainer}>
                <Icon family="Feather" name="mail" size={20} color="#F9A826" />
              </View>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodTitle}>E-mail</Text>
                <Text style={styles.contactMethodDescription}>alexandramicaela22@gmail.com</Text>
                <Text style={styles.contactMethodDescription}>Resposta em até 24 horas</Text>
              </View>
              {/* <TouchableOpacity style={styles.contactMethodButtonOutline}>
                <Text style={styles.contactMethodButtonOutlineText}>Enviar</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.contactMethod}>
              <View style={styles.contactMethodIconContainer}>
                <Icon family="Feather" name="phone" size={20} color="#F9A826" />
              </View>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodTitle}>Telefone</Text>
                <Text style={styles.contactMethodDescription}>{/* +244 923 456 789 */}Indisponível</Text>
              </View>
             {/*  <TouchableOpacity style={styles.contactMethodButtonOutline}>
                <Text style={styles.contactMethodButtonOutlineText}>Ligar</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View style={styles.contactFormContainer}>
          <View style={styles.contactFormHeader}>
            <Text style={styles.contactFormTitle}>Envie um Feedback</Text>
          </View>
          <View style={styles.contactForm}>
           {/*  <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nome</Text>
              <TextInput
                style={styles.formInput}
                value={contactForm.name}
                onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
                placeholderTextColor="#777777"
              />
            </View> */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categorias</Text>
              {/* <TextInput
                style={styles.formInput}
                value={contactForm.email}
                onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
                keyboardType="email-address"
                placeholderTextColor="#777777"
              /> */}
               <View style={styles.formCategory}>
                {categories.map((category) => (
                  <TouchableOpacity
                  key={category}
                  style={[
                    styles.radioButton,
                    selectedCategory === category && styles.radioButtonSelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                  accessible={true}
                  accessibilityLabel={category}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedCategory === category }}
                >
                  <Text
                    style={[
                      styles.radioText,
                      selectedCategory === category && styles.radioTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Assunto</Text>
              <TextInput
                style={styles.formInput}
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                placeholderTextColor="#777777"
              />
            </View> */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Mensagem</Text>
              <TextInput
                style={styles.formTextArea}
                value={messageInput}
                placeholder="Descreva a sua mensagem aqui..."
                onChangeText={(text) => setMessageInput(text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#777777"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
              <Text style={styles.submitButtonText}>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.supportFAQContainer}>
          <View style={styles.supportFAQHeader}>
            <Text style={styles.supportFAQTitle}>Perguntas Frequentes de Suporte</Text>
          </View>
          <View style={styles.supportFAQList}>
            {supportFAQs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.supportFAQItem}
                onPress={() => toggleSupportFAQ(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.supportFAQQuestion}>
                  <Text style={styles.supportFAQQuestionText}>{faq.question}</Text>
                  <Icon
                    family="Feather"
                    name={expandedSupportFAQ === faq.id ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#F9A826"
                  />
                </View>
                {expandedSupportFAQ === faq.id && (
                  <View style={styles.supportFAQAnswer}>
                    <Text style={styles.supportFAQAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferFAQContainer}>
          <Text style={styles.preferFAQText}>Prefere resolver sozinha?</Text>
          <TouchableOpacity style={styles.preferFAQButton} onPress={() => setActiveTab("faq")}>
            <Text style={styles.preferFAQButtonText}>Consultar FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Success notification */}
      {showSuccess && (
        <Animated.View style={[styles.successNotification, { transform: [{ translateY: successAnim }] }]}>
          <Icon family="Feather" name="check-circle" size={16} color="#F9A826" />
          <Text style={styles.successNotificationText}>{successMessage}</Text>
        </Animated.View>
      )}

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>Ajuda & Suporte</Text>
        <GeometricPattern />
      </Animated.View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon family="Feather" name="search" size={16} color="#AAAAAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ajuda..."
          placeholderTextColor="#777777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
            style={[styles.tab, activeTab === "faq" && styles.activeTab]}
            onPress={() => setActiveTab("faq")}
          >
            <Text style={[styles.tabText, activeTab === "faq" && styles.activeTabText]}>FAQ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "tutorials" && styles.activeTab]}
            onPress={() => setActiveTab("tutorials")}
          >
            <Text style={[styles.tabText, activeTab === "tutorials" && styles.activeTabText]}>Tutoriais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "contact" && styles.activeTab]}
            onPress={() => setActiveTab("contact")}
          >
            <Text style={[styles.tabText, activeTab === "contact" && styles.activeTabText]}>Contato</Text>
          </TouchableOpacity>

          {/* Replace the Animated.View with TabIndicator */}
          <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={3} containerWidth={tabsWidth} />
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {activeTab === "faq" && renderFAQTab()}
          {activeTab === "tutorials" && renderTutorialsTab()}
          {activeTab === "contact" && renderContactTab()}
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
  successNotification: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: "#2A2A2A", // Fundo escuro para a notificação
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#F9A826", // Amarelo/laranja do padrão
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
    zIndex: 100,
  },
  successNotificationText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  header: {
    marginBottom: 16,
    position: "relative",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // Texto branco para contraste
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A", // Fundo escuro para a barra de pesquisa
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
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
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
  },
  activeTab: {
    // Active styling handled by the indicator
  },
  tabText: {
    fontSize: 14,
    color: "#AAAAAA",
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
  // FAQ Tab Styles
  faqCategoryContainer: {
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
  faqCategoryHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  faqCategoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  faqList: {
    padding: 16,
  },
  faqItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
    paddingBottom: 12,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    marginTop: 8,
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 20,
  },
  notFoundContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  contactButton: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#2A2A2A",
  },
  contactButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  emptyResultsContainer: {
    backgroundColor: "#2A2A2A", // Fundo escuro para os cards
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
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
  emptyResultsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyResultsText: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyResultsButton: {
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptyResultsButtonText: {
    fontSize: 14,
    color: "#121212", // Texto escuro para contraste
    fontWeight: "500",
  },
  // Tutorials Tab Styles
  tutorialsContainer: {
    marginBottom: 16,
  },
  tutorialCard: {
    backgroundColor: "#2A2A2A", // Fundo escuro para os cards
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 12,
    flexDirection: "row",
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
  tutorialIconContainer: {
    width: 80,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialContent: {
    flex: 1,
    padding: 12,
  },
  tutorialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  tutorialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#1E1E1E",
  },
  tutorialBadgeText: {
    fontSize: 10,
    color: "#AAAAAA",
  },
  tutorialDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  tutorialButton: {
    alignSelf: "flex-start",
  },
  tutorialButtonText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  webinarsContainer: {
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
  webinarsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  webinarsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  webinarsSubtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  webinarsList: {
    padding: 16,
  },
  webinarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    marginBottom: 8,
  },
  webinarInfo: {
    flex: 1,
    marginRight: 8,
  },
  webinarTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  webinarPresenter: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  webinarDateBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#1E1E1E",
    marginTop: 4,
  },
  webinarDateText: {
    fontSize: 10,
    color: "#AAAAAA",
  },
  webinarButton: {
    borderWidth: 1,
    borderColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  webinarButtonText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },
  viewAllButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
    marginRight: 4,
  },
  // Contact Tab Styles
  contactMethodsContainer: {
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
  contactHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  contactSubtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  contactMethods: {
    padding: 16,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    marginBottom: 8,
  },
  contactMethodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactMethodInfo: {
    flex: 1,
  },
  contactMethodTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  contactMethodDescription: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  contactMethodButton: {
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactMethodButtonText: {
    fontSize: 12,
    color: "#121212", // Texto escuro para contraste
    fontWeight: "500",
  },
  contactMethodButtonOutline: {
    borderWidth: 1,
    borderColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactMethodButtonOutlineText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  contactFormContainer: {
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
  contactFormHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  contactFormTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  contactForm: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formCategory:{
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#1E1E1E",
  },
  formTextArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#1E1E1E",
  },
  submitButton: {
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#121212", // Texto escuro para contraste
    fontSize: 14,
    fontWeight: "600",
  },
  supportFAQContainer: {
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
  supportFAQHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  supportFAQTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  supportFAQList: {
    padding: 16,
  },
  supportFAQItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
    paddingBottom: 12,
  },
  supportFAQQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  supportFAQQuestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  supportFAQAnswer: {
    marginTop: 8,
  },
  supportFAQAnswerText: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 20,
  },
  preferFAQContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  preferFAQText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  preferFAQButton: {
    borderWidth: 1,
    borderColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#2A2A2A",
  },
  preferFAQButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 80,
  },

   radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 10,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  radioText: {
    color: COLORS.textSecondary,
  },
  radioTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
})

export default HelpSupportScreen
