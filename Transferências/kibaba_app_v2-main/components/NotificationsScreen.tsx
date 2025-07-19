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

// Import the Icon component from App.tsx
import { Icon } from "../App"

// Add import for TabIndicator at the top of the file
import TabIndicator from "./TabIndicator"
import { notifications as listNotifications, markAsReadNotification, removeNotification, markAllAsReadNotifications, removeAllNotifications } from "../services/authed/main-service"

const { width } = Dimensions.get("window")

// Notification type definition
const notificationTypes = {
  "Início do Período": {
    icon: { family: "Feather", name: "moon" },
    color: "#E57373",
    bgColor: "rgba(229, 115, 115, 0.2)",
  },
  "Janela Fértil": {
    icon: { family: "Feather", name: "droplet" },
    color: "#F9A826",
    bgColor: "rgba(249, 168, 38, 0.2)",
  },
  "Ovulação": {
    icon: { family: "Feather", name: "star" },
    color: "#F9A826",
    bgColor: "rgba(249, 168, 38, 0.2)",
  },
  "Medicação": {
    icon: { family: "Feather", name: "pill" },
    color: "#FFFFFF",
    bgColor: "rgba(255, 255, 255, 0.1)",
  },
  "Dica de Saúde": {
    icon: { family: "Feather", name: "heart" },
    color: "#F9A826",
    bgColor: "rgba(249, 168, 38, 0.2)",
  },
  "Lembrete": {
    icon: { family: "Feather", name: "bell" },
    color: "#F9A826",
    bgColor: "rgba(249, 168, 38, 0.2)",
  },
  default: {
    icon: { family: "Feather", name: "info" },
    color: "#AAAAAA",
    bgColor: "rgba(170, 170, 170, 0.1)",
  },
};
const NotificationsScreen = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null)

  // Add state for tabsWidth
  const [tabsWidth, setTabsWidth] = useState(width)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current
  const optionsMenuAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await listNotifications();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifications();
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

  // Animation for tab change
  useEffect(() => {
  let position = 0
  if (activeTab === "unread") position = 1
  else if (activeTab === "cycle") position = 2
  else if (activeTab === "fertility") position = 3
  else if (activeTab === "tips") position = 4

  Animated.timing(tabIndicatorPosition, {
    toValue: position,
    duration: 300,
    useNativeDriver: true,
    easing: Easing.out(Easing.cubic),
  }).start()
}, [activeTab])

  // Animation for options menu
  useEffect(() => {
    Animated.timing(optionsMenuAnim, {
      toValue: showOptionsMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [showOptionsMenu])

  // Tab indicator translation
  const translateX = tabIndicatorPosition.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, tabsWidth / 4, (tabsWidth / 4) * 2, (tabsWidth / 4) * 3],
  });

  // Filter notifications based on active tab
const filteredNotifications = notifications?.filter((notification) => {
  if (activeTab === "all") return true;
  if (activeTab === "unread") return !notification.is_read;
  if (activeTab === "cycle") {
    return ["Início do Período", "Janela Fértil", "Ovulação"].includes(notification.type);
  }
  if (activeTab === "tips") {
    return ["Dica de Saúde", "Lembrete", "Medicação"].includes(notification.type);
  }
  return true;
});

  // Count unread notifications
 // const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark notification as read
/* const markAsRead = async (id) => {
  setNotifications(
    notifications.map((notification) =>
      notification.id === id ? { ...notification, is_read: true } : notification,
    ),
  );
 // console.log(id);
  const response =  await markAsReadNotifications(id);
  alert("Alert"+ response.message)
  setUnreadCount((prev) => Math.max(0, prev - 1)); // Decrementa unread_count
  setShowOptionsMenu(null);
}; */

const markAsRead = async (id: number) => {
  try {
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const response = await markAsReadNotification(id);

    if (response.success) {
      alert(response.message); 
      setShowOptionsMenu(null);
    } else {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);

      if (response.message.includes("status já foi actualizada")) {
        alert("Erro: A notificação não existe ou já foi marcada como lida!");
      } else if (response.message.includes("Houve um erro ao actualizar o status")) {
        alert("Erro: Não foi possível atualizar o status da notificação!");
      } else {
        alert("Erro: " + response.message);
      }
    }
  } catch (error) {
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    setNotifications(previousNotifications);
    setUnreadCount(previousUnreadCount);

    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message.includes("Houve um erro no servidor")) {
        alert("Erro no servidor: Não foi possível atualizar o status da notificação.");
      } else {
        alert("Erro: " + error.response.data.message);
      }
    } else {
      alert("Erro de rede: Não foi possível conectar ao servidor.");
    }
  }
};


const markAllAsRead = async () => {
  try {
    // Salvar o estado atual para reverter em caso de erro
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    // Atualizar o estado local de forma otimista
    setNotifications(notifications.map((notification) => ({ ...notification, is_read: true })));
    setUnreadCount(0);

    const response = await markAllAsReadNotifications();

    if (response.success) {
      alert(response.message); 
      setShowOptionsMenu(null);
    } else {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);

      if (response.message.includes("Nenhuma notificação para atualizar")) {
        alert("Nenhuma notificação para marcar como lida!");
      } else if (response.message.includes("Usuário não encontrado")) {
        alert("Erro: Usuário não encontrado!");
      } else if (response.message.includes("Usuário normal não encontrado")) {
        alert("Erro: Usuário normal não encontrado!");
      } else if (response.message.includes("Houve um erro ao atualizar")) {
        alert("Erro: Não foi possível atualizar o status das notificações!");
      } else {
        alert("Erro: " + response.message);
      }
    }
  } catch (error) {
    setNotifications(previousNotifications);
    setUnreadCount(previousUnreadCount);

    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message.includes("Houve um erro no servidor")) {
        alert("Erro no servidor: Não foi possível atualizar o status das notificações.");
      } else {
        alert("Erro: " + error.response.data.message);
      }
    } else {
      alert("Erro de rede: Não foi possível conectar ao servidor.");
    }
  }
};

  // Delete notification
  const deleteNotification = async (id) => {
     try {
    const previousNotifications = [...notifications];

    const response = await removeNotification(id);

    if (response.success) {
      alert(response.message); // "Notificação excluída com sucesso!"
      setNotifications(notifications.filter((notification) => notification.id !== id));
      setShowOptionsMenu(null);
    } else {
      alert(response.message || 'Erro ao excluir a notificação!');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert('Erro: ' + error.response.data.message);
    } else {
      alert('Erro de rede: Não foi possível conectar ao servidor.');
    }
  }
  }

  // Clear all notifications
  /* const clearAllNotifications = () => {
    setNotifications([])
  }
 */

  const clearAllNotifications = async () => {
    try {
      const previousNotifications = [...notifications];
      const previousUnreadCount = unreadCount;

      setNotifications([]); 
      setUnreadCount(0);

      const response = await removeAllNotifications();

      if (response.success) {
        alert(response.message); 
        setShowOptionsMenu(null);
      } else {
        setNotifications(previousNotifications);
        setUnreadCount(previousUnreadCount);

        if (response.message.includes('Nenhuma notificação para remover')) {
          alert('Nenhuma notificação para remover!');
        } else if (response.message.includes('Usuário não encontrado')) {
          alert('Erro: Usuário não encontrado!');
        } else if (response.message.includes('Usuário normal não encontrado')) {
          alert('Erro: Usuário normal não encontrado!');
        } else if (response.message.includes('Houve um erro ao remover')) {
          alert('Erro: Não foi possível remover as notificações!');
        } else {
          alert('Erro: ' + response.message);
        }
      }
    } catch (error) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);

      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('Houve um erro no servidor')) {
          alert('Erro no servidor: Não foi possível remover as notificações.');
        } else {
          alert('Erro: ' + error.response.data.message);
        }
      } else {
        alert('Erro de rede: Não foi possível conectar ao servidor.');
      }
    }
  };


  // Format relative time (e.g., "30 minutos atrás")
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "agora mesmo"
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "minuto" : "minutos"} atrás`
    if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? "hora" : "horas"} atrás`
    if (diffDay < 30) return `${diffDay} ${diffDay === 1 ? "dia" : "dias"} atrás`

    const diffMonth = Math.floor(diffDay / 30)
    return `${diffMonth} ${diffMonth === 1 ? "mês" : "meses"} atrás`
  }

  // Toggle options menu for a notification
  const toggleOptionsMenu = (id) => {
    setShowOptionsMenu(showOptionsMenu === id ? null : id)
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

  // Render notification item
  const renderNotificationItem = (notification) => {
    const notificationType = notificationTypes[notification.type]

    return (
      <View key={notification.id} style={[styles.notificationItem, !notification.read && styles.unreadNotification]}>
        <View style={styles.notificationContent}>
          <View
            style={[
              styles.notificationIcon,
              { backgroundColor: notificationType.bgColor },
              !notification.read && styles.unreadNotificationIcon,
            ]}
          >
            <Icon
              family={notificationType.icon.family}
              name={notificationType.icon.name}
              size={20}
              color={notificationType.color}
            />
          </View>

          <View style={styles.notificationTextContainer}>
            <View style={styles.notificationHeader}>
              <Text
                style={[styles.notificationTitle, !notification.read && styles.unreadNotificationTitle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {notification.title}
              </Text>

              <View style={styles.notificationTimeContainer}>
                {!notification.read && <View style={styles.unreadDot} />}
                <Text style={styles.notificationTime}>{notification.time_ago}</Text>
              </View>
            </View>

            <Text style={styles.notificationMessage} numberOfLines={2} ellipsizeMode="tail">
              {notification.message}
            </Text>

            <View style={styles.notificationActions}>
              {notification.actionUrl && (
                <TouchableOpacity style={styles.actionButton} onPress={() => markAsRead(notification.id)}>
                  <Text style={styles.actionButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => toggleOptionsMenu(notification.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon family="Feather" name="more-horizontal" size={18} color="#AAAAAA" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showOptionsMenu === notification.id && (
          <Animated.View
            style={[
              styles.optionsMenu,
              {
                opacity: optionsMenuAnim,
                transform: [
                  {
                    translateY: optionsMenuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {!notification.read && (
              <TouchableOpacity style={styles.optionItem} onPress={() => markAsRead(notification.id)}>
                <Icon family="Feather" name="check-circle" size={16} color="#F9A826" />
                <Text style={styles.optionText}>Marcar como lida</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.optionItem} onPress={() => deleteNotification(notification.id)}>
              <Icon family="Feather" name="trash-2" size={16} color="#E57373" />
              <Text style={styles.optionText}>Excluir</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    )
  }

  interface Notification {
    id: number;
    title: string;
    message: string;
    time_ago: string;
    is_read: boolean;
    type: string;
    description?: string;
  }

   /*  const renderNotificationItem = (notification: Notification) => {
      const notificationType = notificationTypes[notification.type] || notificationTypes.default;

      return (
        <View
          key={String(notification.id)}
          style={[styles.notificationItem, !notification.is_read && styles.unreadNotification]}
        >
          <View style={styles.notificationContent}>
            <View
              style={[
                styles.notificationIcon,
                { backgroundColor: notificationType.bgColor },
                !notification.is_read && styles.unreadNotificationIcon,
              ]}
            >
              <Icon
                family={notificationType.icon.family}
                name={notificationType.icon.name}
                size={20}
                color={notificationType.color}
              />
            </View>
            <View style={styles.notificationTextContainer}>
              <View style={styles.notificationHeader}>
                <Text
                  style={[styles.notificationTitle, !notification.is_read && styles.unreadNotificationTitle]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {notification.title}
                </Text>
                <View style={styles.notificationTimeContainer}>
                  {!notification.is_read && <View style={styles.unreadDot} />}
                  <Text style={styles.notificationTime}>{notification.time_ago}</Text>
                </View>
              </View>
              <Text style={styles.notificationMessage} numberOfLines={2} ellipsizeMode="tail">
                {notification.message}
              </Text>
              <View style={styles.notificationActions}>
                {notification.description && (
                  <TouchableOpacity style={styles.actionButton} onPress={() => markAsRead(notification.id)}>
                    <Text style={styles.actionButtonText}>Ver detalhes</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.optionsButton}
                  onPress={() => toggleOptionsMenu(notification.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon family="Feather" name="more-horizontal" size={18} color="#AAAAAA" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {showOptionsMenu === notification.id && (
            <Animated.View
              style={[
                styles.optionsMenu,
                {
                  opacity: optionsMenuAnim,
                  transform: [
                    {
                      translateY: optionsMenuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                ]}
              >
                {!notification.is_read && (
                  <TouchableOpacity style={styles.optionItem} onPress={() => markAsRead(notification.id)}>
                    <Icon family="Feather" name="check-circle" size={16} color="#F9A826" />
                    <Text style={styles.optionText}>Marcar como lida</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.optionItem} onPress={() => deleteNotification(notification.id)}>
                  <Icon family="Feather" name="trash-2" size={16} color="#E57373" />
                  <Text style={styles.optionText}>Excluir</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
        </View>
      );
    }; */

  // Render empty state
  const renderEmptyState = () => {
    let message = "Você não tem notificações no momento."

    if (activeTab === "unread") {
      message = "Todas as suas notificações foram lidas."
    } else if (activeTab === "cycle") {
      message = "Você não tem notificações de ciclo."
    } else if (activeTab === "fertility") {
      message = "Você não tem notificações de fertilidade."
    } else if (activeTab === "tips") {
      message = "Você não tem notificações de dicas."
    }

    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateIconContainer}>
          <Icon family="Feather" name="bell" size={32} color="#F9A826" />
        </View>
        <Text style={styles.emptyStateTitle}>Nenhuma notificação</Text>
        <Text style={styles.emptyStateMessage}>{message}</Text>
      </View>
    )
  }

  // Render notification settings item
  const renderSettingsItem = (icon, color, title, description) => {
    return (
      <View style={styles.settingsItem}>
        <View style={styles.settingsItemLeft}>
          <View style={[styles.settingsItemIcon, { backgroundColor: `${color}20` }]}>
            <Icon family="Feather" name={icon} size={16} color={color} />
          </View>
          <View style={styles.settingsItemTextContainer}>
            <Text style={styles.settingsItemTitle}>{title}</Text>
            <Text style={styles.settingsItemDescription}>{description}</Text>
          </View>
        </View>
        <View style={styles.settingsItemBadge}>
          <Text style={styles.settingsItemBadgeText}>Ativado</Text>
        </View>
      </View>
    )
  }

  // Add getActiveTabIndex function
  const getActiveTabIndex = () => {
  switch (activeTab) {
    case "all": return 0;
    case "unread": return 1;
    case "cycle": return 2;
    case "tips": return 3;
    default: return 0;
  }
};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={styles.headerTitle}>Notificações</Text>
          <Text style={styles.headerSubtitle}>Mantenha-se informada sobre seu ciclo e saúde</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              // Toggle dropdown menu for filter options
              setShowOptionsMenu(showOptionsMenu === "filter" ? null : "filter")
            }}
          >
            <Icon family="Feather" name="filter" size={18} color="#F9A826" />
          </TouchableOpacity>

          {showOptionsMenu === "filter" && (
            <Animated.View
              style={[
                styles.filterMenu,
                {
                  opacity: optionsMenuAnim,
                  transform: [
                    {
                      translateY: optionsMenuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.filterMenuItem}
                onPress={() => {
                  markAllAsRead()
                  setShowOptionsMenu(null)
                }}
              >
                <Icon family="Feather" name="check-circle" size={16} color="#F9A826" />
                <Text style={styles.filterMenuItemText}>Marcar todas como lidas</Text>
              </TouchableOpacity>

              <View style={styles.filterMenuDivider} />

              <TouchableOpacity
                style={styles.filterMenuItem}
                onPress={() => {
                  clearAllNotifications()
                  setShowOptionsMenu(null)
                }}
              >
                <Icon family="Feather" name="trash-2" size={16} color="#E57373" />
                <Text style={styles.filterMenuItemText}>Excluír todas</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
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
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <View style={styles.tabTextContainer}>
              <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>Todas</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "unread" && styles.activeTab]}
            onPress={() => setActiveTab("unread")}
          >
            <Text style={[styles.tabText, activeTab === "unread" && styles.activeTabText]}>Não lidas</Text>
              {unreadCount > 0 && (
                <View style={styles.tabBadgeContainer}>
                  <Text style={styles.tabBadgeText}>{unreadCount}</Text>
                </View>
              )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "cycle" && styles.activeTab]}
            onPress={() => setActiveTab("cycle")}
          >
            <Text style={[styles.tabText, activeTab === "cycle" && styles.activeTabText]}>Período</Text>
          </TouchableOpacity>

         {/*  <TouchableOpacity
            style={[styles.tab, activeTab === "fertility" && styles.activeTab]}
            onPress={() => setActiveTab("fertility")}
          >
            <Text style={[styles.tabText, activeTab === "fertility" && styles.activeTabText]}>Fertilidade</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.tab, activeTab === "tips" && styles.activeTab]}
            onPress={() => setActiveTab("tips")}
          >
            <Text style={[styles.tabText, activeTab === "tips" && styles.activeTabText]}>Dicas</Text>
          </TouchableOpacity>

          {/* Replace the Animated.View with TabIndicator */}
          <TabIndicator activeTabIndex={getActiveTabIndex()} tabCount={4} containerWidth={tabsWidth} />
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          {filteredNotifications?.length > 0 ? filteredNotifications.map(renderNotificationItem) : renderEmptyState()}
        </View>
      </View>

      {/* Notification Settings */}
     {/*  <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configurações de Notificações</Text>

        <View style={styles.settingsCard}>
          {renderSettingsItem("moon", "#E57373", "Ciclo Menstrual", "Alertas sobre início e fim do ciclo")}
          <View style={styles.settingsDivider} />

          {renderSettingsItem("droplet", "#F9A826", "Fertilidade", "Alertas sobre janela fértil e ovulação")}
          <View style={styles.settingsDivider} />

          {renderSettingsItem("pill", "#FFFFFF", "Medicações", "Lembretes para tomar medicamentos")}
          <View style={styles.settingsDivider} />

          {renderSettingsItem("heart", "#F9A826", "Dicas e Sabedoria", "Dicas baseadas na sabedoria tradicional")}
        </View>

        <TouchableOpacity style={styles.manageSettingsButton}>
          <Icon family="Feather" name="settings" size={16} color="#F9A826" />
          <Text style={styles.manageSettingsButtonText}>Gerenciar Configurações de Notificações</Text>
        </TouchableOpacity>
      </View> */}

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    marginTop: 2,
  },
  headerActions: {
    position: "relative",
    zIndex: 10,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
    backgroundColor: "#2A2A2A", // Fundo escuro para o botão
    justifyContent: "center",
    alignItems: "center",
   
  },
  filterMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 220,
    backgroundColor: "#2A2A2A", // Fundo escuro para o menu
    borderRadius: 8,
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
    zIndex: 10,
    overflow: "hidden",
  },
  filterMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  filterMenuItemText: {
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
    marginLeft: 8,
  },
  filterMenuDivider: {
    height: 1,
    backgroundColor: "#3A3A3A", // Cor mais escura para o separador
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
     zIndex: -1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 1,
  },
  tabTextContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para o texto inativo
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "bold",
  },
  tabBadgeContainer: {
    position: "absolute",
    top: -1,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    color: "#121212", // Texto escuro para contraste
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    width: width / 5 - 8,
    height: "100%",
    backgroundColor: "#3A3A3A", // Fundo um pouco mais claro para o indicador
    borderRadius: 8,
    top: 4,
    left: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#F9A826", // Amarelo/laranja do padrão
  },
  notificationsContainer: {
    backgroundColor: "#2A2A2A", // Fundo escuro para o container
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 24,
    minHeight: 200, // Add minimum height for better appearance when empty
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
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A", // Cor mais escura para o separador
  },
  unreadNotification: {
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
  },
  notificationContent: {
    flexDirection: "row",
    padding: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  unreadNotificationIcon: {
    borderWidth: 2,
    borderColor: "rgba(249, 168, 38, 0.3)", // Amarelo/laranja com transparência
  },
  notificationTextContainer: {
    flex: 1,
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
    flex: 1,
    marginRight: 8,
  },
  unreadNotificationTitle: {
    fontWeight: "600",
  },
  notificationTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F9A826", // Amarelo/laranja do padrão
    marginRight: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para o tempo
  },
  notificationMessage: {
    fontSize: 13,
    color: "#DDDDDD", // Cinza mais claro para a mensagem
    lineHeight: 18,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  optionsButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    right: 0,
    top: 30,
    width: 160,
    backgroundColor: "#2A2A2A", // Fundo escuro para o menu
    borderRadius: 8,
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
    zIndex: 10,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#FFFFFF", // Texto branco para contraste
    marginLeft: 8,
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3A3A3A", // Fundo escuro para o ícone
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#AAAAAA", // Cinza claro para a mensagem
    textAlign: "center",
  },
  settingsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF", // Texto branco para contraste
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: "#2A2A2A", // Fundo escuro para o card
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
        elevation: 4,
      },
    }),
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsItemTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF", // Texto branco para contraste
  },
  settingsItemDescription: {
    fontSize: 12,
    color: "#AAAAAA", // Cinza claro para a descrição
  },
  settingsItemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(249, 168, 38, 0.1)", // Amarelo/laranja com transparência
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
  },
  settingsItemBadgeText: {
    fontSize: 12,
    color: "#F9A826", // Amarelo/laranja do padrão
    fontWeight: "500",
  },
  settingsDivider: {
    height: 1,
    backgroundColor: "#3A3A3A", // Cor mais escura para o separador
    marginHorizontal: 16,
  },
  manageSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F9A826", // Amarelo/laranja do padrão
    borderRadius: 8,
    backgroundColor: "#2A2A2A", // Fundo escuro para o botão
  },
  manageSettingsButtonText: {
    fontSize: 14,
    color: "#F9A826", // Amarelo/laranja do padrão
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 80,
  },
  tabTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default NotificationsScreen
