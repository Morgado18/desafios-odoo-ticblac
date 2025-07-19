 "use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  AccessibilityInfo,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
  Vibration,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "../App"
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  G,
  Line,
  ClipPath,
  RadialGradient,
  Text as SvgText,
} from "react-native-svg"
import { fertile_window, profile, update_basal_temperature, update_intercourse } from "../services/authed/main-service"
import { useTheme } from "../theme/ThemeContext"

const { width, height } = Dimensions.get("window")
const isIOS = Platform.OS === "ios"

// Define TypeScript interfaces for data structures
interface PeriodDay {
  date: string
  flow: "Leve" | "Moderado" | "Intenso"
  symptoms?: string[]
}

interface CycleData {
  startDate: string
  endDate: string | null
  length: number
  periodDays: PeriodDay[]
}

interface TemperatureData {
  date: string
  temp: number
}

interface CycleDataStructure {
  currentCycle: {
    startDate: Date
    length: number
    periodDays: PeriodDay[]
  }
  nextPeriod: Date
  fertileWindow: Date[]
  allCycles: CycleData[]
  temperatures: TemperatureData[]
}

interface ConceptionProbability {
  label: string
  color: string
  percentage: number
}

interface ConceptionChances {
  score: string
  description: string
  color: string
}

interface TraditionalWisdom {
  title: string
  content: string
  icon: {
    family: string
    name: string
  }
}

interface MPIQAnswers {
  lastPeriodDays: string
  dischargeConsistency: string
  dischargeAppearance: string
  vaginalSensation: string
}

interface MPIQResult {
  phase: string
  description: string
  color: string
  icon: {
    family: string
    name: string
  }
  recommendations: string[]
}

interface DiaCiclo {
  data: string
  temperatura_basal: number | null
  teve_intercurso: string | null // "Sim" | "Não" | null
  humor: string | null
  descricao_humor: string | null
  sintoma: {
    tipo: string | null
    descricao: string | null
    intensidade: string | null
  }
}

interface FaseCiclo {
  fase: string
  icone: string
  descricao: string
  dias: DiaCiclo[]
}

interface DadosCicloMenstrual {
  ciclo_menstrual: {
    data_ovulacao: string
    duracao_ciclo: number
  }
  proxima_menstruacao: string
  periodo_fertil: {
    inicio_janela_fertil: string
    fim_janela_fertil?: string // Adicionando campo opcional
  }
  temperatura_basal: number | null
  probability_conception: {
    intensidade: "Baixa" | "Média" | "Alta"
    percentagem: number
    mensagem: string
  }
  dica_ancestral: {
    id: number
    titulo: string
    conteudo: string
    fonte: string | null
    idioma: string
  }
  ciclo_mensal: FaseCiclo[] // Note que no JSON original está "mesntrual_cycle" (possível typo)
}

interface DadosCicloAPI {
  menstrual_cycle: {
    data_ovulacao: string; // formato "d/m"
    duracao_ciclo: number;
  };
  proxima_menstruacao: string; // formato "d/m"
  fertile_period: {
    inicio_janela_fertil: string; // formato "d/m"
    //fim_janela_fertil?: string; // formato "d/m"
  };
  basal_temperature: number | null;
  probability_conception: {
    intensidade: "Baixa" | "Média" | "Alta";
    percentagem: number;
    mensagem?: string;
  };
  ancestral_tip_random: {
    id: number;
    titulo: string;
    conteudo: string;
    fonte: string | null;
    idioma: string;
  };
  mesntrual_cycle: Array<{
    fase: string;
    icone: string;
    descricao: string;
    dias: Array<{
      date: string; // formato "d/m/Y"
      temperatura_basal: number | null;
      teve_intercurso: string | null; // "Sim" | "Não" | null
      mood: string | null;
      mood_description: string | null;
      symptom: {
        tipo: string | null;
        descricao: string | null;
        intensidade: string | null;
      };
    }>;
  }>;
}


// Paleta de cores refinada
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

// Ícones modernos para substituir emojis
const ICONS = {
  menstrual: "droplet",
  follicular: "wind",
  fertile: "sun",
  ovulation: "star",
  luteal: "moon",
  temperature: "thermometer",
  calendar: "calendar",
  intercourse: "heart",
  analysis: "bar-chart-2",
  info: "info",
  check: "check-circle",
  alert: "alert-circle",
  wisdom: "feather",
  add: "plus",
  remove: "minus",
  edit: "edit-2",
  save: "save",
  delete: "trash-2",
  next: "chevron-right",
  previous: "chevron-left",
  close: "x",
  menu: "more-vertical",
  settings: "settings",
  refresh: "refresh-cw",
  help: "help-circle",
  user: "user",
  lock: "lock",
  unlock: "unlock",
  notification: "bell",
  search: "search",
  filter: "filter",
  share: "share-2",
  download: "download",
  upload: "upload",
  home: "home",
  chart: "pie-chart",
  clock: "clock",
  calendar2: "calendar",
  bookmark: "bookmark",
  tag: "tag",
  link: "link",
  location: "map-pin",
  phone: "phone",
  mail: "mail",
  message: "message-circle",
  camera: "camera",
  image: "image",
  video: "video",
  music: "music",
  file: "file",
  folder: "folder",
  cloud: "cloud",
  globe: "globe",
  wifi: "wifi",
  bluetooth: "bluetooth",
  battery: "battery",
  power: "power",
  activity: "activity",
  alert2: "alert-triangle",
  warning2: "alert-octagon",
  error2: "x-circle",
  success2: "check-circle",
  info2: "info",
  question: "help-circle",
  more: "more-horizontal",
  menu2: "menu",
  grid: "grid",
  list: "list",
  layout: "layout",
  sidebar: "sidebar",
  maximize: "maximize",
  minimize: "minimize",
  arrowUp: "arrow-up",
  arrowDown: "arrow-down",
  arrowLeft: "arrow-left",
  arrowRight: "arrow-right",
  chevronUp: "chevron-up",
  chevronDown: "chevron-down",
  chevronLeft: "chevron-left",
  chevronRight: "chevron-right",
  play: "play",
  pause: "pause",
  stop: "square",
  skipForward: "skip-forward",
  skipBack: "skip-back",
  fastForward: "fast-forward",
  rewind: "rewind",
  shuffle: "shuffle",
  repeat: "repeat",
  volume: "volume-2",
  mute: "volume-x",
  zoomIn: "zoom-in",
  zoomOut: "zoom-out",
  eye: "eye",
  eyeOff: "eye-off",
  copy: "copy",
  paste: "clipboard",
  cut: "scissors",
  trash: "trash-2",
  archive: "archive",
  unarchive: "folder-plus",
  pin: "map-pin",
  unpin: "map",
  star: "star",
  unstar: "star",
  heart: "heart",
  unheart: "heart",
  thumbsUp: "thumbs-up",
  thumbsDown: "thumbs-down",
  flag: "flag",
  unflag: "flag",
  send: "send",
  reply: "corner-up-left",
  forward: "corner-up-right",
  attach: "paperclip",
  detach: "link-2",
  mic: "mic",
  micOff: "mic-off",
  call: "phone-call",
  endCall: "phone-off",
  videoCall: "video",
  endVideoCall: "video-off",
  screenshot: "camera",
  print: "printer",
  scan: "maximize",
  cast: "cast",
  airplay: "airplay",
  tv: "tv",
  monitor: "monitor",
  laptop: "laptop",
  tablet: "tablet",
  mobile: "smartphone",
  watch: "watch",
  keyboard: "keyboard",
  mouse: "mouse-pointer",
  cpu: "cpu",
  memory: "server",
  database: "database",
  cloud2: "cloud",
  upload2: "upload-cloud",
  download2: "download-cloud",
  server: "server",
  terminal: "terminal",
  code: "code",
  git: "git-branch",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  gcp: "gcp",
  azure: "azure",
  heroku: "heroku",
  netlify: "netlify",
  vercel: "vercel",
  npm: "npm",
  yarn: "yarn",
  webpack: "webpack",
  babel: "babel",
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  java: "java",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  go: "go",
  rust: "rust",
  c: "c",
  cpp: "cpp",
  scala: "scala",
  haskell: "haskell",
  erlang: "erlang",
  elixir: "elixir",
  clojure: "clojure",
  r: "r",
  dart: "dart",
  flutter: "flutter",
  react: "react",
  vue: "vue",
  angular: "angular",
  svelte: "svelte",
  ember: "ember",
  backbone: "backbone",
  jquery: "jquery",
  bootstrap: "bootstrap",
  tailwind: "tailwind",
  material: "material",
  chakra: "chakra",
  ant: "ant",
  storybook: "storybook",
  figma: "figma",
  sketch: "sketch",
  adobe: "adobe",
  photoshop: "photoshop",
  illustrator: "illustrator",
  xd: "xd",
  invision: "invision",
  zeplin: "zeplin",
  framer: "framer",
  protopie: "protopie",
  principle: "principle",
  after: "after-effects",
  premiere: "premiere",
  lightroom: "lightroom",
  indesign: "indesign",
  audition: "audition",
  dimension: "dimension",
  animate: "animate",
  dreamweaver: "dreamweaver",
  acrobat: "acrobat",
  bridge: "bridge",
  character: "character-animator",
  media: "media-encoder",
  substance: "substance",
  capture: "capture",
  aero: "aero",
  rush: "rush",
  spark: "spark",
  behance: "behance",
  dribbble: "dribbble",
  instagram: "instagram",
  facebook: "facebook",
  twitter: "twitter",
  linkedin: "linkedin",
  youtube: "youtube",
  vimeo: "vimeo",
  twitch: "twitch",
  discord: "discord",
  slack: "slack",
  telegram: "telegram",
  whatsapp: "whatsapp",
  messenger: "messenger",
  wechat: "wechat",
  line: "line",
  skype: "skype",
  zoom: "zoom",
  teams: "teams",
  meet: "meet",
  hangouts: "hangouts",
  webex: "webex",
  gotomeeting: "gotomeeting",
  bluejeans: "bluejeans",
  whereby: "whereby",
  jitsi: "jitsi",
  google: "google",
  apple: "apple",
  microsoft: "microsoft",
  amazon: "amazon",
  facebook2: "facebook",
  netflix: "netflix",
  spotify: "spotify",
  deezer: "deezer",
  appleMusic: "apple-music",
  youtubeMusic: "youtube-music",
  soundcloud: "soundcloud",
  bandcamp: "bandcamp",
  mixcloud: "mixcloud",
  lastfm: "lastfm",
  shazam: "shazam",
  genius: "genius",
  musixmatch: "musixmatch",
  beatport: "beatport",
  traxsource: "traxsource",
  junodownload: "junodownload",
  bandsintown: "bandsintown",
  songkick: "songkick",
  dice: "dice",
  resident: "resident-advisor",
  mixmag: "mixmag",
  djmag: "djmag",
  pitchfork: "pitchfork",
  rollingstone: "rollingstone",
  billboard: "billboard",
  nme: "nme",
  fader: "fader",
  complex: "complex",
  xxl: "xxl",
  thesource: "thesource",
  vibe: "vibe",
  spin: "spin",
  wired: "wired",
  vice: "vice",
  noisey: "noisey",
  thump: "thump",
  factmag: "factmag",
  xlr8r: "xlr8r",
  residentadvisor: "resident-advisor",
  beatport2: "beatport",
  traxsource2: "traxsource",
  junodownload2: "junodownload",
  bandcamp2: "bandcamp",
  soundcloud2: "soundcloud",
  mixcloud2: "mixcloud",
  spotify2: "spotify",
  applemusic2: "apple-music",
  youtubemusic2: "youtube-music",
  deezer2: "deezer",
  tidal: "tidal",
  amazonmusic: "amazon-music",
  pandora: "pandora",
  iheartradio: "iheartradio",
  tunein: "tunein",
  audible: "audible",
  stitcher: "stitcher",
  pocketcasts: "pocketcasts",
  overcast: "overcast",
  castbox: "castbox",
  podbean: "podbean",
  anchor: "anchor",
  breaker: "breaker",
  radiopublic: "radiopublic",
  castro: "castro",
  himalaya: "himalaya",
  laughable: "laughable",
  podchaser: "podchaser",
  podtail: "podtail",
  podbay: "podbay",
  podparadise: "podparadise",
  podtrac: "podtrac",
  blubrry: "blubrry",
  libsyn: "libsyn",
  simplecast: "simplecast",
  transistor: "transistor",
  buzzsprout: "buzzsprout",
  captivate: "captivate",
  castos: "castos",
  fireside: "fireside",
  podiant: "podiant",
  redcircle: "redcircle",
  spreaker: "spreaker",
  zencast: "zencast",
  acast: "acast",
  audioboom: "audioboom",
  megaphone: "megaphone",
  omny: "omny",
}

// Mock data for cycle tracking (similar to what we used in HomeScreen)
const cycleData: CycleDataStructure = {
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
  allCycles: [
    {
      startDate: new Date(new Date().getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(new Date().getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      length: 28,
      periodDays: Array(5).fill({ flow: "Moderado" }),
    },
    {
      startDate: new Date(new Date().getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      length: 28,
      periodDays: Array(6).fill({ flow: "Intenso" }),
    },
    {
      startDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      length: 28,
      periodDays: Array(5).fill({ flow: "Moderado" }),
    },
  ],
  temperatures: [
    { date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.4 },
    { date: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.5 },
    { date: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.4 },
    { date: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.6 },
    { date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.7 },
    { date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), temp: 36.9 },
    { date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), temp: 37.0 },
  ],
}

// Helper functions for date manipulation
const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2) return false

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

const differenceInDays = (date1: Date, date2: Date): number => {
  if (!date1 || !date2) return 0

  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Format date to Portuguese
const formatDate = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "--/--"
  }

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${day}/${month}`
}

const formatFullDate = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Data inválida"
  }

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

// Componente de Padrão Geométrico Moderno Aprimorado
const EnhancedGeometricPattern = () => {
  // Animações separadas para evitar conflitos entre animações nativas e JS
  const rotateAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    // Animação de rotação contínua
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )

    // Animação de pulsação de opacidade
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    )

    rotateAnimation.start()
    opacityAnimation.start()

    return () => {
      rotateAnimation.stop()
      opacityAnimation.stop()
    }
  }, [])

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.patternContainer} accessibilityLabel="Padrão decorativo" importantForAccessibility="no">
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolation }],
          opacity: opacityAnim,
        }}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Defs>
            <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0.2" />
            </RadialGradient>
            <SvgGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0.5" />
            </SvgGradient>
            <ClipPath id="circleClip">
              <Circle cx="60" cy="60" r="60" />
            </ClipPath>
          </Defs>

          {/* Background */}
          <Circle cx="60" cy="60" r="60" fill="url(#radialGrad)" />

          {/* Decorative elements */}
          <G opacity="0.8" clipPath="url(#circleClip)">
            {/* Anchor points for positioning (invisible) */}
            <Circle cx="60" cy="60" r="1" fill="none" />
            <Circle cx="30" cy="30" r="1" fill="none" />
            <Circle cx="90" cy="30" r="1" fill="none" />
            <Circle cx="30" cy="90" r="1" fill="none" />
            <Circle cx="90" cy="90" r="1" fill="none" />

            {/* Visible elements */}
            <Circle cx="25" cy="25" r="10" fill="url(#linearGrad)" />
            <Circle cx="60" cy="20" r="8" fill={COLORS.highlight} opacity="0.3" />
            <Circle cx="95" cy="30" r="12" fill="url(#linearGrad)" />
            <Circle cx="20" cy="60" r="7" fill={COLORS.highlight} opacity="0.3" />
            <Circle cx="100" cy="70" r="9" fill="url(#linearGrad)" />
            <Circle cx="45" cy="90" r="11" fill={COLORS.highlight} opacity="0.3" />
            <Circle cx="75" cy="95" r="8" fill="url(#linearGrad)" />

            {/* Connecting lines */}
            <Line x1="25" y1="25" x2="60" y2="20" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="60" y1="20" x2="95" y2="30" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="95" y1="30" x2="100" y2="70" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="100" y1="70" x2="75" y2="95" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="75" y1="95" x2="45" y2="90" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="45" y1="90" x2="20" y2="60" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />
            <Line x1="20" y1="60" x2="25" y2="25" stroke={COLORS.highlight} strokeWidth="0.8" opacity="0.4" />

            {/* Additional decorative elements */}
            <Circle cx="60" cy="60" r="25" fill="none" stroke={COLORS.highlight} strokeWidth="0.5" opacity="0.2" />
            <Circle cx="60" cy="60" r="40" fill="none" stroke={COLORS.highlight} strokeWidth="0.3" opacity="0.1" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  )
}

// Componente de gráfico de temperatura animado e moderno aprimorado
const EnhancedTemperatureChart = ({ data, basalTemperature }) => {
  // Animações separadas para evitar conflitos
   const { isDark, primaryColor, colors } = useTheme()
  const barAnimations = useRef(data.map(() => new Animated.Value(0))).current
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const animations = data.map((_, i) => {
      return Animated.timing(barAnimations[i], {
        toValue: 1,
        duration: 1200,
        delay: i * 120,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      })
    })

    Animated.stagger(60, animations).start()

    return () => {
      animations.forEach((anim) => anim.stop())
    }
  }, [data, barAnimations])

  const minTemp = Math.min(...data.map((d) => d.temp)) - 0.2
  const maxTemp = Math.max(...data.map((d) => d.temp)) + 0.2
  const range = maxTemp - minTemp

  // Função para calcular a posição Y com base na temperatura
  const getYPosition = (temp) => {
    return ((maxTemp - temp) / range) * (chartDimensions.height - 40) + 20
  }

  // Função para calcular a altura da barra com base na temperatura
  const getBarHeight = (temp) => {
    return ((temp - minTemp) / range) * (chartDimensions.height - 40)
  }

  return (
    <View
      style={styles.temperatureChartContainer}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        setChartDimensions({ width: width - 50, height: height - 30 })
      }}
    >
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Temperatura Basal</Text>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>
              {basalTemperature ? `${basalTemperature}°C` : 'N/D'}
            </Text>
          </View> 
        </View>
      </View>

      <View style={styles.chartContent}>

        <View style={styles.chartMainArea}>
        
        </View>
      </View>
    </View>
  )
}

// Componente moderno para visualização do progresso do ciclo aprimorado
const EnhancedCycleProgressVisualization = ({ cyclePosition, cycleData }) => {
  // Animações separadas para evitar conflitos
  const progressPositionAnim = useRef(new Animated.Value(0)).current
  const progressColorAnim = useRef(new Animated.Value(0)).current
  const [activePhase, setActivePhase] = useState<string | null>(null)
  const [phaseInfo, setPhaseInfo] = useState({
    title: "",
    description: "",
    color: COLORS.primary,
    icon: ICONS.calendar,
  })

  useEffect(() => {
    // Animação para posição do marcador
    Animated.timing(progressPositionAnim, {
      toValue: cyclePosition,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()

    // Animação para cor do marcador
    Animated.timing(progressColorAnim, {
      toValue: cyclePosition,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start()

    return () => {
      progressPositionAnim.stopAnimation()
      progressColorAnim.stopAnimation()
    }
  }, [cyclePosition, progressPositionAnim, progressColorAnim])

  // Determinar fase ativa com base na posição
  useEffect(() => {
    if (cyclePosition <= 20) {
      setActivePhase("menstrual")
      setPhaseInfo({
        title: "Fase Menstrual",
        description:
          "A fase menstrual é o início do ciclo, quando ocorre o sangramento. A fertilidade é nula neste período.",
        color: COLORS.secondary,
        icon: ICONS.menstrual,
      })
    } else if (cyclePosition <= 40) {
      setActivePhase("follicular")
      setPhaseInfo({
        title: "Fase Folicular",
        description:
          "A fase folicular é quando o folículo se desenvolve. A fertilidade começa a aumentar gradualmente.",
        color: COLORS.tertiary,
        icon: ICONS.follicular,
      })
    } else if (cyclePosition <= 60) {
      setActivePhase("fertile")
      setPhaseInfo({
        title: "Fase Fértil",
        description: "A fase fértil inclui os dias mais propícios para a concepção, com o pico no dia da ovulação.",
        color: COLORS.primary,
        icon: ICONS.fertile,
      })
    } else {
      setActivePhase("luteal")
      setPhaseInfo({
        title: "Fase Lútea",
        description: "A fase lútea ocorre após a ovulação. A fertilidade diminui gradualmente até o próximo ciclo.",
        color: COLORS.primary,
        icon: ICONS.luteal,
      })
    }
  }, [cyclePosition])

  // Interpolações para animações
  const progressInterpolate = progressPositionAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  })

  const colorInterpolate = progressColorAnim.interpolate({
    inputRange: [0, 20, 40, 60, 100],
    outputRange: [COLORS.secondary, COLORS.secondary, COLORS.tertiary, COLORS.primary, COLORS.primary],
  })

  return (
    <View style={styles.cycleVisualization}>
      <View style={styles.cycleProgressContainer}>
        <View style={styles.cycleProgressBackground}>
          {/* Gradient background for phases */}
          <LinearGradient
            colors={[COLORS.secondaryLight, COLORS.tertiaryLight, COLORS.primaryLight, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cycleProgressGradient}
          />

          {/* Phase markers with modern icons */}
          <Pressable
            style={[styles.cyclePhase, { left: "10%" }]}
            onPress={() => {
              Vibration.vibrate(10)
              setActivePhase("menstrual")
              setPhaseInfo({
                title: "Fase Menstrual",
                description:
                  "A fase menstrual é o início do ciclo, quando ocorre o sangramento. A fertilidade é nula neste período.",
                color: COLORS.secondary,
                icon: ICONS.menstrual,
              })
            }}
            accessible={true}
            accessibilityLabel="Fase Menstrual"
            accessibilityHint="A fase menstrual é o início do ciclo, quando ocorre o sangramento"
          >
            <View
              style={[
                styles.cyclePhaseIconContainer,
                activePhase === "menstrual" && styles.cyclePhaseIconContainerActive,
                { borderColor: activePhase === "menstrual" ? COLORS.secondary : COLORS.border },
              ]}
            >
              <Icon
                family="Feather"
                name={ICONS.menstrual}
                size={16}
                color={activePhase === "menstrual" ? COLORS.secondary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.cyclePhaseText,
                activePhase === "menstrual" && styles.cyclePhaseTextActive,
                { color: activePhase === "menstrual" ? COLORS.secondary : COLORS.textSecondary },
              ]}
            >
              Menstrual
            </Text>
          </Pressable>

          <Pressable
            style={[styles.cyclePhase, { left: "35%" }]}
            onPress={() => {
              Vibration.vibrate(10)
              setActivePhase("follicular")
              setPhaseInfo({
                title: "Fase Folicular",
                description:
                  "A fase folicular é quando o folículo se desenvolve. A fertilidade começa a aumentar gradualmente.",
                color: COLORS.tertiary,
                icon: ICONS.follicular,
              })
            }}
            accessible={true}
            accessibilityLabel="Fase Folicular"
            accessibilityHint="A fase folicular é quando o folículo se desenvolve"
          >
            <View
              style={[
                styles.cyclePhaseIconContainer,
                activePhase === "follicular" && styles.cyclePhaseIconContainerActive,
                { borderColor: activePhase === "follicular" ? COLORS.tertiary : COLORS.border },
              ]}
            >
              <Icon
                family="Feather"
                name={ICONS.follicular}
                size={16}
                color={activePhase === "follicular" ? COLORS.tertiary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.cyclePhaseText,
                activePhase === "follicular" && styles.cyclePhaseTextActive,
                { color: activePhase === "follicular" ? COLORS.tertiary : COLORS.textSecondary },
              ]}
            >
              Folicular
            </Text>
          </Pressable>

          <Pressable
            style={[styles.cyclePhase, { left: "60%" }]}
            onPress={() => {
              Vibration.vibrate(10)
              setActivePhase("fertile")
              setPhaseInfo({
                title: "Fase Fértil",
                description:
                  "A fase fértil inclui os dias mais propícios para a concepção, com o pico no dia da ovulação.",
                color: COLORS.primary,
                icon: ICONS.fertile,
              })
            }}
            accessible={true}
            accessibilityLabel="Fase Fértil"
            accessibilityHint="A fase fértil inclui os dias mais propícios para a concepção"
          >
            <View
              style={[
                styles.cyclePhaseIconContainer,
                activePhase === "fertile" && styles.cyclePhaseIconContainerActive,
                { borderColor: activePhase === "fertile" ? COLORS.primary : COLORS.border },
              ]}
            >
              <Icon
                family="Feather"
                name={ICONS.fertile}
                size={16}
                color={activePhase === "fertile" ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.cyclePhaseText,
                activePhase === "fertile" && styles.cyclePhaseTextActive,
                { color: activePhase === "fertile" ? COLORS.primary : COLORS.textSecondary },
              ]}
            >
              Fértil
            </Text>
          </Pressable>

          <Pressable
            style={[styles.cyclePhase, { left: "85%" }]}
            onPress={() => {
              Vibration.vibrate(10)
              setActivePhase("luteal")
              setPhaseInfo({
                title: "Fase Lútea",
                description:
                  "A fase lútea ocorre após a ovulação. A fertilidade diminui gradualmente até o próximo ciclo.",
                color: COLORS.primary,
                icon: ICONS.luteal,
              })
            }}
            accessible={true}
            accessibilityLabel="Fase Lútea"
            accessibilityHint="A fase lútea ocorre após a ovulação"
          >
            <View
              style={[
                styles.cyclePhaseIconContainer,
                activePhase === "luteal" && styles.cyclePhaseIconContainerActive,
                { borderColor: activePhase === "luteal" ? COLORS.primary : COLORS.border },
              ]}
            >
              <Icon
                family="Feather"
                name={ICONS.luteal}
                size={16}
                color={activePhase === "luteal" ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.cyclePhaseText,
                activePhase === "luteal" && styles.cyclePhaseTextActive,
                { color: activePhase === "luteal" ? COLORS.primary : COLORS.textSecondary },
              ]}
            >
              Lútea
            </Text>
          </Pressable>

          {/* Ovulation marker with pulse animation */}
          <View
            style={[styles.cycleMarker, styles.ovulationMarker, { left: `${45}%` }]}
            accessibilityLabel="Marcador de ovulação"
          >
            <Animated.View style={[styles.ovulationMarkerPulse]} />
            <View style={styles.ovulationMarkerDot} />
          </View>

          {/* Current day marker with animated position */}
          <Animated.View
            style={[
              styles.cycleMarker,
              styles.currentDayMarker,
              {
                transform: [
                  {
                    translateX: progressPositionAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, width * 0.7], // Ajustado para largura da barra
                    }),
                  },
                ],
              },
            ]}
            accessibilityLabel="Marcador do dia atual"
          >
            <Animated.View style={[styles.currentDayMarkerInner, { backgroundColor: colorInterpolate }]} />
          </Animated.View>

          {/* Segmentos de fase */}
          <View style={[styles.phaseSegment, styles.menstrualSegment]} />
          <View style={[styles.phaseSegment, styles.follicularSegment]} />
          <View style={[styles.phaseSegment, styles.fertileSegment]} />
          <View style={[styles.phaseSegment, styles.lutealSegment]} />
        </View>

        {/* Day scale with improved visibility */}
      {/*   <View style={styles.cycleScale}>
          <Text style={styles.cycleScaleText}>Dia 1</Text>
          <Text style={styles.cycleScaleText}>Dia {Math.round(cycleData.currentCycle.length / 4)}</Text>
          <Text style={styles.cycleScaleText}>Dia {Math.round(cycleData.currentCycle.length / 2)}</Text>
          <Text style={styles.cycleScaleText}>Dia {Math.round((cycleData.currentCycle.length * 3) / 4)}</Text>
          <Text style={styles.cycleScaleText}>Dia {cycleData.currentCycle.length}</Text>
        </View> */}
      </View>

      {/* Phase information */}
      <View style={[styles.phaseInfoContainer, { borderLeftColor: phaseInfo.color }]}>
        <View style={styles.phaseInfoHeader}>
          <Icon family="Feather" name={phaseInfo.icon} size={20} color={phaseInfo.color} />
          <Text style={[styles.phaseInfoTitle, { color: phaseInfo.color }]}>{phaseInfo.title}</Text>
        </View>
        <Text style={styles.phaseInfoDescription}>{phaseInfo.description}</Text>
      </View>
    </View>
  )
}

// Componente moderno para visualização da probabilidade de concepção aprimorado
const EnhancedConceptionProbabilityMeter = ({ percentage }) => {
  // Animações separadas para evitar conflitos
  const needlePositionAnim = useRef(new Animated.Value(0)).current
  const needleColorAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const [needleRotation, setNeedleRotation] = useState("0deg")

  useEffect(() => {
    // Animação para posição da agulha
    Animated.timing(needlePositionAnim, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    }).start()

    // Animação para cor da agulha
   /*  Animated.timing(needleColorAnim, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start() */

    // Animação de pulso para o centro
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    ).start()

    // Atualizar a rotação da agulha manualmente
    const listener = needlePositionAnim.addListener(({ value }) => {
      const rotation = -90 + value * 1.8
      setNeedleRotation(`${rotation}deg`)
    })

    return () => {
      needlePositionAnim.removeListener(listener)
      needlePositionAnim.stopAnimation()
      needleColorAnim.stopAnimation()
      pulseAnim.stopAnimation()
    }
  }, [percentage, needlePositionAnim, needleColorAnim, pulseAnim])

  const colorInterpolate = needleColorAnim.interpolate({
    inputRange: [0, 15, 30, 100],
    outputRange: [COLORS.textSecondary, COLORS.primary, COLORS.primary, COLORS.highlight],
  })

  return (
    <View
      style={styles.conceptionMeterContainer}
      accessible={true}
      accessibilityLabel={`Probabilidade de concepção: ${percentage}%`}
    >
      <Svg height="120" width="120" viewBox="0 0 100 100">
        <Defs>
          <SvgGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.textSecondary} />
            <Stop offset="50%" stopColor={COLORS.primary} />
            <Stop offset="100%" stopColor={COLORS.highlight} />
          </SvgGradient>

          {/* Radial gradient for glow effect */}
          <RadialGradient id="needleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </RadialGradient>

          {/* Radial gradient for center glow */}
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.primary} stopOpacity="0.1" />
          </RadialGradient>
        </Defs>

        {/* Background meter track */}
        <Path
          d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
          stroke={COLORS.cardDark}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="141 141"
          strokeDashoffset="0"
        />

        {/* Meter fill */}
        <Path
          d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
          stroke="url(#meterGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="141 141"
          strokeDashoffset="141"
          transform="rotate(-90, 50, 50)"
        />

        {/* Invisible anchor points for positioning */}
        <Circle cx="50" cy="50" r="1" fill="none" />
        <Circle cx="50" cy="5" r="1" fill="none" />
        <Circle cx="5" cy="50" r="1" fill="none" />
        <Circle cx="95" cy="50" r="1" fill="none" />

        {/* Needle with manual rotation */}
        <G transform={`rotate(-90, 50, 50)`}>
          <G transform={`rotate(${percentage * 1.8}, 50, 50)`}>
            <Circle cx="50" cy="50" r="8" fill="url(#needleGlow)" />
            <Path d="M 50,50 L 50,10" stroke={colorInterpolate} strokeWidth="3" fill="none" strokeLinecap="round" />
            <Circle cx="50" cy="10" r="5" fill={colorInterpolate} />
          </G>
        </G>

        {/* Center point with pulse animation */}
        <Circle cx="50" cy="50" r="8" fill="url(#centerGlow)" />
        <Circle cx="50" cy="50" r="4" fill={COLORS.primary} />

        {/* Scale markers */}
        <G>
          <Line x1="15" y1="50" x2="20" y2="50" stroke={COLORS.textSecondary} strokeWidth="2" />
          <Line x1="50" y1="15" x2="50" y2="20" stroke={COLORS.primary} strokeWidth="2" />
          <Line x1="85" y1="50" x2="80" y2="50" stroke={COLORS.highlight} strokeWidth="2" />

          {/* Percentage markers */}
          <SvgText x="12" y="54" fill={COLORS.textSecondary} fontSize="8" textAnchor="middle">
            0%
          </SvgText>
          <SvgText x="50" y="12" fill={COLORS.primary} fontSize="8" textAnchor="middle">
            50%
          </SvgText>
          <SvgText x="88" y="54" fill={COLORS.highlight} fontSize="8" textAnchor="middle">
            100%
          </SvgText>
        </G>
      </Svg>

      <View style={styles.conceptionMeterTextContainer}>
        <Animated.Text
          style={[
            styles.conceptionMeterPercentage,
            {
              color: colorInterpolate,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {Math.round(percentage)}%
        </Animated.Text>
      </View>
    </View>
  )
}

// Componente de card expansível
const ExpandableCard = ({ title, icon, children, id, isExpanded, onToggle }) => {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start()

    return () => {
      expandAnim.stopAnimation()
      rotateAnim.stopAnimation()
    }
  }, [isExpanded, expandAnim, rotateAnim])

  const contentHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Altura máxima aproximada
  })

  const rotateIcon = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const borderColorInterpolate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  })

  return (
    <Animated.View
      style={[
        styles.expandableCard,
        {
          borderColor: borderColorInterpolate,
          transform: [
            {
              scale: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.expandableCardHeader}
        onPress={onToggle}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`${title}, ${isExpanded ? "expandido" : "recolhido"}`}
        accessibilityRole="button"
        accessibilityHint={isExpanded ? "Toque para recolher" : "Toque para expandir"}
      >
        <View style={styles.expandableCardTitle}>
          <Icon family="Feather" name={icon} size={20} color={COLORS.primary} />
          <Text style={styles.expandableCardTitleText}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Icon family="Feather" name="chevron-down" size={20} color={COLORS.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.expandableCardContent,
          {
            height: contentHeight,
            opacity: expandAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  )
}

const FertilityScreen = () => {
  // State variables

  const [hadIntercourse, setHadIntercourse] = useState(null);
  const [observations, setObservations] = useState('');
  const [pregnancyTest, setPregnancyTest] = useState(null);

  const [dadosCiclo, setDadosCiclo] = useState<DadosCicloAPI | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"overview" | "tracking" | "intercourse" | "analysis">("overview")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [temperature, setTemperature] = useState<string>("")
  const [mucusType, setMucusType] = useState<string>("")
  const [intercourseDate, setIntercourseDate] = useState<string>("")
  const [intercourseHistory, setIntercourseHistory] = useState<string[]>([
    new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  ])
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>("")
  const [mpiqAnswers, setMpiqAnswers] = useState<MPIQAnswers>({
    lastPeriodDays: "",
    dischargeConsistency: "",
    dischargeAppearance: "",
    vaginalSensation: "",
  })
  const [cyclePosition, setCyclePosition] = useState<number>(0)
  const [showTip, setShowTip] = useState<boolean>(false)
  const [activeTip, setActiveTip] = useState<string>("")
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const notificationAnim = useRef(new Animated.Value(-100)).current
  const cycleProgressAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const tipAnim = useRef(new Animated.Value(0)).current

  // useEffect para buscar dados da API 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Substituir pela chamada real à sua API
        const data = await fertile_window();
        //const data = await response.json();
        setDadosCiclo(data);
        //console.log(data)
       
      } catch (error) {
        console.log("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 
  }, []);

 //  console.log("Dados do ciclo:", dadosCiclo);

  /* if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
 */
 /*  if (!dadosCiclo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados do ciclo</Text>
      </View>
    );
  } */

  // Verificar se o leitor de tela está ativado
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const enabled = await AccessibilityInfo.isScreenReaderEnabled()
        setIsScreenReaderEnabled(enabled)
      } catch (error) {
        console.log("Erro ao verificar leitor de tela:", error)
      }
    }

    

    checkScreenReader()

    // Adicionar listener para mudanças no estado do leitor de tela
    const subscription = AccessibilityInfo.addEventListener("screenReaderChanged", setIsScreenReaderEnabled)

    return () => {
      subscription.remove()
    }
  }, [])

  // Animações para elementos interativos
  useEffect(() => {
    // Animação de pulso contínua
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    )

    pulseAnimation.start()

    // Animação de rotação contínua
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    )

    rotateAnimation.start()

    return () => {
      pulseAnimation.stop()
      rotateAnimation.stop()
    }
  }, [])

  // Animação para dicas
  useEffect(() => {
    if (showTip) {
      Animated.spring(tipAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(tipAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      tipAnim.stopAnimation()
    }
  }, [showTip])

  // Interpolações para animações
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Calculate cycle position
  const calculateCyclePosition = useCallback((): number => {
    try {
      const startDate = new Date(cycleData.currentCycle.startDate)
      if (isNaN(startDate.getTime())) {
        return 0
      }

      const position = (differenceInDays(startDate, currentDate) / cycleData.currentCycle.length) * 100
      return Math.min(Math.max(position, 0), 100)
    } catch (error) {
      console.log("Error calculating cycle position:", error)
      return 0
    }
  }, [currentDate, cycleData.currentCycle.startDate, cycleData.currentCycle.length])

  // Update cycle position when current date changes
  useEffect(() => {
    const newPosition = calculateCyclePosition()
    setCyclePosition(newPosition)

    // Animate cycle progress
    Animated.timing(cycleProgressAnim, {
      toValue: newPosition,
      duration: 1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start()

    return () => {
      cycleProgressAnim.stopAnimation()
    }
  }, [currentDate, calculateCyclePosition, cycleProgressAnim])

  // Check if today is in fertile window
  const isInFertileWindow = useCallback((): boolean => {
    return cycleData.fertileWindow.some((date) => isSameDay(date, currentDate))
  }, [currentDate, cycleData.fertileWindow])

  // Check if today is peak fertility day (ovulation)
  const isFertilePeak = useCallback((): boolean => {
    if (!cycleData.fertileWindow || cycleData.fertileWindow.length === 0) {
      return false
    }

    const ovulationDay = cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)]
    return isSameDay(ovulationDay, currentDate)
  }, [currentDate, cycleData.fertileWindow])

  // Is today period day
  const isInPeriod = useCallback((): boolean => {
    return cycleData.currentCycle.periodDays.some((day) => {
      try {
        return isSameDay(new Date(day.date), currentDate)
      } catch (error) {
        console.error("Error parsing date:", error)
        return false
      }
    })
  }, [currentDate, cycleData.currentCycle.periodDays])

  // Get conception probability label and color
  const getConceptionProbability = useCallback((): ConceptionProbability => {
    if (isFertilePeak()) {
      return { label: "Muito Alta", color: COLORS.highlight, percentage: 33 }
    }

    if (isInFertileWindow()) {
      // Calculate days from peak
      if (!cycleData.fertileWindow || cycleData.fertileWindow.length === 0) {
        return { label: "Indeterminada", color: COLORS.textSecondary, percentage: 0 }
      }

      const ovulationDay = cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)]
      const dayDiff = Math.abs(differenceInDays(currentDate, ovulationDay))

      if (dayDiff === 1) return { label: "Alta", color: COLORS.primary, percentage: 27 }
      if (dayDiff === 2) return { label: "Moderada", color: COLORS.primary, percentage: 20 }
      return { label: "Média-Baixa", color: COLORS.primary, percentage: 15 }
    }

    if (isInPeriod()) {
      return { label: "Nula", color: COLORS.secondary, percentage: 0 }
    }

    return { label: "Baixa", color: COLORS.textSecondary, percentage: 5 }
  }, [isInFertileWindow, isFertilePeak, isInPeriod, currentDate, cycleData.fertileWindow])

  // Memoize conception probability to avoid recalculation on every render
  const conception = useMemo(() => getConceptionProbability(), [getConceptionProbability])

  // Check if intercourse date is in fertile window
  const isIntercourseDateInFertileWindow = useCallback(
    (dateStr: string): boolean => {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          return false
        }

        return cycleData.fertileWindow.some((d) => isSameDay(d, date))
      } catch (error) {
        console.error("Error checking if date is in fertile window:", error)
        return false
      }
    },
    [cycleData.fertileWindow],
  )

  // Calculate conception chances based on intercourse timing
  const calculateConceptionChances = useCallback((): ConceptionChances => {
    try {
      let optimalTimingCount = 0
      let totalInFertileWindow = 0

      intercourseHistory.forEach((dateStr) => {
        if (isIntercourseDateInFertileWindow(dateStr)) {
          totalInFertileWindow++

          // Check if date is close to ovulation
          const date = new Date(dateStr)
          if (isNaN(date.getTime())) {
            return
          }

          if (!cycleData.fertileWindow || cycleData.fertileWindow.length === 0) {
            return
          }

          const ovulationDay = cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)]
          const dayDiff = Math.abs(differenceInDays(date, ovulationDay))

          if (dayDiff <= 1) {
            optimalTimingCount++
          }
        }
      })

      if (optimalTimingCount >= 1) {
        return { score: "Excelente", description: "Timing ótimo de relações na janela fértil", color: COLORS.primary }
      } else if (totalInFertileWindow >= 1) {
        return { score: "Bom", description: "Relações durante a janela fértil", color: COLORS.primary }
      } else if (intercourseHistory.length > 0) {
        return { score: "Regular", description: "Relações fora da janela fértil", color: COLORS.primary }
      } else {
        return { score: "Indeterminado", description: "Nenhuma relação registrada", color: COLORS.textSecondary }
      }
    } catch (error) {
      console.error("Error calculating conception chances:", error)
      return { score: "Erro", description: "Erro ao calcular chances", color: COLORS.textSecondary }
    }
  }, [intercourseHistory, isIntercourseDateInFertileWindow, cycleData.fertileWindow])

  // Memoize conception chances to avoid recalculation on every render
  const conceptionChances = useMemo(() => calculateConceptionChances(), [calculateConceptionChances])


  // Traditional wisdom based on current phase
  const getTraditionalWisdom = useCallback((): TraditionalWisdom => {
    if (isFertilePeak()) {
      return {
        title: "Ritual da Lua Cheia",
        content:
          "As mamãs da ilha realizam um ritual especial durante o pico de fertilidade. Tome um banho com água de pétalas de rosa brancas e vermelhas ao pôr do sol, visualizando a concepção desejada.",
        icon: { family: "Feather", name: "star" },
      }
    }

    if (isInFertileWindow()) {
      return {
        title: "Chá de Gengibre com Mel",
        content:
          "Durante a janela fértil, as mulheres Mumuilas tradicionalmente bebem chá de gengibre com mel pela manhã para potencializar a fertilidade e 'aquecer o útero'.",
        icon: { family: "Feather", name: "sun" },
      }
    }

    if (isInPeriod()) {
      return {
        title: "Infusão de Folhas de Abacateiro",
        content:
          "As mulheres angolanas utilizam folhas de abacateiro em infusão para aliviar as cólicas e purificar o sangue durante o período menstrual.",
        icon: { family: "Feather", name: "feather" },
      }
    }

    return {
      title: "Semente de Abóbora",
      content:
        "Na fase lútea, consumir sementes de abóbora torradas é uma tradição para equilibrar os hormônios e preparar o corpo para um novo ciclo.",
      icon: { family: "Feather", name: "moon" },
    }
  }, [isFertilePeak, isInFertileWindow, isInPeriod])

  // Memoize traditional wisdom to avoid recalculation on every render
  const traditionalWisdom = useMemo(() => getTraditionalWisdom(), [getTraditionalWisdom])

  // MPIQ implementation
  const handleMpiqChange = useCallback((field: keyof MPIQAnswers, value: string) => {
    setMpiqAnswers((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const calculateMpiqScore = useCallback((): number => {
    let score = 0

    // Days since menstruation (item 1)
    const days = Number.parseInt(mpiqAnswers.lastPeriodDays)
    if (!isNaN(days)) {
      score += days
    }

    // Discharge consistency (item 2)
    if (mpiqAnswers.dischargeConsistency === "sticky") score += 4
    else if (mpiqAnswers.dischargeConsistency === "creamy") score += 3
    else if (mpiqAnswers.dischargeConsistency === "stretchy") score += 2
    else if (mpiqAnswers.dischargeConsistency === "bloody") score += 1

    // Discharge appearance (item 3)
    if (mpiqAnswers.dischargeAppearance === "white") score += 3
    else if (mpiqAnswers.dischargeAppearance === "clear") score += 2
    else if (mpiqAnswers.dischargeAppearance === "red") score += 1

    // Vaginal sensation (item 4)
    if (mpiqAnswers.vaginalSensation === "dry") score += 4
    else if (mpiqAnswers.vaginalSensation === "moist") score += 3
    else if (mpiqAnswers.vaginalSensation === "wet") score += 2
    else if (mpiqAnswers.vaginalSensation === "slippery") score += 1

    return score
  }, [mpiqAnswers])

  const getMpiqResult = useCallback((): MPIQResult => {
    try {
      // Check for ovulation window (less restrictive approach)
      const days = Number.parseInt(mpiqAnswers.lastPeriodDays)
      if (
        !isNaN(days) &&
        days >= 6 &&
        days <= 21 &&
        mpiqAnswers.dischargeConsistency === "stretchy" &&
        mpiqAnswers.dischargeAppearance === "clear" &&
        (mpiqAnswers.vaginalSensation === "wet" || mpiqAnswers.vaginalSensation === "slippery")
      ) {
        return {
          phase: "Janela de Ovulação",
          description: "Você está na sua janela de ovulação. Esta é a fase mais fértil do seu ciclo.",
          color: COLORS.highlight,
          icon: { family: "Feather", name: "star" },
          recommendations: [
            "Recomendado ter relações sexuais a cada 24-48 horas",
            "Evite lubrificantes que possam prejudicar a mobilidade dos espermatozoides",
            "Mantenha os níveis de estresse baixos para otimizar a chance de concepção",
          ],
        }
      }

      // Calculate score for other phases
      const score = calculateMpiqScore()

      if (score <= 22) {
        return {
          phase: "Fase Folicular",
          description: "Você está na fase folicular do seu ciclo. A fertilidade é geralmente baixa nesta fase.",
          color: COLORS.primary,
          icon: { family: "Feather", name: "wind" },
          recommendations: [
            "Período ideal para exames ginecológicos",
            "Bom momento para iniciar suplementos pré-concepção como ácido fólico",
            "Foque em construir reservas de energia para o período fértil",
          ],
        }
      } else {
        return {
          phase: "Fase Lútea",
          description: "Você está na fase lútea do seu ciclo. A fertilidade é geralmente baixa nesta fase.",
          color: COLORS.primary,
          icon: { family: "Feather", name: "moon" },
          recommendations: [
            "Aumente a ingestão de alimentos ricos em vitamina B6 e magnésio",
            "Evite cafeína e álcool para reduzir sintomas de TPM",
            "Pratique técnicas de relaxamento se estiver tentando conceber",
          ],
        }
      }
    } catch (error) {
      console.error("Error getting MPIQ result:", error)
      return {
        phase: "Indeterminada",
        description: "Não foi possível determinar a fase do ciclo.",
        color: COLORS.textSecondary,
        icon: { family: "Feather", name: "help-circle" },
        recommendations: ["Complete o questionário MPIQ para obter recomendações personalizadas"],
      }
    }
  }, [mpiqAnswers, calculateMpiqScore])

  // Handle temperature submission
 const handleSaveTemperature = useCallback(async () => {
  if (!temperature) {
    setNotificationMessage("Por favor, insira uma temperatura.")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
    return
  }

  const tempValue = parseFloat(temperature.replace(",", "."))
  if (isNaN(tempValue)) {
    setNotificationMessage("Valor inválido. Insira um número válido.")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
    return
  }

  setLoading(true)

  try {
    const response = await update_basal_temperature({
      basal_temperature: tempValue,
    })

    if (response?.success === true) {
      setNotificationMessage("Temperatura basal registrada com sucesso!")
      setTemperature("")
    } else if (response?.status === 404) {
      setNotificationMessage("Nenhum ciclo ou dia atual encontrado para registrar a temperatura.")
    } else {
      setNotificationMessage("Não foi possível registrar a temperatura. Tente novamente.")
    }
  } catch (error) {
    console.log("Erro ao salvar temperatura basal:", error)
    setNotificationMessage("Erro ao conectar com o servidor.")
    setTimeout(() => setShowNotification(false), 3000)
  } finally {
    setShowNotification(true)
    setLoading(false)
    setTimeout(() => setShowNotification(false), 3000)

    if (Platform.OS === "ios") {
      Vibration.vibrate([0, 30])
    } else {
      Vibration.vibrate(30)
    }
  }
}, [temperature])



  // Handle intercourse logging
  const handleLogIntercourse = useCallback(async () => {
  if (!hadIntercourse && !pregnancyTest && !observations) {
    setNotificationMessage("Preencha pelo menos um dos campos antes de registrar.")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
    return
  }

  setLoading(true)

  try {
    const response = await update_intercourse({
      hadIntercourse: hadIntercourse || null,
      pregnancyTest: pregnancyTest || null,
      observation: observations || null,
    })
    //console.log(response)

    if (/* response?.status === 200 &&  */response?.success === true) {
      setNotificationMessage("Relação sexual registrada com sucesso!")
      setObservations("")
      setPregnancyTest(null)
      setHadIntercourse(null)
    } else if (response?.status === 404) {
      setNotificationMessage("Nenhum ciclo ou dia atual encontrado para registrar o intercurso.")
    } else {
      setNotificationMessage("Não foi possível registrar o intercurso. Tente novamente.")
    }
  } catch (error) {
    console.log("Erro ao salvar intercurso:", error)
    setNotificationMessage("Erro ao conectar com o servidor.")
  } finally {
    setShowNotification(true)
    setLoading(false)
    setTimeout(() => setShowNotification(false), 3000)

    if (Platform.OS === "ios") {
      Vibration.vibrate([0, 30])
    } else {
      Vibration.vibrate(30)
    }
  }
}, [hadIntercourse, pregnancyTest, observations])

 
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

    return () => {
      fadeAnim.stopAnimation()
      slideAnim.stopAnimation()
    }
  }, [])

  // Animation for notification
  useEffect(() => {
    if (showNotification) {
      Animated.spring(notificationAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      notificationAnim.stopAnimation()
    }
  }, [showNotification])

  const [notes, setNotes] = useState("")

  // Show notification for peak fertility
  useEffect(() => {
    if (isFertilePeak()) {
      setNotificationMessage("Você está no pico fértil hoje. Probabilidade máxima de concepção!")
      setShowNotification(true)

      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isFertilePeak])

  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simular carregamento de dados 
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])


  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Animated.ScrollView
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <EnhancedGeometricPattern />

            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Fertilidade</Text>
                <Text style={styles.headerDate}>{formatFullDate(currentDate)}, hoje</Text>
              </View>

              {isInFertileWindow() ? (
                <View style={[styles.fertilityBadge, styles.fertilityWindowBadge]}>
                  <View style={styles.badgeContent}>
                    <Icon family="Feather" name={ICONS.sun} size={16} color={COLORS.primary} />
                    <Text style={styles.fertilityWindowBadgeText}>Janela Fértil</Text>
                  </View>
                </View>
              ) : isFertilePeak() ? (
                <View style={[styles.fertilityBadge, styles.peakFertilityBadge]}>
                  <View style={styles.badgeContent}>
                    <Icon family="Feather" name={ICONS.star} size={16} color={COLORS.highlight} />
                    <Text style={styles.peakFertilityBadgeText}>Pico de Fertilidade</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.fertilityAlert,
                {
                  backgroundColor: isInFertileWindow()
                    ? COLORS.primaryLight
                    : isInPeriod()
                      ? COLORS.secondaryLight
                      : COLORS.tertiaryLight,
                },
              ]}
              accessible={true}
              accessibilityLabel={
                isInFertileWindow()
                  ? "Alerta: Você está na janela fértil!"
                  : isInPeriod()
                    ? "Alerta: Você está no período menstrual."
                    : "Alerta: Acompanhe seu ciclo"
              }
              accessibilityHint="Toque para mais informações"
            >
              <Icon
                family="Feather"
                name={isInFertileWindow() ? ICONS.sun : isInPeriod() ? ICONS.menstrual : ICONS.luteal}
                size={24}
                color={isInFertileWindow() ? COLORS.primary : isInPeriod() ? COLORS.secondary : COLORS.tertiary}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.text }}>
                  {isInFertileWindow()
                    ? "Você está na janela fértil!"
                    : isInPeriod()
                      ? "Você está no período menstrual."
                      : "Acompanhe seu ciclo"}
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                  {isInFertileWindow()
                    ? "Aproveite para tentar conceber."
                    : isInPeriod()
                      ? "Descanse e cuide de si."
                      : "Registre seus dados para previsões mais precisas."}
                </Text>
              </View>
            </TouchableOpacity>

            {/* <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
                  if (Platform.OS === "ios") {
                    Vibration.vibrate([0, 10])
                  } else {
                    Vibration.vibrate(10)
                  }
                }}
                accessible={true}
                accessibilityLabel="Dia Anterior"
                accessibilityHint="Toque para ver o dia anterior"
              >
                <Icon
                  family="Feather"
                  name={ICONS.chevronLeft}
                  size={18}
                  color={COLORS.background}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.primaryButtonText}>Dia Anterior</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
                  if (Platform.OS === "ios") {
                    Vibration.vibrate([0, 10])
                  } else {
                    Vibration.vibrate(10)
                  }
                }}
                accessible={true}
                accessibilityLabel="Próximo Dia"
                accessibilityHint="Toque para ver o próximo dia"
              >
                <Text style={styles.secondaryButtonText}>Próximo Dia</Text>
                <Icon
                  family="Feather"
                  name={ICONS.chevronRight}
                  size={18}
                  color={COLORS.primary}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
 */}
            <View style={styles.cycleCard}>
              <View style={styles.cycleCardHeader}>
                <Icon family="Feather" name={ICONS.calendar} size={20} color={COLORS.primary} />
                <Text style={styles.cycleCardTitle}>Ciclo Menstrual</Text>
              </View>

              <EnhancedCycleProgressVisualization cyclePosition={cyclePosition} cycleData={cycleData} />

              <View style={styles.currentPhaseInfo}>
                <View style={styles.currentPhaseHeader}>
                  <Icon
                    family="Feather"
                    name={
                      cyclePosition <= 20
                        ? ICONS.menstrual
                        : cyclePosition <= 40
                          ? ICONS.follicular
                          : cyclePosition <= 60
                            ? ICONS.fertile
                            : ICONS.luteal
                    }
                    size={20}
                    color={
                      cyclePosition <= 20 ? COLORS.secondary : cyclePosition <= 40 ? COLORS.tertiary : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.currentPhaseTitle,
                      {
                        color:
                          cyclePosition <= 20
                            ? COLORS.secondary
                            : cyclePosition <= 40
                              ? COLORS.tertiary
                              : COLORS.primary,
                      },
                    ]}
                  >
                    {cyclePosition <= 20
                      ? "Fase Menstrual"
                      : cyclePosition <= 40
                        ? "Fase Folicular"
                        : cyclePosition <= 60
                          ? "Fase Fértil"
                          : "Fase Lútea"}
                  </Text>
                </View>
                <Text style={styles.currentPhaseDescription}>
                  {cyclePosition <= 20
                    ? "Início do ciclo, período de sangramento."
                    : cyclePosition <= 40
                      ? "Preparações para a ovulação."
                      : cyclePosition <= 60
                        ? "Período com maior probabilidade de gravidez."
                        : "Fase após a ovulação, antes da menstruação."}
                </Text>
              </View>
            </View>

           {/*  <View style={styles.conceptionCard}>
              <View style={styles.conceptionHeader}>
                <View>
                  <Text style={styles.conceptionLabel}>Probabilidade de Concepção</Text>
                  <Text style={[styles.conceptionValue, { color: conception.color }]}>{conception.label}</Text>
                </View>
                <EnhancedConceptionProbabilityMeter percentage={conception.percentage} />
              </View>   
            </View> */}

            <View style={styles.conceptionCard}>
              <View style={styles.conceptionHeader}>
                <View>
                  <Text style={styles.conceptionLabel}>Probabilidade de Concepção</Text>
                  <Text style={[styles.conceptionValue, { 
                    color: dadosCiclo?.probability_conception.intensidade === "Alta" ? COLORS.primary : 
                          dadosCiclo?.probability_conception.intensidade === "Média" ? COLORS.tertiary : COLORS.textSecondary 
                  }]}>
                    {dadosCiclo?.probability_conception.intensidade}
                  </Text>
                </View>
               {/*  <EnhancedConceptionProbabilityMeter percentage={dadosCiclo?.probability_conception.percentagem} /> */}
                <EnhancedConceptionProbabilityMeter percentage={dadosCiclo?.probability_conception.percentagem} /> 
              </View>
              {/* {dadosCiclo?.probability_conception.mensagem && (
                <Text style={styles.conceptionMessage}>{dadosCiclo?.probability_conception.mensagem}</Text>
              )} */}
            </View>

            {/* <View style={styles.conceptionCard}>
              <View style={styles.conceptionHeader}>
                <View>
                  <Text style={styles.conceptionLabel}>Probabilidade de Concepção</Text>
                  <Text style={[styles.conceptionValue, { 
                    color: dadosCiclo.probability_conception.intensidade === "Alta" ? COLORS.primary : 
                          dadosCiclo.probability_conception.intensidade === "Média" ? COLORS.tertiary : COLORS.textSecondary 
                  }]}>
                    {dadosCiclo.probability_conception.intensidade}
                  </Text>
                </View>
                <EnhancedConceptionProbabilityMeter percentage={dadosCiclo.probability_conception.percentagem} />
              </View>
              {dadosCiclo.probability_conception.mensagem && (
                <Text style={styles.conceptionMessage}>{dadosCiclo.probability_conception.mensagem}</Text>
              )}
            </View> */} 

            <View style={styles.keyDatesGrid}>
              <View style={styles.keyDateCard}>
                <View style={[styles.keyDateIcon, styles.fertileWindowIcon]}> 
                  <Icon family="Feather" name={ICONS.sun} size={20} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.keyDateLabel}>Início da Janela Fértil</Text>
                  <Text style={styles.keyDateValue}>{dadosCiclo?.fertile_period.inicio_janela_fertil}</Text>
                </View>
              </View>

              <View style={styles.keyDateCard}>
                <View style={[styles.keyDateIcon, styles.ovulationIcon]}>
                  <Icon family="Feather" name={ICONS.star} size={20} color={COLORS.highlight} />
                </View>
                <View>
                  <Text style={styles.keyDateLabel}>Dia de Ovulação</Text>
                  <Text style={styles.keyDateValue}>
                    {/* {formatDate(cycleData.fertileWindow[Math.floor(cycleData.fertileWindow.length / 2)])} */}
                    {dadosCiclo?.menstrual_cycle.data_ovulacao} 
                  </Text>
                </View>
              </View>

              <View style={styles.keyDateCard}>
                <View style={[styles.keyDateIcon, styles.periodIcon]}>
                  <Icon family="Feather" name={ICONS.menstrual} size={20} color={COLORS.secondary} />
                </View>
                <View>
                  <Text style={styles.keyDateLabel}>Próxima Menstruação</Text>
                  <Text style={styles.keyDateValue}>{/* {formatDate(cycleData.nextPeriod)} */}{dadosCiclo?.proxima_menstruacao}</Text>
                </View>
              </View>

              <View style={styles.keyDateCard}>
                <View style={[styles.keyDateIcon, styles.cycleLengthIcon]}>
                  <Icon family="Feather" name={ICONS.calendar} size={20} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.keyDateLabel}>Duração do Ciclo</Text>
                  <Text style={styles.keyDateValue}>{/* {cycleData.currentCycle.length} dias */}{dadosCiclo?.menstrual_cycle.duracao_ciclo} dias</Text>
                </View>
              </View>
            </View>

            <EnhancedTemperatureChart data={cycleData.temperatures} basalTemperature={dadosCiclo?.basal_temperature}  />

          {/*  <EnhancedTemperatureChart 
              data={dadosCiclo?.mesntrual_cycle
                ?.flatMap(fase => fase.dias)
                ?.filter(dia => dia.temperatura_basal !== null)
                ?.map(dia => ({ 
                  date: dia.date,
                  temp: dia.temperatura_basal as number
                })) || []} 
            /> */}

            <View style={styles.wisdomCard}>
              {/* <View style={styles.wisdomHeader}>
                <Icon family="Feather" name={ICONS.wisdom} size={20} color={COLORS.primary} />
                <Text style={styles.wisdomHeaderTitle}>Sabedoria Ancestral</Text>
              </View>
              <View style={styles.wisdomContent}>
                <Text style={styles.wisdomTitle}>{traditionalWisdom.title}</Text>
                <Text style={styles.wisdomDescription}>{traditionalWisdom.content}</Text>
              </View> */} 
              {dadosCiclo && dadosCiclo.ancestral_tip_random && (
                <View style={styles.wisdomCard}>
                  <View style={styles.wisdomHeader}>
                    <Icon family="Feather" name={ICONS.wisdom} size={20} color={COLORS.primary} />
                    <Text style={styles.wisdomHeaderTitle}>Sabedoria Ancestral</Text>
                  </View>
                  <View style={styles.wisdomContent}>
                    <Text style={styles.wisdomTitle}>{dadosCiclo.ancestral_tip_random.titulo}</Text>
                    <Text style={styles.wisdomDescription}>{dadosCiclo.ancestral_tip_random.conteudo}</Text>
                  </View>
                </View>
              )}

            </View>

            <View style={styles.bottomSpacing} />
          </Animated.ScrollView>
        )

      case "tracking":
        return (
          <Animated.ScrollView
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.trackingCard}>
              <View style={styles.trackingCardHeader}>
                <Icon family="Feather" name={ICONS.temperature} size={20} color={COLORS.primary} />
                <Text style={styles.trackingCardTitle}>Acompanhamento Diário</Text>
              </View>
              <Text style={styles.trackingCardDescription}>
                Registre sua temperatura basal — a mais baixa do corpo em repouso, medida ao acordar — para um acompanhamento mais preciso do ciclo.
              </Text>


              <View style={styles.temperatureInputContainer}>
                <Text style={styles.inputLabel}>Temperatura Basal (°C)</Text>
                <View style={styles.temperatureInputRow}>
                  <TextInput
                    style={styles.temperatureInput}
                    placeholder="Ex: 36,5"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="decimal-pad"
                    value={temperature}
                    onChangeText={setTemperature}
                    accessible={true}
                    accessibilityLabel="Campo de entrada para temperatura basal"
                    accessibilityHint="Insira sua temperatura basal em graus Celsius"
                  />
                  <TouchableOpacity
                    style={styles.saveTemperatureButton}
                    onPress={handleSaveTemperature}
                    disabled={isLoading}
                    accessible={true}
                    accessibilityLabel="Salvar temperatura"
                    accessibilityHint="Toque para salvar a temperatura inserida"
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color={COLORS.background} />
                    ) : (
                      <Text style={styles.saveTemperatureButtonText}>Salvar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          {/*   <ExpandableCard
              title="Questionário MPIQ"
              icon="edit-3"
              id="mpiq"
              isExpanded={expandedCard === "mpiq"}
              onToggle={() => setExpandedCard(expandedCard === "mpiq" ? null : "mpiq")}
            >
              <View style={styles.mpiqQuestionsContainer}>
                <View style={styles.mpiqQuestionHeader}>
                  <View style={styles.mpiqQuestionNumber}>
                    <Text style={styles.mpiqQuestionNumberText}>1</Text>
                  </View>
                  <Text style={styles.mpiqQuestionText}>
                    Quantos dias se passaram desde o início da sua última menstruação?
                  </Text>
                </View>
                <View style={styles.mpiqInputContainer}>
                  <TextInput
                    style={styles.mpiqInput}
                    placeholder="Número de dias"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="number-pad"
                    value={mpiqAnswers.lastPeriodDays}
                    onChangeText={(value) => handleMpiqChange("lastPeriodDays", value)}
                    accessible={true}
                    accessibilityLabel="Dias desde o início da última menstruação"
                  />
                </View>

                <View style={styles.mpiqQuestionHeader}>
                  <View style={styles.mpiqQuestionNumber}>
                    <Text style={styles.mpiqQuestionNumberText}>2</Text>
                  </View>
                  <Text style={styles.mpiqQuestionText}>Qual a consistência do seu corrimento vaginal hoje?</Text>
                </View>
                <View style={styles.mpiqOptionsGrid}>
                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeConsistency === "sticky" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeConsistency", "sticky")}
                    accessible={true}
                    accessibilityLabel="Opção: Pegajoso"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeConsistency === "sticky" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeConsistency === "sticky" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Pegajoso</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeConsistency === "creamy" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeConsistency", "creamy")}
                    accessible={true}
                    accessibilityLabel="Opção: Cremoso"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeConsistency === "creamy" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeConsistency === "creamy" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Cremoso</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeConsistency === "stretchy" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeConsistency", "stretchy")}
                    accessible={true}
                    accessibilityLabel="Opção: Elástico"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeConsistency === "stretchy" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeConsistency === "stretchy" && (
                        <View style={styles.mpiqOptionRadioSelected} />
                      )}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Elástico</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeConsistency === "bloody" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeConsistency", "bloody")}
                    accessible={true}
                    accessibilityLabel="Opção: Com Sangue"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeConsistency === "bloody" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeConsistency === "bloody" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Com Sangue</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.mpiqQuestionHeader}>
                  <View style={styles.mpiqQuestionNumber}>
                    <Text style={styles.mpiqQuestionNumberText}>3</Text>
                  </View>
                  <Text style={styles.mpiqQuestionText}>Qual a aparência do seu corrimento vaginal hoje?</Text>
                </View>
                <View style={styles.mpiqOptionsGrid}>
                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeAppearance === "white" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeAppearance", "white")}
                    accessible={true}
                    accessibilityLabel="Opção: Branco"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeAppearance === "white" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeAppearance === "white" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Branco</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeAppearance === "clear" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeAppearance", "clear")}
                    accessible={true}
                    accessibilityLabel="Opção: Transparente"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeAppearance === "clear" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeAppearance === "clear" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Transparente</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.dischargeAppearance === "red" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("dischargeAppearance", "red")}
                    accessible={true}
                    accessibilityLabel="Opção: Vermelho"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.dischargeAppearance === "red" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.dischargeAppearance === "red" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Vermelho</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.mpiqQuestionHeader}>
                  <View style={styles.mpiqQuestionNumber}>
                    <Text style={styles.mpiqQuestionNumberText}>4</Text>
                  </View>
                  <Text style={styles.mpiqQuestionText}>Qual a sensação na sua vagina hoje?</Text>
                </View>
                <View style={styles.mpiqOptionsGrid}>
                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.vaginalSensation === "dry" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("vaginalSensation", "dry")}
                    accessible={true}
                    accessibilityLabel="Opção: Seca"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.vaginalSensation === "dry" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.vaginalSensation === "dry" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Seca</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.vaginalSensation === "moist" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("vaginalSensation", "moist")}
                    accessible={true}
                    accessibilityLabel="Opção: Úmida"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.vaginalSensation === "moist" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.vaginalSensation === "moist" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Úmida</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.vaginalSensation === "wet" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("vaginalSensation", "wet")}
                    accessible={true}
                    accessibilityLabel="Opção: Molhada"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.vaginalSensation === "wet" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.vaginalSensation === "wet" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Molhada</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mpiqOptionCard,
                      mpiqAnswers.vaginalSensation === "slippery" && styles.mpiqOptionCardSelected,
                    ]}
                    onPress={() => handleMpiqChange("vaginalSensation", "slippery")}
                    accessible={true}
                    accessibilityLabel="Opção: Escorregadia"
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mpiqAnswers.vaginalSensation === "slippery" }}
                  >
                    <View style={styles.mpiqOptionRadio}>
                      {mpiqAnswers.vaginalSensation === "slippery" && <View style={styles.mpiqOptionRadioSelected} />}
                    </View>
                    <Text style={styles.mpiqOptionLabel}>Escorregadia</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.calculateMpiqButton}
                  accessible={true}
                  accessibilityLabel="Calcular Fase do Ciclo"
                  accessibilityHint="Toque para calcular a fase do ciclo com base nas respostas"
                >
                  <Text style={styles.calculateMpiqButtonText}>Calcular Fase do Ciclo</Text>
                </TouchableOpacity>
              </View>
            </ExpandableCard> */}

            <View style={styles.bottomSpacing} />
          </Animated.ScrollView>
          
        )

      case "intercourse":
        return (
          <Animated.ScrollView
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.trackingCard}>
              <View style={styles.trackingCardHeader}>
                <Icon family="Feather" name={ICONS.intercourse} size={20} color={COLORS.primary} />
                <Text style={styles.trackingCardTitle}>Registro de Relações</Text>
              </View>
              <Text style={styles.trackingCardDescription}>
                Registre suas relações sexuais para otimizar suas chances de concepção.
              </Text>

             {/*  <View style={styles.dateInputContainer}>
                <Text style={styles.inputLabel}>Data da Relação</Text>
                <View style={styles.dateInputRow}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={COLORS.textTertiary}
                    value={intercourseDate}
                    onChangeText={setIntercourseDate}
                    accessible={true}
                    accessibilityLabel="Campo de entrada para data da relação"
                    accessibilityHint="Insira a data no formato DD/MM/AAAA ou deixe em branco para usar a data de hoje"
                  />
                  
                  <TouchableOpacity
                    style={styles.logIntercourseButton}
                    onPress={handleLogIntercourse}
                    disabled={isLoading}
                    accessible={true}
                    accessibilityLabel="Registrar relação"
                    accessibilityHint="Toque para registrar a relação sexual na data informada"
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color={COLORS.background} />
                    ) : (
                      <Text style={styles.logIntercourseButtonText}>Registrar</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.dateInputHint}>Deixe em branco para usar a data de hoje</Text>
              </View> */}

           <View style={styles.dateInputContainer}>
 {/*  <Text style={styles.inputLabel}>Data da Relação</Text>
  <View style={styles.dateInputRow}>
    <TextInput
      style={styles.dateInput}
      placeholder="DD/MM/AAAA"
      placeholderTextColor={COLORS.textTertiary}
      value={intercourseDate}
      onChangeText={setIntercourseDate}
      accessible={true}
      accessibilityLabel="Campo de entrada para data da relação"
      accessibilityHint="Insira a data no formato DD/MM/AAAA ou deixe em branco para usar a data de hoje"
    />
    
    <TouchableOpacity
      style={styles.logIntercourseButton}
      onPress={handleLogIntercourse}
      disabled={isLoading}
      accessible={true}
      accessibilityLabel="Registrar relação"
      accessibilityHint="Toque para registrar a relação sexual na data informada"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.background} />
      ) : (
        <Text style={styles.logIntercourseButtonText}>Registrar</Text>
      )}
    </TouchableOpacity>
  </View>
  <Text style={styles.dateInputHint}>Deixe em branco para usar a data de hoje</Text>
 */}
  {/* Select para Teve Intercurso? */}
  <View style={styles.selectContainer}>
    <Text style={styles.inputLabel}>Teve intercurso?</Text>
    <View style={styles.radioGroup}>
      <TouchableOpacity 
        style={[styles.radioButton, hadIntercourse === true && styles.radioButtonSelected]}
        onPress={() => setHadIntercourse(true)}
        accessible={true}
        accessibilityLabel="Sim, teve intercurso"
        accessibilityRole="radio"
        accessibilityState={{selected: hadIntercourse === true}}
      >
        <Text style={[styles.radioText, hadIntercourse === true && styles.radioTextSelected]}>Sim</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.radioButton, hadIntercourse === false && styles.radioButtonSelected]}
        onPress={() => setHadIntercourse(false)}
        accessible={true}
        accessibilityLabel="Não teve intercurso"
        accessibilityRole="radio"
        accessibilityState={{selected: hadIntercourse === false}}
      >
        <Text style={[styles.radioText, hadIntercourse === false && styles.radioTextSelected]}>Não</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* Select para Teste de Gravidez (condicional) */}
  {hadIntercourse === true && (
    <View style={styles.selectContainer}>
      <Text style={styles.inputLabel}>Teste de gravidez</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity 
          style={[styles.radioButton, pregnancyTest === 'positive' && styles.radioButtonSelected]}
          onPress={() => setPregnancyTest('positive')}
          accessible={true}
          accessibilityLabel="Teste positivo"
          accessibilityRole="radio"
          accessibilityState={{selected: pregnancyTest === 'positive'}}
        >
          <Text style={[styles.radioText, pregnancyTest === 'positive' && styles.radioTextSelected]}>Positivo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.radioButton, pregnancyTest === 'negative' && styles.radioButtonSelected]}
          onPress={() => setPregnancyTest('negative')}
          accessible={true}
          accessibilityLabel="Teste negativo"
          accessibilityRole="radio"
          accessibilityState={{selected: pregnancyTest === 'negative'}}
        >
          <Text style={[styles.radioText, pregnancyTest === 'negative' && styles.radioTextSelected]}>Negativo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}

  {/* TextArea para Observações */}
  <View style={styles.textAreaContainer}>
    <Text style={styles.inputLabel}>Observações</Text>
    <TextInput
      style={styles.textArea}
      placeholder="Adicione quaisquer observações relevantes..."
      placeholderTextColor={COLORS.textTertiary}
      value={observations}
      onChangeText={setObservations}
      multiline={true}
      numberOfLines={4}
      textAlignVertical="top" 
      accessible={true}
      accessibilityLabel="Campo de observações"
      accessibilityHint="Insira quaisquer observações adicionais sobre o registro"
    />
  </View>
  <Text></Text>
  <TouchableOpacity
      style={styles.logIntercourseButton}
      onPress={handleLogIntercourse}
      disabled={isLoading}
      accessible={true}
      accessibilityLabel="Registrar relação"
      accessibilityHint="Toque para registrar a relação sexual na data informada"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.background} />
      ) : (
        <Text style={styles.logIntercourseButtonText}>Registrar</Text>
      )}
    </TouchableOpacity>
</View>

            </View>

            {/* <View style={styles.trackingCard}>
              <View style={styles.trackingCardHeader}>
                <Icon family="Feather" name={ICONS.calendar} size={20} color={COLORS.primary} />
                <Text style={styles.trackingCardTitle}>Histórico de Relações</Text>
              </View>

              <View style={styles.intercourseHistoryContainer}>
                {intercourseHistory.length > 0 ? (
                  <ScrollView
                    style={styles.intercourseHistoryList}
                    showsVerticalScrollIndicator={false}
                    accessible={true}
                    accessibilityLabel={`Histórico de relações: ${intercourseHistory.length} registros`}
                  >
                    {intercourseHistory.map((dateStr, index) => {
                      const date = new Date(dateStr)
                      const isFertile = isIntercourseDateInFertileWindow(dateStr)

                      return (
                        <View
                          key={index}
                          style={[styles.intercourseHistoryItem, isFertile && styles.intercourseHistoryItemFertile]}
                          accessible={true}
                          accessibilityLabel={`Relação em ${formatDate(date)}, ${isFertile ? "durante" : "fora da"} janela fértil`}
                        >
                          <View style={styles.intercourseHistoryItemLeft}>
                            <View
                              style={[styles.intercourseHistoryIcon, isFertile && styles.intercourseHistoryIconFertile]}
                            >
                              <Icon
                                family="Feather"
                                name={isFertile ? ICONS.sun : ICONS.intercourse}
                                size={18}
                                color={isFertile ? COLORS.primary : COLORS.textSecondary}
                              />
                            </View>
                            <View>
                              <Text style={styles.intercourseHistoryDate}>{formatDate(date)}</Text>
                              <Text style={styles.intercourseHistoryStatus}>
                                {isFertile ? "Durante janela fértil" : "Fora da janela fértil"}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.removeIntercourseButton}
                            onPress={() => {
                              Vibration.vibrate(10)
                              setIntercourseHistory((prev) => prev.filter((_, i) => i !== index))
                            }}
                            accessible={true}
                            accessibilityLabel={`Remover registro de ${formatDate(date)}`}
                            accessibilityHint="Toque para remover este registro do histórico"
                          >
                            <Text style={styles.removeIntercourseButtonText}>Remover</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyIntercourseHistory}>
                    <Text style={styles.emptyIntercourseHistoryText}>
                      Nenhuma relação registrada. Registre suas relações para otimizar suas chances de concepção.
                    </Text>
                  </View>
                )}
              </View>
            </View> */}

            <View style={styles.conceptionTip}>
              <Icon family="Feather" name={ICONS.info} size={24} color={COLORS.primary} />
              <View style={styles.conceptionTipContent}>
                <Text style={styles.conceptionTipTitle}>Dica para Concepção</Text>
                <Text style={styles.conceptionTipDescription}>
                  Para maximizar suas chances de concepção, tente ter relações sexuais a cada 1-2 dias durante sua
                  janela fértil, especialmente nos dias próximos à ovulação.
                </Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </Animated.ScrollView>
        )

     /*  case "analysis":
        return (
          <Animated.ScrollView
            style={[
              styles.tabContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.analysisCard}>
              <View style={styles.analysisCardHeader}>
                <View style={styles.analysisCardHeaderLeft}>
                  <View style={styles.analysisCardIconContainer}>
                    <Icon family="Feather" name={ICONS.analysis} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.analysisCardTitle}>Análise de Fertilidade</Text>
                </View>
                <TouchableOpacity
                  style={styles.analysisCardInfoButton}
                  accessible={true}
                  accessibilityLabel="Informações sobre análise de fertilidade"
                  accessibilityHint="Toque para obter mais informações sobre a análise de fertilidade"
                >
                  <Icon family="Feather" name={ICONS.info} size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.analysisCardDescription}>
                Baseado nos seus dados, aqui está uma análise das suas chances de concepção e recomendações
                personalizadas.
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard} accessible={true} accessibilityLabel="Ciclo Médio: 28 dias">
                  <Text style={styles.statLabel}>Ciclo Médio</Text>
                  <Text style={styles.statValue}>28</Text>
                  <Text style={styles.statSubtext}>dias</Text>
                </View>
                <View style={styles.statCard} accessible={true} accessibilityLabel="Período Médio: 5 dias">
                  <Text style={styles.statLabel}>Período Médio</Text>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statSubtext}>dias</Text>
                </View>
              </View>

              <View style={styles.conceptionChancesSection}>
                <Text style={styles.sectionTitle}>Chances de Concepção</Text>
                <View
                  style={[
                    styles.conceptionChancesBox,
                    { borderColor: conceptionChances.color, backgroundColor: `${conceptionChances.color}10` },
                  ]}
                  accessible={true}
                  accessibilityLabel={`Timing de Relações: ${conceptionChances.score}. ${conceptionChances.description}`}
                >
                  <View style={styles.conceptionChancesBoxHeader}>
                    <Text style={styles.conceptionChancesBoxTitle}>Timing de Relações</Text>
                    <View style={[styles.conceptionChancesBadgeSmall, { backgroundColor: conceptionChances.color }]}>
                      <Text style={styles.conceptionChancesBadgeSmallText}>{conceptionChances.score}</Text>
                    </View>
                  </View>
                  <Text style={styles.conceptionChancesBoxDescription}>{conceptionChances.description}</Text>
                </View>
              </View>

              <View style={styles.frequencyContainer}>
                <Text style={styles.frequencyLabel}>Frequência de Relações</Text>
                <View style={styles.frequencyScale}>
                  <Text style={styles.frequencyScaleText}>Baixa</Text>
                  <Text style={styles.frequencyScaleText}>Ideal</Text>
                  <Text style={styles.frequencyScaleText}>Alta</Text>
                </View>
                <View
                  style={styles.frequencyBar}
                  accessible={true}
                  accessibilityLabel={`Frequência de relações: ${
                    intercourseHistory.length < 3 ? "Baixa" : intercourseHistory.length > 7 ? "Alta" : "Ideal"
                  }`}
                >
                  <View style={styles.frequencyIdealZone} />
                  <View
                    style={[
                      styles.frequencyIndicator,
                      { left: `${Math.min(Math.max((intercourseHistory.length / 10) * 100, 10), 90)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.frequencyHint}>
                  {intercourseHistory.length < 3
                    ? "Considere aumentar a frequência de relações durante a janela fértil."
                    : intercourseHistory.length > 7
                      ? "Sua frequência está boa, mas lembre-se que qualidade é mais importante que quantidade."
                      : "Sua frequência de relações está na faixa ideal para concepção."}
                </Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </Animated.ScrollView>
        ) */

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Notification */}
        <Animated.View
          style={[
            styles.notification,
            {
              transform: [{ translateY: notificationAnim }],
            },
          ]}
          accessible={true}
          accessibilityLiveRegion="polite"
          accessibilityLabel={notificationMessage}
        >
          <View style={styles.notificationContent}>
            <Icon family="Feather" name={ICONS.info} size={20} color={COLORS.primary} />
            <Text style={styles.notificationText}>{notificationMessage}</Text>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: COLORS.cardDark,
                  width: "25%",
                  left:
                    activeTab === "overview"
                      ? "0%"
                      : activeTab === "tracking"
                        ? "25%"
                        : activeTab === "intercourse"
                          ? "50%"
                          : "75%",
                  borderRadius: 16,
                },
              ]}
            />

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("overview")}
              accessible={true}
              accessibilityLabel="Aba Visão Geral"
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "overview" }}
            >
              <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Visão Geral</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("tracking")}
              accessible={true}
              accessibilityLabel="Aba Acompanhamento"
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "tracking" }}
            >
              <Text style={[styles.tabText, activeTab === "tracking" && styles.activeTabText]}>Acompanhamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("intercourse")}
              accessible={true}
              accessibilityLabel="Aba Relações"
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "intercourse" }}
            >
              <Text style={[styles.tabText, activeTab === "intercourse" && styles.activeTabText]}>Relações</Text>
            </TouchableOpacity>
{/* 
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("analysis")}
              accessible={true}
              accessibilityLabel="Aba Análise"
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "analysis" }}
            >
              <Text style={[styles.tabText, activeTab === "analysis" && styles.activeTabText]}>Análise</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {renderTabContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// Update the styles object with new modern styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  patternContainer: {
    position: "absolute",
    top: -20,
    right: -20,
    opacity: 0.5,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fertilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  fertilityWindowBadge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: `${COLORS.primary}50`,
  },
  peakFertilityBadge: {
    backgroundColor: COLORS.highlightLight,
    borderColor: `${COLORS.highlight}50`,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fertilityWindowBadgeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  peakFertilityBadgeText: {
    fontSize: 13,
    color: COLORS.highlight,
    fontWeight: "600",
    marginLeft: 6,
  },
  notification: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 100,
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 4,
    position: "relative",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 11, 
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
  },
  // Cycle Card Styles - modernized
  cycleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cycleCardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },
  cycleCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 8,
  },
  cycleVisualization: {
    padding: 20,
    position: "relative",
  },
  cycleProgressContainer: {
    marginBottom: 16,
  },
  cycleProgressBackground: {
    height: 70,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cycleProgressGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cyclePhase: {
    position: "absolute",
    top: 8,
    alignItems: "center",
    zIndex: 10,
  },
  cyclePhaseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cyclePhaseIconContainerActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  cyclePhaseText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  cyclePhaseTextActive: {
    color: COLORS.text,
  },
  cycleMarker: {
    position: "absolute",
    width: 4,
    height: 70,
    zIndex: 5,
  },
  ovulationMarker: {
    backgroundColor: `${COLORS.highlight}70`,
    shadowColor: COLORS.highlight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  ovulationMarkerPulse: {
    position: "absolute",
    top: 10,
    left: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${COLORS.highlight}30`,
  },
  ovulationMarkerDot: {
    position: "absolute",
    top: 15,
    left: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.highlight,
    shadowColor: COLORS.highlight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  currentDayMarker: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  currentDayMarkerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: 27,
    left: -6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  phaseSegment: {
    position: "absolute",
    height: 4,
    bottom: 10,
    zIndex: 2,
  },
  menstrualSegment: {
    left: "0%",
    width: "20%",
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  follicularSegment: {
    left: "20%",
    width: "20%",
    backgroundColor: COLORS.tertiary,
  },
  fertileSegment: {
    left: "40%",
    width: "20%",
    backgroundColor: COLORS.primary,
  },
  lutealSegment: {
    left: "60%",
    width: "40%",
    backgroundColor: COLORS.primary,
    opacity: 0.7,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  cycleScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cycleScaleText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  phaseInfoContainer: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  phaseInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  phaseInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  phaseInfoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  cyclePhaseTip: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  cyclePhaseTipText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  cyclePhaseTipClose: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  currentPhaseInfo: {
    margin: 20,
    padding: 16,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  currentPhaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  currentPhaseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 10,
  },
  currentPhaseDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Conception Card Styles - modernized
  conceptionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    padding: 20,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  conceptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conceptionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  conceptionValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  conceptionMeterContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  conceptionMeterTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
  },
  conceptionMeterPercentage: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // Key Dates Grid Styles - modernized
  keyDatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  keyDateCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  keyDateIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fertileWindowIcon: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  ovulationIcon: {
    backgroundColor: COLORS.highlightLight,
    borderWidth: 1,
    borderColor: `${COLORS.highlight}30`,
  },
  periodIcon: {
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: `${COLORS.secondary}30`,
  },
  cycleLengthIcon: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  keyDateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  keyDateValue: {
    fontSize: 11, 
    fontWeight: "700",
    color: COLORS.text,
    overflow: "hidden", 
  },
  // Temperature Chart Styles - modernized
  temperatureChartContainer: {
    height: 70,
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  chartLegend: {
    flexDirection: "row",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chartContent: {
    flex: 1,
    flexDirection: "row",
  },
  chartYAxis: {
    width: 30,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingVertical: 10,
  },
  chartAxisLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  chartMainArea: {
    flex: 1,
    position: "relative",
  },
  chartHorizontalLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  chartHLine: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  chartThresholdLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 20,
    justifyContent: "center",
    zIndex: 5,
  },
  chartThresholdLineInner: {
    height: 1,
    backgroundColor: `${COLORS.primary}80`,
    width: "100%",
  },
  chartThresholdText: {
    position: "absolute",
    right: 0,
    fontSize: 9,
    color: COLORS.primary,
    backgroundColor: COLORS.card,
    paddingHorizontal: 4,
  },
  chartBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingVertical: 10,
    zIndex: 10,
  },
  chartBarColumn: {
    alignItems: "center",
    width: 30,
    height: "100%",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 14,
    borderRadius: 7,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  chartTooltip: {
    position: "absolute",
    top: -40,
    backgroundColor: COLORS.cardDark,
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    width: 60,
    zIndex: 20,
  },
  chartTooltipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
  },
  chartTooltipSubtext: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chartAnchorPoint: {
    position: "absolute",
    width: 1,
    height: 1,
    backgroundColor: "transparent",
  },
  chartTrendLine: {
    position: "absolute",
    top: 16,
    left: 46,
    zIndex: 15,
  },
  // Action Buttons Styles - modernized
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginRight: 10,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    marginLeft: 10,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: "row",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  // Tracking Card Styles
  trackingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    padding: 20,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  trackingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  trackingCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 12,
  },
  trackingCardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  temperatureInputContainer: {
    marginTop: 20,
  },
   sectionDivider: {
    height: 1,
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  temperatureInputRow: {
    flexDirection: "row",
  },
   trackerContent: {
    padding: 16,
  },
  temperatureInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    color: COLORS.text,
    backgroundColor: COLORS.cardDark,
    fontSize: 16,
  },
  saveTemperatureButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveTemperatureButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
  },
  // Additional styles for other components
  fertilityAlert: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  wisdomCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  wisdomHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: `${COLORS.primary}10`,
  },
  wisdomHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 12,
  },
  wisdomContent: {
    padding: 20,
  },
  wisdomTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },
  wisdomDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  // Styles for intercourse tab
  dateInputContainer: {
    marginBottom: 16,
  },
  dateInputRow: {
    flexDirection: "row",
  },
  dateInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    color: COLORS.text,
    backgroundColor: COLORS.cardDark,
    fontSize: 16,
  },
  logIntercourseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logIntercourseButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
  },
  dateInputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  intercourseHistoryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  intercourseHistoryList: {
    maxHeight: 240,
  },
  intercourseHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.cardDark,
  },
  intercourseHistoryItemFertile: {
    backgroundColor: `${COLORS.primary}10`,
    borderColor: `${COLORS.primary}30`,
  },
  intercourseHistoryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  intercourseHistoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.textSecondary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  intercourseHistoryIconFertile: {
    backgroundColor: `${COLORS.primary}10`,
  },
  intercourseHistoryDate: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  intercourseHistoryStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  removeIntercourseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeIntercourseButtonText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  emptyIntercourseHistory: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  emptyIntercourseHistoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  conceptionTip: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginTop: 20,
  },
  conceptionTipContent: {
    marginLeft: 12,
    flex: 1,
  },
  conceptionTipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 6,
  },
  conceptionTipDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Stats styles
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  frequencyScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  frequencyScaleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  frequencyBar: {
    height: 10,
    backgroundColor: COLORS.cardDark,
    borderRadius: 5,
    position: "relative",
    marginBottom: 8,
  },
  frequencyIdealZone: {
    position: "absolute",
    left: "30%",
    right: "30%",
    top: 0,
    bottom: 0,
    backgroundColor: `${COLORS.primary}30`,
    borderRadius: 5,
  },
  frequencyIndicator: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    top: -3,
    transform: [{ translateX: -8 }],
  },
  frequencyHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  conceptionChancesSection: {
    marginTop: 16,
  },
  conceptionChancesBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  conceptionChancesBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  conceptionChancesBoxTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  conceptionChancesBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  conceptionChancesBadgeSmallText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.background,
  },
  conceptionChancesBoxDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // MPIQ styles
  mpiqQuestionsContainer: {
    padding: 20,
    paddingTop: 8,
  },
  mpiqQuestionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  mpiqQuestionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  mpiqQuestionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  mpiqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  mpiqInputContainer: {
    position: "relative",
    marginBottom: 20,
  },
  mpiqInput: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: COLORS.text,
    backgroundColor: COLORS.cardDark,
    fontSize: 16,
  },
  mpiqOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  mpiqOptionCard: {
    width: "48%",
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },
  mpiqOptionCardSelected: {
    backgroundColor: `${COLORS.primary}15`,
    borderColor: COLORS.primary,
  },
  mpiqOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mpiqOptionRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  mpiqOptionLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  calculateMpiqButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  calculateMpiqButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
  },
  // Analysis Card Styles
  analysisCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    padding: 0,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: "relative",
  },
  analysisCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  analysisCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  analysisCardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  analysisCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  analysisCardInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.textSecondary}10`,
    justifyContent: "center",
    alignItems: "center",
  },
  analysisCardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // Expandable Card Styles
  expandableCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  expandableCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  expandableCardTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandableCardTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  expandableCardContent: {
    overflow: "hidden",
  },
  bottomSpacing: {
    height: 80,
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

  selectContainer: {
  marginTop: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginRight: 8,
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

  textAreaContainer: {
    marginTop: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100, // Altura mínima
    textAlignVertical: 'top', // Para Android
    color: COLORS.primary,
    backgroundColor: COLORS.background,
  },
})

export default FertilityScreen
