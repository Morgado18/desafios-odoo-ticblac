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
  Platform,
  TextInput,
  FlatList,
} from "react-native"

// Import the Icon component from App.tsx
import { Icon } from "../App"
// Import the TabIndicator component
import TabIndicator from "./TabIndicator"
import { getTagsPosts, scientificEvidence } from "../services/authed/main-service"

const { width } = Dimensions.get("window")

const ScientificEvidenceScreen = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("studies")
  const [tabsWidth, setTabsWidth] = useState(width)
  const [expandedStudy, setExpandedStudy] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const studyExpandAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  const [scientificEvidences, setScientificEvidences] = useState([]);

  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchScientificEvidences = async () => {
      try {
        const data = await scientificEvidence();
        setScientificEvidences(data.evidences);
      } catch (error) {
        console.error("Erro ao buscar evidências científicas:", error);
      }
    };

    fetchScientificEvidences();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /*  setLoading(true); */
        const data = await getTagsPosts();
        setAvailableTags(data.tags);
      } catch (error) {
        console.error("Erro ao buscar tags para os posts da comunidade:", error);
      } finally {
        /* setLoading(false); */
      }
    };
  
    fetchData();
  }, []);

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

  // Get active tab index for TabIndicator
  const getActiveTabIndex = () => {
    switch (activeTab) {
      case "studies":
        return 0
      case "journals":
        return 1
      case "infographics":
        return 2
      default:
        return 0
    }
  }

  // Toggle study expansion
  const toggleStudy = (index) => {
    const isExpanding = expandedStudy !== index

    // Animate the study expansion/collapse
    Animated.timing(studyExpandAnims[index], {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    setExpandedStudy(isExpanding ? index : null)
  }

  // Scientific studies data
  const studies = [
    {
      title: "Ciclo Menstrual e Desempenho Físico",
      authors: "Silva, M., Santos, A., Oliveira, P.",
      journal: "Revista Brasileira de Medicina Esportiva",
      year: 2023,
      abstract:
        "Este estudo examinou a relação entre as fases do ciclo menstrual e o desempenho físico em atletas de elite. Os resultados indicam variações significativas na força muscular e resistência cardiovascular durante diferentes fases do ciclo.",
      methodology:
        "Estudo longitudinal com 45 atletas femininas monitoradas durante 3 ciclos menstruais completos. Foram realizados testes de força, resistência e velocidade em dias específicos de cada fase do ciclo.",
      results:
        "Observou-se um aumento de 8% na força muscular durante a fase folicular tardia, coincidindo com o pico de estrogênio. A resistência cardiovascular apresentou melhores resultados na fase lútea inicial, com aumento médio de 6% no VO2 máx.",
      conclusions:
        "As flutuações hormonais durante o ciclo menstrual têm impacto significativo no desempenho físico. Atletas e treinadores podem otimizar programas de treinamento considerando estas variações fisiológicas.",
      keywords: ["ciclo menstrual", "desempenho atlético", "hormônios", "treinamento"],
      category: "esporte",
      doi: "10.1234/rbme.2023.001",
      citations: 18,
      color: "#4CAF50",
    },
    {
      title: "Influência da Dieta na Duração e Intensidade do Fluxo Menstrual",
      authors: "Costa, L., Ferreira, R., Mendes, T.",
      journal: "Nutrição & Saúde Feminina",
      year: 2022,
      abstract:
        "Esta pesquisa investigou como diferentes padrões alimentares afetam a duração e intensidade do fluxo menstrual. Dietas ricas em ômega-3 e baixas em açúcares refinados foram associadas a menstruações menos intensas e com menor duração.",
      methodology:
        "Estudo transversal com 320 mulheres entre 18-35 anos. Questionários detalhados sobre dieta foram aplicados durante 6 meses, juntamente com o monitoramento do ciclo menstrual.",
      results:
        "Participantes com consumo regular de ômega-3 (>2g/dia) apresentaram redução média de 30% na intensidade do fluxo menstrual. O consumo elevado de açúcares refinados (>50g/dia) foi associado a um aumento de 25% na duração do período menstrual.",
      conclusions:
        "Intervenções dietéticas podem ser uma abordagem não-farmacológica eficaz para mulheres que sofrem com fluxo menstrual intenso ou prolongado.",
      keywords: ["nutrição", "ciclo menstrual", "ômega-3", "açúcares refinados", "dieta"],
      category: "nutrição",
      doi: "10.5678/nsf.2022.045",
      citations: 27,
      color: "#E57373",
    },
    {
      title: "Correlação entre Ciclos Menstruais Irregulares e Síndrome dos Ovários Policísticos",
      authors: "Almeida, J., Rodrigues, C., Pinto, S.",
      journal: "Endocrinologia Clínica",
      year: 2021,
      abstract:
        "Este estudo estabeleceu critérios mais precisos para o diagnóstico precoce da Síndrome dos Ovários Policísticos (SOP) baseados em padrões de irregularidade menstrual. Ciclos consistentemente irregulares por mais de 12 meses foram fortemente correlacionados com SOP.",
      methodology:
        "Estudo de coorte com 580 mulheres entre 15-40 anos acompanhadas por 3 anos. Foram realizados exames hormonais, ultrassonografias e monitoramento detalhado dos ciclos menstruais.",
      results:
        "Mulheres com variação >10 dias na duração do ciclo por mais de 12 meses consecutivos apresentaram 78% mais chances de diagnóstico de SOP. Níveis elevados de testosterona (>50ng/dL) foram detectados em 82% das participantes com ciclos irregulares.",
      conclusions:
        "O monitoramento consistente da regularidade do ciclo menstrual pode servir como ferramenta de triagem eficaz para identificação precoce de SOP, permitindo intervenções mais rápidas e eficientes.",
      keywords: ["SOP", "ciclos irregulares", "hormônios", "diagnóstico precoce"],
      category: "endocrinologia",
      doi: "10.9012/ec.2021.078",
      citations: 45,
      color: "#9C27B0",
    },
    {
      title: "Impacto do Estresse Crônico na Regularidade do Ciclo Menstrual",
      authors: "Pereira, M., Sousa, F., Lima, A.",
      journal: "Psiconeuroendocrinologia",
      year: 2023,
      abstract:
        "Esta pesquisa examinou a relação entre níveis de estresse crônico e alterações no ciclo menstrual. Níveis elevados de cortisol foram associados a ciclos mais longos e irregulares, com efeitos persistentes mesmo após a redução do estresse.",
      methodology:
        "Estudo longitudinal com 210 mulheres entre 25-40 anos durante 18 meses. Foram medidos níveis de cortisol salivar, aplicados questionários de estresse percebido e monitorados os ciclos menstruais.",
      results:
        "Participantes com níveis elevados de cortisol (>15μg/dL) apresentaram ciclos 4-7 dias mais longos que o grupo controle. A irregularidade menstrual persistiu por aproximadamente 3-4 ciclos após a normalização dos níveis de cortisol.",
      conclusions:
        "Intervenções para redução de estresse devem ser consideradas no tratamento de irregularidades menstruais, com expectativa de normalização gradual após a redução dos níveis de cortisol.",
      keywords: ["estresse", "cortisol", "ciclo menstrual", "irregularidade"],
      category: "psicologia",
      doi: "10.3456/pne.2023.012",
      citations: 12,
      color: "#2196F3",
    },
    {
      title: "Relação entre Qualidade do Sono e Sintomas Pré-Menstruais",
      authors: "Ribeiro, T., Carvalho, M., Nunes, P.",
      journal: "Revista de Medicina do Sono",
      year: 2022,
      abstract:
        "Este estudo investigou como a qualidade do sono afeta a intensidade dos sintomas pré-menstruais (SPM). Mulheres com padrões de sono inadequados apresentaram sintomas significativamente mais intensos, especialmente relacionados a mudanças de humor e dor.",
      methodology:
        "Estudo caso-controle com 180 mulheres (90 com SPM diagnosticada e 90 controles) entre 20-35 anos. A qualidade do sono foi avaliada através de actigrafia e questionários validados durante 3 ciclos menstruais.",
      results:
        "Participantes com menos de 7 horas de sono por noite apresentaram intensidade 65% maior nos sintomas de SPM. A fragmentação do sono foi associada a um aumento de 48% na intensidade de sintomas como irritabilidade e ansiedade na fase lútea.",
      conclusions:
        "Intervenções para melhorar a qualidade do sono podem ser eficazes na redução dos sintomas pré-menstruais, oferecendo uma abordagem complementar aos tratamentos convencionais.",
      keywords: ["sono", "SPM", "sintomas pré-menstruais", "saúde feminina"],
      category: "sono",
      doi: "10.7890/rms.2022.034",
      citations: 22,
      color: "#673AB7",
    },
  ]

  // Scientific journals data
  const journals = [
    {
      title: "Journal of Women's Health",
      impact: 4.2,
      publisher: "Mary Ann Liebert, Inc.",
      frequency: "Mensal",
      focus: "Pesquisa multidisciplinar sobre saúde feminina",
      website: "https://www.liebertpub.com/loi/jwh",
      color: "#E57373",
    },
    {
      title: "Fertility and Sterility",
      impact: 6.8,
      publisher: "Elsevier",
      frequency: "Mensal",
      focus: "Reprodução humana e fertilidade",
      website: "https://www.fertstert.org/",
      color: "#4CAF50",
    },
    {
      title: "Journal of Reproductive Immunology",
      impact: 3.9,
      publisher: "Elsevier",
      frequency: "Bimestral",
      focus: "Imunologia da reprodução",
      website: "https://www.sciencedirect.com/journal/journal-of-reproductive-immunology",
      color: "#2196F3",
    },
    {
      title: "Menopause",
      impact: 3.5,
      publisher: "Wolters Kluwer",
      frequency: "Mensal",
      focus: "Pesquisa sobre menopausa e saúde da mulher de meia-idade",
      website: "https://journals.lww.com/menopausejournal/",
      color: "#9C27B0",
    },
    {
      title: "Journal of Obstetrics and Gynaecology Research",
      impact: 2.8,
      publisher: "Wiley",
      frequency: "Mensal",
      focus: "Obstetrícia, ginecologia e saúde reprodutiva",
      website: "https://obgyn.onlinelibrary.wiley.com/journal/14470756",
      color: "#FF9800",
    },
  ]

  // Infographics data
  const infographics = [
    {
      title: "Fases do Ciclo Menstrual e Hormônios",
      description: "Visualização detalhada das flutuações hormonais durante as diferentes fases do ciclo menstrual.",
      tags: ["hormônios", "ciclo menstrual", "fisiologia"],
      downloads: 1250,
      color: "#E57373",
    },
    {
      title: "Nutrientes Essenciais para Saúde Hormonal",
      description: "Guia visual dos nutrientes mais importantes para o equilíbrio hormonal feminino.",
      tags: ["nutrição", "hormônios", "saúde feminina"],
      downloads: 980,
      color: "#4CAF50",
    },
    {
      title: "Sinais de Fertilidade ao Longo do Ciclo",
      description: "Indicadores físicos de fertilidade que podem ser observados durante o ciclo menstrual.",
      tags: ["fertilidade", "ovulação", "planejamento familiar"],
      downloads: 1580,
      color: "#2196F3",
    },
    {
      title: "Impacto do Estresse no Ciclo Menstrual",
      description: "Como o estresse afeta os hormônios e o ciclo menstrual, com estratégias de manejo.",
      tags: ["estresse", "saúde mental", "ciclo menstrual"],
      downloads: 870,
      color: "#9C27B0",
    },
    {
      title: "Sintomas da Síndrome Pré-Menstrual (SPM)",
      description: "Guia visual dos sintomas comuns da SPM e estratégias de alívio baseadas em evidências.",
      tags: ["SPM", "sintomas", "bem-estar"],
      downloads: 1320,
      color: "#FF9800",
    },
  ]

  // Filter studies based on search query and category filter
  const filteredStudies = scientificEvidences
  .filter((study) => study.tipo_estudo === "Estudos") // Filtra apenas estudos
  .filter((study) => {
    const matchesSearch =
      searchQuery === "" ||
      study.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.tags.some((tag) => tag.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = activeFilter === "all" || study.tags.some((tag) => tag.tag === activeFilter);

    return matchesSearch && matchesFilter;
  });

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

  // Citation badge component
  const CitationBadge = ({ count, color }) => (
    <View style={[styles.citationBadge, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
      <Icon family="Feather" name="bookmark" size={12} color={color} />
      <Text style={[styles.citationText, { color }]}>{count} citações</Text>
    </View>
  )

  // DOI badge component
  const DoiBadge = ({ doi, color }) => (
    <TouchableOpacity style={[styles.doiBadge, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
      <Icon family="Feather" name="hash" size={12} color={color} />
      <Text style={[styles.doiText, { color }]}>{doi}</Text>
    </TouchableOpacity>
  )

  // Keyword badge component
  const KeywordBadge = ({ keyword, color }) => (
    <View style={[styles.keywordBadge, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
      <Text style={[styles.keywordText, { color }]}>{keyword}</Text>
    </View>
  )

  // Category filter badge component
  const CategoryFilterBadge = ({ category, label, color, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilterBadge,
        {
          backgroundColor: isActive ? `${color}30` : `${color}10`,
          borderColor: isActive ? `${color}60` : `${color}30`,
        },
      ]}
      onPress={() => onPress(category)}
    >
      <Text style={[styles.categoryFilterText, { color: isActive ? color : `${color}90` }]}>{label}</Text>
    </TouchableOpacity>
  )

  const renderTag = ({ item }) => (
    <CategoryFilterBadge
      category={item.name}
      label={item.name}
      color="#F9A826"
      isActive={activeFilter === item.name}
      onPress={setActiveFilter}
    />
  );

  // Journal card component
  const JournalCard = ({ journal }) => (
    <View style={[styles.journalCard, { borderLeftColor: journal.color, borderLeftWidth: 4 }]}>
      <View style={styles.journalHeader}>
        <Text style={styles.journalTitle}>{journal.title}</Text>
        <View style={[styles.impactBadge, { backgroundColor: `${journal.color}20` }]}>
          <Text style={[styles.impactText, { color: journal.color }]}>IF: {journal.impact}</Text>
        </View>
      </View>
      <View style={styles.journalDetails}>
        <View style={styles.journalDetailItem}>
          <Icon family="Feather" name="book" size={14} color="#AAAAAA" />
          <Text style={styles.journalDetailText}>{journal.publisher}</Text>
        </View>
        <View style={styles.journalDetailItem}>
          <Icon family="Feather" name="calendar" size={14} color="#AAAAAA" />
          <Text style={styles.journalDetailText}>{journal.frequency}</Text>
        </View>
      </View>
      <Text style={styles.journalFocus}>{journal.focus}</Text>
      <TouchableOpacity
        style={[styles.journalButton, { backgroundColor: `${journal.color}20`, borderColor: `${journal.color}40` }]}
      >
        <Icon family="Feather" name="external-link" size={14} color={journal.color} />
        <Text style={[styles.journalButtonText, { color: journal.color }]}>Visitar site</Text>
      </TouchableOpacity>
    </View>
  )

  // Infographic card component
  const InfographicCard = ({ infographic }) => (
    <View style={styles.infographicCard}>
      <View
        style={[
          styles.infographicImagePlaceholder,
          { backgroundColor: `${infographic.color}10`, borderColor: `${infographic.color}30` },
        ]}
      >
        <Icon family="Feather" name="bar-chart-2" size={32} color={infographic.color} />
      </View>
      <View style={styles.infographicContent}>
        <Text style={styles.infographicTitle}>{infographic.title}</Text>
        <Text style={styles.infographicDescription}>{infographic.description}</Text>
        <View style={styles.infographicTags}>
          {infographic.tags.map((tag, index) => (
            <View key={index} style={[styles.infographicTag, { backgroundColor: `${infographic.color}20` }]}>
              <Text style={[styles.infographicTagText, { color: infographic.color }]}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.infographicFooter}>
          <View style={styles.infographicDownloads}>
            <Icon family="Feather" name="download" size={14} color="#AAAAAA" />
            <Text style={styles.infographicDownloadsText}>{infographic.downloads}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.infographicButton,
              { backgroundColor: `${infographic.color}20`, borderColor: `${infographic.color}40` },
            ]}
          >
            <Text style={[styles.infographicButtonText, { color: infographic.color }]}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  // Render studies tab content
  const renderStudiesTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon family="Feather" name="search" size={18} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar estudos científicos..."
              placeholderTextColor="#777777"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                <Icon family="Feather" name="x" size={16} color="#AAAAAA" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <CategoryFilterBadge
            category="all"
            label="Todos"
            color="#F9A826"
            isActive={activeFilter === 'all'}
            onPress={setActiveFilter}
          />

          {/* Tags */}
          <FlatList
            data={availableTags}
            renderItem={renderTag}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagList}
          />
        </ScrollView>

       {/*  {filteredStudies.map((study, index) => { */}
      {filteredStudies.length === 0 ? (
  <View style={styles.noResultsContainer}>
    <Icon family="Feather" name="search" size={48} color="#3A3A3A" />
    <Text style={styles.noResultsText}>Nenhum estudo encontrado</Text>
    <Text style={styles.noResultsSubtext}>Tente outros termos ou filtros</Text>
  </View>
) : (
  filteredStudies.map((study, index) => {
    // Definir cor dinâmica para cada estudo
    const getStudyColor = (index) => {
      const colors = ["#4CAF50", "#E57373", "#9C27B0", "#2196F3", "#FF9800"];
      return colors[index % colors.length];
    };
    const studyColor = getStudyColor(index);

    return (
      <TouchableOpacity
        key={study.id} // Corrigido o erro de sintaxe (removido 'e')
        style={[styles.studyCard, expandedStudy === index && styles.expandedCard]}
        onPress={() => toggleStudy(index)}
        activeOpacity={0.9}
      >
        <View style={styles.studyHeader}>
          <View style={styles.studyTitleContainer}>
            <View style={[styles.studyDot, { backgroundColor: studyColor }]} />
            <Text style={styles.studyTitle}>{study.titulo}</Text>
          </View>
          <View style={styles.studyMeta}>
            <Text style={styles.studyAuthors}>{study.authors || "Autor não informado"}</Text>
            <Text style={styles.studyJournal}>{study.fonte}</Text>
          </View>
        </View>

        <View style={styles.studyContent}>
          <Text style={styles.abstractLabel}>Resumo</Text>
          <Text style={styles.abstractText}>{study.resumo}</Text>

          {expandedStudy === index && (
            <Animated.View
              style={{
                opacity: studyExpandAnims[index],
                maxHeight: studyExpandAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000],
                }),
              }}
            >
              <View style={styles.expandedContent}>
                <View style={styles.studySection}>
                  <Text style={styles.sectionLabel}>Metodologia</Text>
                  <Text style={styles.sectionText}>{study.metodologia}</Text>
                </View>

                <View style={styles.studySection}>
                  <Text style={styles.sectionLabel}>Resultados</Text>
                  <Text style={styles.sectionText}>{study.resultados}</Text>
                </View>

                {/* Condicional para conclusões, já que a API pode não fornecer */}
                {study.conclusoes && (
                  <View style={styles.studySection}>
                    <Text style={styles.sectionLabel}>Conclusões</Text>
                    <Text style={styles.sectionText}>{study.conclusoes}</Text>
                  </View>
                )}

                <View style={styles.keywordsContainer}>
                  {study.tags.map((tag, kidx) => (
                    <KeywordBadge key={kidx} keyword={tag.tag} color={studyColor} />
                  ))}
                </View>

                <View style={styles.studyFooter}>
                  <DoiBadge doi={study.doi} color={studyColor} />
                </View>
              </View>
            </Animated.View>
          )}

          <View style={styles.studyActions}>
            <TouchableOpacity
              style={[styles.studyActionButton, { backgroundColor: `${studyColor}10` }]}
              onPress={() => toggleStudy(index)}
            >
              <Text style={[styles.studyActionButtonText, { color: studyColor }]}>
                {expandedStudy === index ? "Mostrar menos" : "Ler mais"}
              </Text>
              <Icon
                family="Feather"
                name={expandedStudy === index ? "chevron-up" : "chevron-down"}
                size={16}
                color={studyColor}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.studyActionButton, { backgroundColor: `${studyColor}10` }]}
            >
              <Icon family="Feather" name="bookmark" size={16} color={studyColor} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  })
)}

      </View>
    )
  }

  // Render journals tab content
  const renderJournalsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.journalsHeader}>
          <Text style={styles.journalsHeaderTitle}>Revistas Científicas Relevantes</Text>
          <Text style={styles.journalsHeaderSubtitle}>Publicações especializadas em saúde feminina e reprodutiva</Text>
        </View>

        <View style={styles.journalsGrid}>
          {journals.map((journal, index) => (
            <JournalCard key={index} journal={journal} />
          ))}
        </View>

        <View style={styles.journalsFooter}>
          <TouchableOpacity style={styles.journalsFooterButton}>
            <Text style={styles.journalsFooterButtonText}>Ver mais revistas científicas</Text>
            <Icon family="Feather" name="external-link" size={14} color="#F9A826" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Render infographics tab content
  const renderInfographicsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.infographicsHeader}>
          <Text style={styles.infographicsHeaderTitle}>Infográficos Baseados em Evidências</Text>
          <Text style={styles.infographicsHeaderSubtitle}>
            Visualizações que simplificam conceitos científicos complexos
          </Text>
        </View>

        <View style={styles.infographicsGrid}>
          {infographics.map((infographic, index) => (
            <InfographicCard key={index} infographic={infographic} />
          ))}
        </View>

        <View style={styles.infographicsFooter}>
          <TouchableOpacity style={styles.infographicsFooterButton}>
            <Text style={styles.infographicsFooterButtonText}>Sugerir novo infográfico</Text>
            <Icon family="Feather" name="plus-circle" size={14} color="#F9A826" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={styles.headerTitle}>Evidências Científicas</Text>
          <Text style={styles.headerSubtitle}>Pesquisas e estudos sobre saúde feminina</Text>
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
            style={[styles.tab, activeTab === "studies" && styles.activeTab]}
            onPress={() => setActiveTab("studies")}
          >
            <Text style={[styles.tabText, activeTab === "studies" && styles.activeTabText]}>Estudos</Text>
          </TouchableOpacity>

         {/*  <TouchableOpacity
            style={[styles.tab, activeTab === "journals" && styles.activeTab]}
            onPress={() => setActiveTab("journals")}
          >
            <Text style={[styles.tabText, activeTab === "journals" && styles.activeTabText]}>Revistas</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={[styles.tab, activeTab === "infographics" && styles.activeTab]}
            onPress={() => setActiveTab("infographics")}
          >
            <Text style={[styles.tabText, activeTab === "infographics" && styles.activeTabText]}>Infográficos</Text>
          </TouchableOpacity> */}

          {/* Use the TabIndicator component */}
         {/*  <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={3} containerWidth={tabsWidth} /> */}
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {activeTab === "studies" && renderStudiesTab()}
          {/* {activeTab === "journals" && renderJournalsTab()}
          {activeTab === "infographics" && renderInfographicsTab()} */}
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
  header: {
    marginBottom: 16,
    position: "relative",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // Texto branco para contraste
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para o subtítulo
    marginTop: 4,
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
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    gap: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#FFFFFF",
    fontSize: 14,
  },
  clearButton: {
    padding: 6,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryFilterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 8,
  },
  studyCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    overflow: "hidden",
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
        elevation: 3,
      },
    }),
  },
  expandedCard: {
    borderColor: "#4A4A4A",
  },
  studyHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  studyTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  studyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  studyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  studyMeta: {
    marginTop: 8,
  },
  studyAuthors: {
    fontSize: 14,
    color: "#DDDDDD",
  },
  studyJournal: {
    fontSize: 12,
    color: "#AAAAAA",
    fontStyle: "italic",
    marginTop: 2,
  },
  studyContent: {
    padding: 16,
  },
  abstractLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  abstractText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 16,
  },
  studySection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 16,
  },
  keywordBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: "500",
  },
  studyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  doiBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  doiText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  citationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  citationText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  studyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  studyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  studyActionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  journalsHeader: {
    marginBottom: 16,
  },
  journalsHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  journalsHeaderSubtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
  },
  journalsGrid: {
    gap: 16,
  },
  journalCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
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
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  impactText: {
    fontSize: 12,
    fontWeight: "600",
  },
  journalDetails: {
    marginBottom: 12,
  },
  journalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  journalDetailText: {
    fontSize: 14,
    color: "#DDDDDD",
    marginLeft: 8,
  },
  journalFocus: {
    fontSize: 14,
    color: "#DDDDDD",
    marginBottom: 16,
    lineHeight: 20,
  },
  journalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  journalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  journalsFooter: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  journalsFooterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  journalsFooterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F9A826",
  },
  infographicsHeader: {
    marginBottom: 16,
  },
  infographicsHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infographicsHeaderSubtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
  },
  infographicsGrid: {
    gap: 16,
  },
  infographicCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
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
  infographicImagePlaceholder: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
  infographicContent: {
    flex: 1,
    padding: 12,
  },
  infographicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  infographicDescription: {
    fontSize: 14,
    color: "#DDDDDD",
    marginBottom: 8,
    lineHeight: 18,
  },
  infographicTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  infographicTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  infographicTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  infographicFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  infographicDownloads: {
    flexDirection: "row",
    alignItems: "center",
  },
  infographicDownloadsText: {
    fontSize: 12,
    color: "#AAAAAA",
    marginLeft: 4,
  },
  infographicButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  infographicButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  infographicsFooter: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  infographicsFooterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  infographicsFooterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F9A826",
  },
  bottomSpacing: {
    height: 80,
  },
})

export default ScientificEvidenceScreen
