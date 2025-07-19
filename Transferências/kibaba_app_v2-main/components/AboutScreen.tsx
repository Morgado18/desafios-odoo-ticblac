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
  Image,
  Linking,
  Platform,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"
// Import the TabIndicator component
import TabIndicator from "./TabIndicator"

import { loadTeam } from "../services/authed/main-service" 

import apiConfig from '../utils/apiConfig';

const { width } = Dimensions.get("window")

interface TeamMember {
  id: number;
  nome: string;
  cargo: string;
  descricao: string;
  email: string;
  telefone: string;
  foto_perfil_path: string | null;
}

const AboutScreen = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("about")
  const [tabsWidth, setTabsWidth] = useState(width)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  
 /*  //const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]) */ // Estado para armazenar os membros da equipe

  // Tipagem para os membros da equipe


  //const [teamMembers2, setTeamMembers] = useState<TeamMember[]>([])

  // Team members data
 /*  const teamMembers = [
    {
      name: "Luísa Mendes",
      role: "Fundadora & CEO",
      bio: "Especialista em saúde feminina com mais de 10 anos de experiência. Formada em Medicina pela Universidade Agostinho Neto com especialização em Ginecologia.",
      avatar: null, // Will use fallback
      social: {
        email: "luisa@kandimba.co.ao",
        linkedin: "https://linkedin.com/in/luisa-mendes",
      },
    },
    {
      name: "Teresa Nzinga",
      role: "Diretora de Pesquisa",
      bio: "Antropóloga especializada em medicina tradicional angolana. Trabalha na preservação do conhecimento ancestral das mulheres Mumuilas.",
      avatar: null, // Will use fallback
      social: {
        email: "teresa@kandimba.co.ao",
        linkedin: "https://linkedin.com/in/teresa-nzinga",
      },
    },
    {
      name: "João Paulo",
      role: "Desenvolvedor Chefe",
      bio: "Engenheiro de software com foco em aplicações de saúde. Formado pelo ISPTEC com mestrado em Inteligência Artificial aplicada à saúde.",
      avatar: null, // Will use fallback
      social: {
        email: "joao@kandimba.co.ao",
        github: "https://github.com/joaopaulo-dev",
        linkedin: "https://linkedin.com/in/joao-paulo-dev",
      },
    },
    {
      name: "Mariana Silva",
      role: "Designer de UX",
      bio: "Designer especializada em experiência do usuário para aplicações de saúde. Formada em Design pela Universidade Lusíada de Angola.",
      avatar: null, // Will use fallback
      social: {
        email: "mariana@kandimba.co.ao",
        linkedin: "https://linkedin.com/in/mariana-silva-ux",
      },
    },
  ] */

  // Milestones data
  const milestones = [
    {
      year: "2021",
      title: "Fundação",
      description:
        "Kandimba foi fundada por Luísa Mendes com a missão de unir conhecimento tradicional e tecnologia moderna.",
    },
    {
      year: "2022",
      title: "Pesquisa de Campo",
      description:
        "Realização de pesquisas com mulheres Mumuilas e mamãs da ilha para documentar conhecimentos tradicionais.",
    },
    {
      year: "2023",
      title: "Desenvolvimento do App",
      description:
        "Início do desenvolvimento do aplicativo com foco em acessibilidade e respeito às tradições angolanas.",
    },
    {
      year: "2024",
      title: "Lançamento Oficial",
      description: "Lançamento do Kandimba para o público, com mais de 10.000 downloads nos primeiros meses.",
    },
    {
      year: "2025",
      title: "Expansão Internacional",
      description: "Expansão para outros países africanos, preservando as tradições locais de cada região.",
    },
  ]

  // Awards data
  const awards = [
    {
      title: "Prêmio de Inovação em Saúde Digital",
      organization: "Ministério da Saúde de Angola",
      year: "2024",
    },
    {
      title: "Melhor App de Saúde Feminina",
      organization: "African Tech Awards",
      year: "2024",
    },
    {
      title: "Reconhecimento por Preservação Cultural",
      organization: "UNESCO",
      year: "2023",
    },
  ]

  // Values data
  const values = [
    {
      title: "Respeito às Tradições",
      description: "Valorizamos e respeitamos o conhecimento ancestral, reconhecendo sua importância e relevância.",
    },
    {
      title: "Inovação Responsável",
      description: "Utilizamos a tecnologia de forma ética e responsável, sempre a serviço do bem-estar feminino.",
    },
    {
      title: "Acessibilidade",
      description:
        "Trabalhamos para que nossas soluções sejam acessíveis a todas as mulheres, independentemente de sua localização ou condição socioeconômica.",
    },
    {
      title: "Empoderamento Feminino",
      description: "Acreditamos que o conhecimento é poder, e buscamos empoderar mulheres através da informação.",
    },
  ]

  // Commitments data
  const commitments = [
    "Preservação do conhecimento tradicional angolano",
    "Desenvolvimento de tecnologias acessíveis",
    "Pesquisa contínua em saúde feminina",
    "Educação sobre saúde reprodutiva",
    "Colaboração com comunidades tradicionais",
  ]

  const [loading, setLoading] = useState(true) // Estado para controlar o loading
  const [error, setError] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  

  // Animation for content fade in
 /*  useEffect(() => {
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
  }, []); */

  /*  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadTeam()
        if (data?.team) {
          setTeamMembers(data.team)
        }
      } catch (err) {
        setError("Falha ao carregar dados da equipe")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData();
  }, []) */

  // Carrega dados da equipe
  /* useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadTeam()
        if (data?.team) {
          setTeamMembers(data.team)
        }
      } catch (err) {
        setError("Falha ao carregar dados da equipe")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) */

  // Atualize o useEffect que carrega os dados:
 /*  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadTeam();
        if (data?.team) {
          setTeamMembers(data.team);
        }
      } catch (err) {
        setError("Falha ao carregar dados da equipe");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 */

 /*  useEffect(() => {
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
  }, []) */

  useEffect(() => {
  // Inicia as animações
  const animation = Animated.parallel([
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
  ]);

  // Função para carregar os dados
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await loadTeam();
      if (data?.team) {
        setTeamMembers(data.team);
      }
    } catch (err) {
      setError("Falha ao carregar dados da equipe");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Inicia ambas as operações
  animation.start();
  fetchData();

  // Cleanup function para evitar memory leaks
  return () => {
    animation.stop();
  };
}, []);

  // Get active tab index for TabIndicator
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "about":
        return 0
      case "team":
        return 1
      case "mission":
        return 2
      default:
        return 0
    }
  }

  // Open URL function
  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL: ", err))
  }

  // Render avatar component
  const renderAvatar = (name, size = 40) => {
    return (
      <View style={[styles.avatar, { width: size, height: size }]}>
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{name/* [0] */}</Text>
      </View>
    )
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

  // Render about tab content
  const renderAboutTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Nossa História</Text>
            <Text style={styles.cardSubtitle}>A jornada do Kandimba</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Kandimba nasceu da visão de Luísa Mendes, médica angolana que cresceu ouvindo os ensinamentos de sua avó
              Mumuila sobre o ciclo menstrual e fertilidade. Percebendo que este conhecimento ancestral estava se
              perdendo, ela decidiu criar uma plataforma que unisse a sabedoria tradicional com a tecnologia moderna.
            </Text>
            <Text style={[styles.cardText, styles.cardTextSpaced]}>
              O nome "Kandimba" significa "coelho" em Kimbundu, simbolizando fertilidade e agilidade. Nossa equipe
              multidisciplinar trabalha para preservar e compartilhar o conhecimento das mulheres Mumuilas e das mamãs
              da ilha, tornando-o acessível para a nova geração.
            </Text>

            <Text style={styles.sectionTitle}>Nossa Jornada</Text>
            <View style={styles.timelineContainer}>
              {milestones.map((milestone, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineYear}>{milestone.year}</Text>
                      <Text style={styles.timelineTitle}>{milestone.title}</Text>
                    </View>
                    <Text style={styles.timelineDescription}>{milestone.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Icon family="Feather" name="award" size={16} color="#F9A826" />
              <Text style={styles.cardTitle}>Reconhecimentos</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            {awards.map((award, index) => (
              <View key={index} style={styles.awardItem}>
                <View style={styles.awardIconContainer}>
                  <Icon family="Feather" name="star" size={16} color="#F9A826" />
                </View>
                <View style={styles.awardContent}>
                  <Text style={styles.awardTitle}>{award.title}</Text>
                  <Text style={styles.awardOrganization}>
                    {award.organization}, {award.year}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Icon family="Feather" name="globe" size={16} color="#F9A826" />
              <Text style={styles.cardTitle}>Impacto</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>25K+</Text>
                <Text style={styles.statLabel}>Usuárias</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statLabel}>Províncias</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Países</Text>
              </View>
            </View>

            <Text style={[styles.cardText, styles.cardTextSpaced]}>
              Kandimba está ajudando milhares de mulheres a compreender melhor seus ciclos menstruais e fertilidade,
              enquanto preserva e valoriza o conhecimento tradicional angolano.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openURL("https://www.kandimba.it.ao")}
              activeOpacity={0.7}
            >
              <Icon family="Feather" name="external-link" size={14} color="#F9A826" />
              <Text style={styles.linkButtonText}>Visite nosso site</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // Render team tab content
 /*  const renderTeamTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <View style={styles.teamCardHeader}>{renderAvatar(member.name, 60)}</View>
              <View style={styles.teamCardContent}>
                <Text style={styles.teamMemberName}>{member.name}</Text>
                <Text style={styles.teamMemberRole}>{member.role}</Text>
                <View style={styles.separator} />
                <Text style={styles.teamMemberBio} numberOfLines={3}>
                  {member.bio}
                </Text>
                <View style={styles.socialLinks}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => Linking.openURL(`mailto:${member.social.email}`)}
                  >
                    <Icon family="Feather" name="mail" size={14} color="#F9A826" />
                  </TouchableOpacity>
                  {member.social.github && (
                    <TouchableOpacity style={styles.socialButton} onPress={() => openURL(member.social.github)}>
                      <Icon family="Feather" name="github" size={14} color="#F9A826" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.socialButton} onPress={() => openURL(member.social.linkedin)}>
                    <Icon family="Feather" name="linkedin" size={14} color="#F9A826" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Icon family="Feather" name="users" size={16} color="#F9A826" />
              <Text style={styles.cardTitle}>Conselho Consultivo</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.advisoryMember}>
              {renderAvatar("MK", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Mamã Kieza</Text>
                <Text style={styles.advisoryMemberRole}>Anciã e guardiã do conhecimento tradicional Mumuila</Text>
              </View>
            </View>

            <View style={styles.advisoryMember}>
              {renderAvatar("DS", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Dr. Samuel Neto</Text>
                <Text style={styles.advisoryMemberRole}>Ginecologista e pesquisador em saúde feminina</Text>
              </View>
            </View>

            <View style={styles.advisoryMember}>
              {renderAvatar("IM", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Profa. Isabel Mateus</Text>
                <Text style={styles.advisoryMemberRole}>
                  Antropóloga especializada em medicina tradicional africana
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Junte-se à Nossa Equipe</Text>
            <Text style={styles.cardSubtitle}>Estamos sempre em busca de talentos</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Procuramos pessoas apaixonadas por tecnologia, saúde feminina e preservação cultural. Confira nossas vagas
              abertas e faça parte desta missão.
            </Text>
            <TouchableOpacity style={styles.outlineButton} activeOpacity={0.7}>
              <Text style={styles.outlineButtonText}>Ver Oportunidades</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  } */

  const renderTeamTab = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando equipe...</Text>
        </View>
      )
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <View style={styles.teamCardHeader}>
                {member.foto_perfil_path ? (
                  <Image 
                    source={{ uri: `${apiConfig.baseUrl}${member.foto_perfil_path}` }}
                    style={styles.teamMemberImage}
                    //resizeMode="cover"
                     onError={(e) => console.log('Erro ao carregar imagem do membro:', e.nativeEvent.error)}
                  />
                ) : (
                  renderAvatar(member.nome, 60)
                )}
              </View>
              <View style={styles.teamCardContent}>
                <Text style={styles.teamMemberName}>{member.nome}</Text>
                <Text style={styles.teamMemberRole}>{member.cargo}</Text>
                <View style={styles.separator} />
                <Text style={styles.teamMemberBio} numberOfLines={3}>
                  {member.descricao}
                </Text>
                <View style={styles.socialLinks}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => Linking.openURL(`mailto:${member.email}`)}
                  >
                    <Icon family="Feather" name="mail" size={14} color="#F9A826" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(`tel:${member.telefone}`)}>
                    <Icon family="Feather" name="phone" size={14} color="#F9A826" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Mantenha o restante do conteúdo da aba de equipe */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Icon family="Feather" name="users" size={16} color="#F9A826" />
              <Text style={styles.cardTitle}>Conselho Consultivo</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.advisoryMember}>
              {renderAvatar("MK", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Mamã Kieza</Text>
                <Text style={styles.advisoryMemberRole}>Anciã e guardiã do conhecimento tradicional Mumuila</Text>
              </View>
            </View>

            <View style={styles.advisoryMember}>
              {renderAvatar("DS", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Dr. Samuel Neto</Text>
                <Text style={styles.advisoryMemberRole}>Ginecologista e pesquisador em saúde feminina</Text>
              </View>
            </View>

            <View style={styles.advisoryMember}>
              {renderAvatar("IM", 40)}
              <View style={styles.advisoryMemberInfo}>
                <Text style={styles.advisoryMemberName}>Profa. Isabel Mateus</Text>
                <Text style={styles.advisoryMemberRole}>
                  Antropóloga especializada em medicina tradicional africana
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Junte-se à Nossa Equipe</Text>
            <Text style={styles.cardSubtitle}>Estamos sempre em busca de talentos</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Procuramos pessoas apaixonadas por tecnologia, saúde feminina e preservação cultural. Confira nossas vagas
              abertas e faça parte desta missão.
            </Text>
            <TouchableOpacity style={styles.outlineButton} activeOpacity={0.7}>
              <Text style={styles.outlineButtonText}>Ver Oportunidades</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // Render mission tab content
  const renderMissionTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Icon family="Feather" name="heart" size={16} color="#F9A826" />
              <Text style={styles.cardTitle}>Nossa Missão</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Kandimba tem como missão unir a sabedoria ancestral das mulheres angolanas com a tecnologia moderna,
              criando ferramentas que empoderam mulheres a compreender e cuidar melhor de sua saúde reprodutiva.
            </Text>
            <Text style={[styles.cardText, styles.cardTextSpaced]}>
              Buscamos preservar o conhecimento tradicional das mulheres Mumuilas e das mamãs da ilha, garantindo que
              esta sabedoria não se perca com o tempo e seja acessível para as novas gerações.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Visão</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Aspiramos a um mundo onde o conhecimento tradicional e a ciência moderna caminhem lado a lado, onde as
              mulheres tenham acesso a informações precisas sobre seus corpos e onde as tradições culturais sejam
              valorizadas e preservadas.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Valores</Text>
          </View>
          <View style={styles.cardContent}>
            {values.map((value, index) => (
              <View key={index} style={styles.valueItem}>
                <View style={styles.valueIconContainer}>
                  <Icon family="Feather" name="star" size={16} color="#F9A826" />
                </View>
                <View style={styles.valueContent}>
                  <Text style={styles.valueTitle}>{value.title}</Text>
                  <Text style={styles.valueDescription}>{value.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Compromissos</Text>
          </View>
          <View style={styles.cardContent}>
            {commitments.map((commitment, index) => (
              <View key={index} style={styles.commitmentItem}>
                <Icon family="Feather" name="chevron-right" size={16} color="#F9A826" />
                <Text style={styles.commitmentText}>{commitment}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
              <Text style={styles.primaryButtonText}>Apoie Nossa Missão</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={styles.headerTitle}>Sobre o Kandimba</Text>
        </View>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Versão 2.5.0</Text>
        </View>
      </Animated.View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: "/placeholder.svg?height=160&width=400" }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <GeometricPattern />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Saúde e Sabedoria Feminina</Text>
            <Text style={styles.bannerSubtitle}>Unindo tradição e tecnologia</Text>
          </View>
        </View>
      </View>

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
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Sobre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "team" && styles.activeTab]}
            onPress={() => setActiveTab("team")}
          >
            <Text style={[styles.tabText, activeTab === "team" && styles.activeTabText]}>Equipe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "mission" && styles.activeTab]}
            onPress={() => setActiveTab("mission")}
          >
            <Text style={[styles.tabText, activeTab === "mission" && styles.activeTabText]}>Missão</Text>
          </TouchableOpacity>

          {/* Use the TabIndicator component */}
          <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={3} containerWidth={tabsWidth} />
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {activeTab === "about" && renderAboutTab()}
          {activeTab === "team" && renderTeamTab()}
          {activeTab === "mission" && renderMissionTab()}
        </Animated.View>

        <Text style={styles.developedText}>
          Developed by - morgadoandrade -
        </Text>
      </View>

      {/* Bottom spacing for navigation bar */}
      <View style={styles.bottomSpacing} />

      
   
    </ScrollView>
  )
}

const styles = StyleSheet.create({
   developedText: {
    color: "#AAAAAA",
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  versionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.4)",
  },
  versionText: {
    fontSize: 12,
    color: "#F9A826",
    fontWeight: "500",
  },
  bannerContainer: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  bannerContent: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#F9A826",
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
  tabsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
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
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F9A826",
    fontWeight: "bold",
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
  },
  cardTextSpaced: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 12,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    paddingLeft: 24,
    paddingBottom: 16,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 8,
    top: 8,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(249, 168, 38, 0.3)",
  },
  timelineDot: {
    position: "absolute",
    left: 4,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(249, 168, 38, 0.2)",
    borderWidth: 2,
    borderColor: "#F9A826",
  },
  timelineContent: {
    marginBottom: 4,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  timelineYear: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F9A826",
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  timelineDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
  awardItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  awardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  awardContent: {
    flex: 1,
  },
  awardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  awardOrganization: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    padding: 12,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.2)",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F9A826",
  },
  statLabel: {
    fontSize: 12,
    color: "#DDDDDD",
    marginTop: 4,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 12,
  },
  linkButtonText: {
    fontSize: 14,
    color: "#F9A826",
    fontWeight: "500",
    marginLeft: 8,
  },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  teamCard: {
    width: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  teamCardHeader: {
    height: 80,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#F9A826",
  },
  teamCardContent: {
    padding: 12,
  },
  teamMemberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  teamMemberRole: {
    fontSize: 12,
    color: "#F9A826",
  },
  teamMemberBio: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 16,
    marginTop: 8,
  },
  teamMemberImage: {
    width: 60, // 60
    height: 60,
    borderRadius: 30, // 30
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 8,
  },
  socialLinks: {
    flexDirection: "row",
    marginTop: 8,
  },
  socialButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.2)",
  },
  advisoryMember: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  advisoryMemberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  advisoryMemberName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  advisoryMemberRole: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#F9A826",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  outlineButtonText: {
    fontSize: 14,
    color: "#F9A826",
    fontWeight: "500",
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  valueIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.2)",
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 16,
  },
  commitmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commitmentText: {
    fontSize: 14,
    color: "#DDDDDD",
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: "#F9A826",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    fontSize: 14,
    color: "#121212",
    fontWeight: "600",
  },
  avatar: {
    borderRadius: 100,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#121212",
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#F9A826',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(249, 168, 38, 0.2)',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#F9A826',
    fontWeight: '500',
  },
})

export default AboutScreen
