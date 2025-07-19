"use client"

import React, { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Platform } from "react-native"
import { Icon } from "../App"

const { width } = Dimensions.get("window")

const PrivacyTermsScreen = () => {
  const [activeTab, setActiveTab] = useState("privacy")
  const [expandedAccordions, setExpandedAccordions] = useState({})
  const scrollViewRef = useRef(null)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const [lastUpdated] = useState("15 de Março de 2025")

  // Animação para troca de tabs
  const handleTabChange = (tab) => {
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
    ]).start()

    setActiveTab(tab)
    setExpandedAccordions({})

    // Scroll para o topo quando mudar de tab
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  // Toggle para os acordeões
  const toggleAccordion = (id) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Componente de Acordeão
  const Accordion = ({ id, title, children }) => {
    const isExpanded = expandedAccordions[id] || false
    const heightAnim = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }, [isExpanded])

    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleAccordion(id)} activeOpacity={0.7}>
          <Text style={styles.accordionTitle}>{title}</Text>
          <Icon family="Feather" name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#F9A826" />
        </TouchableOpacity>
        {isExpanded && (
          <Animated.View
            style={[
              styles.accordionContent,
              {
                opacity: heightAnim,
                maxHeight: heightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                }),
              },
            ]}
          >
            {children}
          </Animated.View>
        )}
      </View>
    )
  }

  // Componente de Alerta
  const Alert = ({ type = "info", title, description, icon }) => {
    const bgColor = type === "destructive" ? "#3A3A3A" : "#3A3A3A"
    const textColor = type === "destructive" ? "#E57373" : "#FFFFFF"
    const iconColor = type === "destructive" ? "#E57373" : "#F9A826"

    return (
      <View style={[styles.alert, { backgroundColor: bgColor }]}>
        <View style={styles.alertIconContainer}>
          <Icon family="Feather" name={icon} size={16} color={iconColor} />
        </View>
        <View style={styles.alertContent}>
          <Text style={[styles.alertTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.alertDescription, { color: textColor }]}>{description}</Text>
        </View>
      </View>
    )
  }

  // Componente de Card
  const Card = ({ title, description, children, icon }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {icon && (
            <View style={styles.cardIconContainer}>
              <Icon family="Feather" name={icon} size={16} color="#F9A826" />
            </View>
          )}
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            {description && <Text style={styles.cardDescription}>{description}</Text>}
          </View>
        </View>
        <View style={styles.cardContent}>{children}</View>
      </View>
    )
  }

  // Componente de Separador
  const Separator = () => <View style={styles.separator} />

  // Componente de Lista com Bullets
  const BulletList = ({ items }) => (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )

  // Componente de Botão
  const Button = ({ title, variant = "primary", onPress, icon, fullWidth = false }) => {
    const buttonStyles = [
      styles.button,
      variant === "outline" && styles.buttonOutline,
      variant === "destructive" && styles.buttonDestructive,
      fullWidth && styles.buttonFullWidth,
    ]

    const textStyles = [
      styles.buttonText,
      variant === "outline" && styles.buttonOutlineText,
      variant === "destructive" && styles.buttonDestructiveText,
    ]

    return (
      <TouchableOpacity style={buttonStyles} onPress={onPress} activeOpacity={0.7}>
        {icon && (
          <Icon
            family="Feather"
            name={icon}
            size={16}
            color={variant === "primary" ? "#fff" : variant === "destructive" ? "#E57373" : "#F9A826"}
            style={styles.buttonIcon}
          />
        )}
        <Text style={textStyles}>{title}</Text>
      </TouchableOpacity>
    )
  }

  // Componente de Item de Verificação
  const CheckItem = ({ text }) => (
    <View style={styles.checkItem}>
      <Text style={styles.checkItemText}>{text}</Text>
      <Icon family="Feather" name="check-circle" size={16} color="#F9A826" />
    </View>
  )

  // Componente de Item de Segurança
  const SecurityItem = ({ icon, title, description }) => (
    <View style={styles.securityItem}>
      <View style={styles.securityIconContainer}>
        <Icon family="Feather" name={icon} size={16} color="#F9A826" />
      </View>
      <View style={styles.securityContent}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securityDescription}>{description}</Text>
      </View>
    </View>
  )

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GeometricPattern />
        <Text style={styles.headerTitle}>Privacidade & Termos</Text>
      </View>

      <Alert
        icon="alert-circle"
        title="Atualização recente"
        description={`Nossa política de privacidade foi atualizada em ${lastUpdated}. Por favor, revise as mudanças.`}
      />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "privacy" && styles.activeTab]}
          onPress={() => handleTabChange("privacy")}
        >
          <Text style={[styles.tabText, activeTab === "privacy" && styles.activeTabText]}>Privacidade</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "terms" && styles.activeTab]}
          onPress={() => handleTabChange("terms")}
        >
          <Text style={[styles.tabText, activeTab === "terms" && styles.activeTabText]}>Termos de Uso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "data" && styles.activeTab]}
          onPress={() => handleTabChange("data")}
        >
          <Text style={[styles.tabText, activeTab === "data" && styles.activeTabText]}>Seus Dados</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {activeTab === "privacy" && (
            <View style={styles.tabContent}>
              <Card title="Política de Privacidade" description={`Última atualização: ${lastUpdated}`} icon="shield">
                <Text style={styles.cardText}>
                  A Kandimba está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como
                  coletamos, usamos, divulgamos e protegemos suas informações pessoais.
                </Text>

                <Accordion id="privacy-1" title="Informações que Coletamos">
                  <Text style={styles.accordionText}>Coletamos as seguintes informações:</Text>
                  <BulletList
                    items={[
                      "Informações de registro (nome, e-mail, data de nascimento)",
                      "Dados do ciclo menstrual e sintomas",
                      "Informações de fertilidade e temperatura basal",
                      "Dados de uso do aplicativo",
                      "Informações do dispositivo",
                    ]}
                  />
                </Accordion>

                <Accordion id="privacy-2" title="Como Usamos Suas Informações">
                  <Text style={styles.accordionText}>Utilizamos suas informações para:</Text>
                  <BulletList
                    items={[
                      "Fornecer e melhorar nossos serviços",
                      "Personalizar sua experiência",
                      "Gerar previsões e análises sobre seu ciclo",
                      "Enviar notificações relevantes",
                      "Pesquisa e análise (dados anonimizados)",
                    ]}
                  />
                </Accordion>

                <Accordion id="privacy-3" title="Compartilhamento de Dados">
                  <Text style={styles.accordionText}>
                    Não vendemos suas informações pessoais. Compartilhamos dados apenas:
                  </Text>
                  <BulletList
                    items={[
                      "Com prestadores de serviços que nos ajudam a operar o aplicativo",
                      "Quando você optar por compartilhar informações na comunidade",
                      "Se exigido por lei ou para proteger direitos legais",
                    ]}
                  />
                </Accordion>

                <Accordion id="privacy-4" title="Segurança de Dados">
                  <Text style={styles.accordionText}>
                    Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações,
                    incluindo:
                  </Text>
                  <BulletList
                    items={[
                      "Criptografia de dados em trânsito e em repouso",
                      "Controles de acesso rigorosos",
                      "Monitoramento regular de segurança",
                      "Treinamento de funcionários em práticas de privacidade",
                    ]}
                  />
                </Accordion>

                <Accordion id="privacy-5" title="Seus Direitos">
                  <Text style={styles.accordionText}>Você tem direito a:</Text>
                  <BulletList
                    items={[
                      "Acessar seus dados pessoais",
                      "Corrigir informações imprecisas",
                      "Excluir seus dados (direito ao esquecimento)",
                      "Restringir ou opor-se ao processamento",
                      "Solicitar a portabilidade dos dados",
                      "Retirar o consentimento a qualquer momento",
                    ]}
                  />
                </Accordion>

                <Accordion id="privacy-6" title="Retenção de Dados">
                  <Text style={styles.accordionText}>
                    Mantemos seus dados pessoais apenas pelo tempo necessário para os fins descritos nesta política, a
                    menos que um período de retenção mais longo seja exigido por lei.
                  </Text>
                  <Text style={[styles.accordionText, { marginTop: 8 }]}>
                    Se você excluir sua conta, seus dados pessoais serão removidos de nossos sistemas ativos dentro de
                    30 dias.
                  </Text>
                </Accordion>

                <View style={styles.buttonContainer}>
                  <Button title="Política Completa" variant="outline" />
                </View>
              </Card>

              <Card title="Proteção de Dados Sensíveis" icon="lock">
                <Text style={styles.cardText}>
                  Reconhecemos que os dados de saúde feminina são particularmente sensíveis. Implementamos proteções
                  adicionais para esses dados:
                </Text>
                <BulletList
                  items={[
                    "Criptografia avançada para dados de saúde",
                    "Acesso restrito apenas a pessoal autorizado",
                    "Anonimização de dados usados para pesquisa",
                    "Opções de privacidade granulares para compartilhamento",
                  ]}
                />
              </Card>
            </View>
          )}

          {activeTab === "terms" && (
            <View style={styles.tabContent}>
              <Card title="Termos de Uso" description={`Última atualização: ${lastUpdated}`} icon="file-text">
                <Text style={styles.cardText}>
                  Ao usar o aplicativo Kandimba, você concorda com estes Termos de Uso. Por favor, leia-os
                  cuidadosamente.
                </Text>

                <Accordion id="terms-1" title="Uso do Serviço">
                  <Text style={styles.accordionText}>Você concorda em:</Text>
                  <BulletList
                    items={[
                      "Fornecer informações precisas durante o registro",
                      "Usar o serviço apenas para fins legais e pessoais",
                      "Não compartilhar sua conta com terceiros",
                      "Não tentar acessar o serviço por meios não autorizados",
                      "Respeitar os direitos de outros usuários",
                    ]}
                  />
                </Accordion>

                <Accordion id="terms-2" title="Conteúdo do Usuário">
                  <Text style={styles.accordionText}>Ao publicar conteúdo na comunidade Kandimba:</Text>
                  <BulletList
                    items={[
                      "Você mantém a propriedade de seu conteúdo",
                      "Concede à Kandimba licença para usar, exibir e distribuir o conteúdo",
                      "É responsável pelo conteúdo que publica",
                      "Não deve publicar conteúdo ofensivo, ilegal ou que viole direitos de terceiros",
                    ]}
                  />
                </Accordion>

                <Accordion id="terms-3" title="Limitação de Responsabilidade">
                  <Text style={styles.accordionText}>
                    O Kandimba não é um substituto para aconselhamento médico profissional. Não somos responsáveis por:
                  </Text>
                  <BulletList
                    items={[
                      "Decisões tomadas com base nas informações do aplicativo",
                      "Imprecisões nas previsões de ciclo ou fertilidade",
                      "Interrupções ou falhas no serviço",
                      "Conteúdo publicado por outros usuários",
                    ]}
                  />
                </Accordion>

                <Accordion id="terms-4" title="Propriedade Intelectual">
                  <Text style={styles.accordionText}>
                    Todos os direitos de propriedade intelectual relacionados ao Kandimba, incluindo:
                  </Text>
                  <BulletList
                    items={[
                      "Logotipos, marcas e design",
                      "Software e código",
                      "Conteúdo criado pela equipe Kandimba",
                      "Algoritmos e tecnologia",
                    ]}
                  />
                  <Text style={[styles.accordionText, { marginTop: 8 }]}>
                    São de propriedade exclusiva da Kandimba ou de seus licenciadores.
                  </Text>
                </Accordion>

                <Accordion id="terms-5" title="Rescisão">
                  <Text style={styles.accordionText}>Podemos suspender ou encerrar seu acesso ao serviço se:</Text>
                  <BulletList
                    items={[
                      "Violar estes Termos de Uso",
                      "Usar o serviço de maneira fraudulenta ou ilegal",
                      "Comportar-se de maneira prejudicial a outros usuários",
                    ]}
                  />
                  <Text style={[styles.accordionText, { marginTop: 8 }]}>
                    Você pode encerrar sua conta a qualquer momento nas configurações do aplicativo.
                  </Text>
                </Accordion>

                <View style={styles.buttonContainer}>
                  <Button title="Termos Completos" variant="outline" />
                </View>
              </Card>

              <Card title="Isenção de Responsabilidade Médica">
                <Alert
                  type="destructive"
                  icon="alert-circle"
                  title="Atenção"
                  description="O Kandimba não é um dispositivo médico e não deve ser usado para diagnóstico ou tratamento."
                />
                <Text style={[styles.cardText, { marginTop: 12 }]}>
                  O Kandimba fornece informações educacionais e ferramentas de acompanhamento. Não substitui o
                  aconselhamento, diagnóstico ou tratamento médico profissional. Sempre consulte um profissional de
                  saúde qualificado para questões médicas.
                </Text>
              </Card>
            </View>
          )}

          {activeTab === "data" && (
            <View style={styles.tabContent}>
              <Card title="Seus Dados no Kandimba" icon="eye">
                <Text style={styles.cardText}>
                  Você tem controle total sobre seus dados pessoais. Aqui está um resumo dos dados que coletamos e como
                  você pode gerenciá-los.
                </Text>

                <View style={styles.dataSection}>
                  <Text style={styles.dataSectionTitle}>Dados Coletados</Text>
                  <View style={styles.checkItemsContainer}>
                    <CheckItem text="Dados do ciclo menstrual" />
                    <CheckItem text="Sintomas e humor" />
                    <CheckItem text="Dados de fertilidade" />
                    <CheckItem text="Informações de perfil" />
                    <CheckItem text="Publicações na comunidade" />
                  </View>
                </View>

                <Separator />

                <View style={styles.dataSection}>
                  <Text style={styles.dataSectionTitle}>Suas Opções</Text>
                  <View style={styles.dataOptionsContainer}>
                    <Button title="Baixar meus dados" variant="outline" icon="file-text" fullWidth />
                    <Button title="Ver dados armazenados" variant="outline" icon="eye" fullWidth />
                    <Button title="Gerenciar permissões" variant="outline" icon="lock" fullWidth />
                    <Button title="Excluir meus dados" variant="destructive" icon="alert-circle" fullWidth />
                  </View>
                </View>

                <Separator />

                <View style={styles.dataSection}>
                  <Text style={styles.dataSectionTitle}>Uso de Dados para Pesquisa</Text>
                  <Text style={styles.dataSectionText}>
                    Com sua permissão, podemos usar dados anonimizados para pesquisa e melhoria do aplicativo. Isso
                    ajuda a aprimorar as previsões e recursos para todas as usuárias.
                  </Text>
                  <Button title="Gerenciar Consentimento de Pesquisa" variant="outline" fullWidth />
                </View>
              </Card>

              <Card title="Segurança de Dados">
                <View style={styles.securityItemsContainer}>
                  <SecurityItem
                    icon="lock"
                    title="Criptografia"
                    description="Seus dados são criptografados em trânsito e em repouso usando padrões de segurança avançados."
                  />
                  <SecurityItem
                    icon="shield"
                    title="Autenticação"
                    description="Oferecemos autenticação de dois fatores para proteger sua conta contra acesso não autorizado."
                  />
                  <SecurityItem
                    icon="eye"
                    title="Controle de Acesso"
                    description="Implementamos controles rigorosos para garantir que apenas pessoal autorizado tenha acesso aos dados."
                  />
                </View>
              </Card>
            </View>
          )}
        </Animated.View>

        {/* Espaço adicional no final para scroll */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Fundo escuro inspirado no padrão
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#121212", // Fundo mais escuro para o cabeçalho
    borderBottomWidth: 3,
    borderBottomColor: "#F9A826", // Amarelo/laranja do padrão
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
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
  alert: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F9A826", // Amarelo/laranja do padrão
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    opacity: 0.9,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#2A2A2A", // Fundo escuro para as abas
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#3A3A3A", // Fundo um pouco mais claro para a aba ativa
    borderBottomWidth: 2,
    borderBottomColor: "#F9A826", // Amarelo/laranja do padrão
  },
  tabText: {
    fontSize: 13,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: "#2A2A2A", // Fundo escuro para os cards
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.2)", // Amarelo/laranja com transparência
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  cardContent: {
    gap: 12,
  },
  cardText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
  },
  accordionContainer: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#333333",
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  accordionContent: {
    padding: 12,
    backgroundColor: "#2A2A2A",
  },
  accordionText: {
    fontSize: 13,
    color: "#DDDDDD",
    lineHeight: 18,
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingRight: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: "#DDDDDD",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F9A826", // Amarelo/laranja do padrão
  },
  buttonDestructive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E57373", // Vermelho do padrão
  },
  buttonFullWidth: {
    width: "100%",
    marginBottom: 8,
    justifyContent: "flex-start",
  },
  buttonText: {
    color: "#121212", // Texto escuro para contraste com o botão amarelo
    fontSize: 14,
    fontWeight: "500",
  },
  buttonOutlineText: {
    color: "#F9A826", // Amarelo/laranja do padrão
  },
  buttonDestructiveText: {
    color: "#E57373", // Vermelho do padrão
  },
  buttonIcon: {
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A", // Cor mais escura para o separador
    marginVertical: 16,
  },
  dataSection: {
    marginVertical: 8,
  },
  dataSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  dataSectionText: {
    fontSize: 13,
    color: "#DDDDDD",
    marginBottom: 12,
  },
  checkItemsContainer: {
    gap: 8,
  },
  checkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#333333",
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#F9A826", // Amarelo/laranja do padrão
  },
  checkItemText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  dataOptionsContainer: {
    gap: 8,
  },
  securityItemsContainer: {
    gap: 16,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  securityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(249, 168, 38, 0.2)", // Amarelo/laranja com transparência
    justifyContent: "center",
    alignItems: "center",
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 13,
    color: "#DDDDDD",
    lineHeight: 18,
  },
})

export default PrivacyTermsScreen

