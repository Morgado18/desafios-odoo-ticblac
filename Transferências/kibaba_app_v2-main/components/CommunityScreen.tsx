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
  Image,
  Vibration,
  Share
} from "react-native"
import TabIndicator from "./TabIndicator"
import { Icon } from "../App"
import { getCommunityPosts, leaveCommentPost, reactPost } from "../services/authed/main-service"
import { LinearGradient } from "expo-linear-gradient";
import apiConfig from "../utils/apiConfig"
import { AntDesign } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

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

// Add a new function for generating gradient colors
const generateGradientColors = (baseColor: string, count = 5) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const opacity = 0.1 + i * 0.2;
    colors.push(`rgba(${baseColor}, ${opacity})`);
  }
  return colors;
};

const handleSharePost = async (post) => {
  try {
    const shareContent = `
      Compartilhar Post
      __________________________

      Autor: ${post.author}
      __________________________

      Título: ${post.titulo}
      __________________________

      Conteúdo: ${post.content}
      __________________________

      Reações: ${post.reacoes}
      __________________________

      From: KIBABA APP -.-

      __________________________
    `.trim();

    await Share.share({
      message: shareContent,
      title: "Compartilhar Post",
      url: `https://kibaba.it.ao/posts/${post.id}`,
    });
  } catch (error) {
    console.log("Erro ao compartilhar:", error);
    alert("Erro ao compartilhar o post.");
  }
};

export interface Tag {
  id: number;
  name: string;
  descricao: string;
}

export interface Post {
  id: number;
  type: string; // "História" ou "Discussão"
  titulo: string;
  content: string;
  author: string;
  author_profile_picture: string;
  author_id: number;
  time_ago: string;
  comments_count: number;
  reacoes: number;
  tags: Tag[];
  created_at: string;
}

export interface PostsResponse {
  posts: Post[];
  tags: Tag[];
}

const CommunityScreen = ( /* { activeTab, setActiveTab } */{ activeTab: parentActiveTab, setActiveTab: setParentActiveTab } ) => {
  // State variables

 
  // activeTab = "stories";

  const [apiData, setApiData] = useState<{
    posts: Array<{
      id: number;
      type: string;
      titulo: string;
      content: string;
      author: string;
      author_profile_picture: string;
      author_id: number;
      time_ago: string;
      comments_count: number;
      tags: Array<{ id: number; name: string; descricao: string }>;
      reacoes: number;
      created_at: string;
    }>;
    tags: Array<{ id: number; name: string; descricao: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [profileImage, setProfileImage] = useState(null)
  //const [activeTab, setActiveTab] = useState("stories")

  const [localActiveTab, setLocalActiveTab] = useState("stories");

  const [newComment, setNewComment] = useState("")
  const [likedPosts, setLikedPosts] = useState([])
  //const [expandedReactions, setExpandedReactions] = useState(null)
  //const [selectedReactions, setSelectedReactions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [tabsWidth, setTabsWidth] = useState(width)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current
 //const heartScales = useRef(apiData?.posts?.map(() => new Animated.Value(1)) || []).current;
 const heartScales = useRef<Animated.Value[]>([]).current;
 // const reactionAnimations = useRef(stories.map(() => new Animated.Value(0))).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const loadingAnim = useRef(new Animated.Value(0)).current

  const [notificationMessage, setNotificationMessage] = useState<string>("")
  const [showNotification, setShowNotification] = useState<boolean>(false)
  
 

 useEffect(() => {
  //setActiveTab("stories");
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCommunityPosts();
      //console.log("Dados da API:", data);

      // Acessar o profile_picture corretamente dentro de data.user
      const profilePicture = data.user?.profile_picture || null;
      const fullProfileImageUrl = profilePicture
        ? `${apiConfig.baseUrl}${profilePicture}`
        : null;
      const savedProfileImage = ""; 

      setProfileImage(fullProfileImageUrl || savedProfileImage || null);
      setApiData(data);
      

    } catch (error) {
      console.error("Erro ao buscar posts da comunidade:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleNewPost = () => {
    setParentActiveTab("createPost");
  };

/*  useEffect(() => {
  if (apiData?.posts) {
    heartScales.current = apiData.posts.map(() => new Animated.Value(1));
    console.log("heartScales inicializado:", heartScales.current.length);
  }
}, [apiData]); */

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
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Iniciar animação de carregamento
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Iniciar animação de pulso
    startPulseAnimation();
  }, []);

  // Pulse animation for new post button
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const notificationAnim = useRef(new Animated.Value(-100)).current
  // Animation for tab change
  useEffect(() => {
    Animated.timing(tabIndicatorPosition, {
      toValue: localActiveTab === "stories" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start()
  }, [localActiveTab])

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
    }, [showNotification]);


  // Toggle like for a post
 const toggleLike = async (postId: number, index: number) => {
  if (heartScales.current[index]) {
    Animated.sequence([
      Animated.timing(heartScales.current[index], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScales.current[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }

  if (likedPosts.includes(postId)) {
    setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      const response = await reactPost(postId);
      console.log(response)
      setLikedPosts([...likedPosts, postId]);
    }
  };

    // Enhanced Geometric Pattern Component
  const GeometricPattern = () => {
    const centerPoint = { x: 0, y: 0 };
    const referencePoints = [
      { x: centerPoint.x - 20, y: centerPoint.y - 20 },
      { x: centerPoint.x + 20, y: centerPoint.y - 20 },
      { x: centerPoint.x, y: centerPoint.y + 20 },
    ];

    return (
      <View style={styles.patternContainer}>
        <View style={styles.patternRow}>
          {referencePoints.map((point, index) => (
            <View key={`ref-${index}`} style={[styles.referencePoint, { left: point.x, top: point.y }]} />
          ))}
          <View style={[styles.patternElement, styles.patternTriangle]} />
          <View style={[styles.patternElement, styles.patternCircle]} />
          <View style={[styles.patternElement, styles.patternDiamond]} />
          <View style={[styles.patternElement, styles.patternDot]} />
        </View>
      </View>
    );
  };

  // Render avatar component with gradient effect
  const renderAvatar = (author, size = 40) => {
    // Generate a consistent color based on the author's name
    const charCode = author.charCodeAt(0)
    const hue = (charCode * 137.5) % 360

    return (
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        <View
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              backgroundColor: `hsl(${hue}, 70%, 60%)`,
            },
          ]}
        >
          <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{author[0]}</Text>
          {/* <Image  source={{ uri: profileImage }} style={styles.avatarImage} /> */}
        </View>
        <View style={[styles.avatarRing, { width: size + 6, height: size + 6 }]} />
      </View>
    )
  }

  // Render skeleton loading component
  const renderSkeleton = () => {
    const opacityAnimation = loadingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    })

    return (
      <View style={styles.skeletonContainer}>
        {[1, 2].map((item) => (
          <Animated.View key={`skeleton-${item}`} style={[styles.skeletonCard, { opacity: opacityAnimation }]}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonLines}>
                <View style={[styles.skeletonLine, { width: "60%" }]} />
                <View style={[styles.skeletonLine, { width: "40%" }]} />
              </View>
            </View>
            <View style={[styles.skeletonLine, { width: "90%", height: 18 }]} />
            <View style={[styles.skeletonLine, { width: "100%" }]} />
            <View style={[styles.skeletonLine, { width: "80%" }]} />
            <View style={styles.skeletonTags}>
              <View style={styles.skeletonTag} />
              <View style={styles.skeletonTag} />
            </View>
          </Animated.View>
        ))}
      </View>
    )
  }

  const [likeDiscussion, setDislikeDiscussion] = useState(null);

  const leaveOpinion = async (postId) => {
  
    try{
      const response = await reactPost(postId);
      console.log(response);
      //setDislikeDiscussion(true);
       if (response.message === 'Reação Adicionada!') {
         setLikedPosts(true);
         setDislikeDiscussion(false);
      } else if (response.message === 'Reação removida!') {
        
         setDislikeDiscussion(true);
         setLikedPosts(false)
      }
      //console.log(response);
    }catch(error){
      console.log(error)
    }
  }

  // Render engagement indicator
  const renderEngagementIndicator = (percentage, postId) => {
    // Create invisible reference points for positioning
    const centerPoint = { x: 50, y: 50 }

    return (
      <View style={styles.engagementContainer}>
        {/* Invisible reference point */}

        <View style={styles.selectContainer}>
          <Text style={styles.inputLabel}>Tua Opinião</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioButton, likeDiscussion === true && styles.radioButtonSelected]}
              onPress={() => leaveOpinion(postId)}
              accessible={true}
              accessibilityLabel="Sim, teve intercurso"
              accessibilityRole="radio"
              accessibilityState={{selected: likeDiscussion === true}}
            >
              <Text style={[styles.radioText, likeDiscussion === true && styles.radioTextSelected]}>
                <AntDesign name="like2" size={24} color="#14A44D" />
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.radioButton, likeDiscussion === false && styles.radioButtonSelected]}
              onPress={() => leaveOpinion(postId)}
              accessible={true}
              accessibilityLabel="Não teve intercurso"
              accessibilityRole="radio"
              accessibilityState={{selected: likeDiscussion === false}}
            >
              <Text style={[styles.radioText, likeDiscussion === false && styles.radioTextSelected]}>
                <AntDesign name="dislike2" size={24} color="#DC4C64" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text></Text>

        <View style={[styles.referencePoint, { left: centerPoint.x, top: centerPoint.y }]} />

        <View style={styles.engagementBackground}>
          <View style={[styles.engagementFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.engagementText}>{percentage}%</Text>
      </View>
    )
  }

  const renderPosts = () => {
    if (loading || !apiData) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando comunidade...</Text>
        </View>
      );
    }

    if (!apiData.posts || apiData.posts.length === 0) {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.placeholderCard}>
            <AnimatedEmoji emoji="💬" size={48} style={{ marginBottom: 16 }} />
            <Text style={styles.placeholderText}>Nenhum post encontrado</Text>
            <Text style={styles.placeholderDescription}>
              Seja a primeira a compartilhar algo!
            </Text>
          </View>
        </Animated.View>
      );
    }

    return apiData.posts.map((post) => (
      <Animated.View
        key={post.id}
        style={[styles.postContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <LinearGradient
          colors={["rgba(249, 168, 38, 0.1)", "rgba(229, 115, 115, 0.1)"]}
          style={styles.postGradient}
        >
          <Text style={styles.postType}>{post.type}</Text>
          <Text style={styles.postTitle}>{post.titulo}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.postTags}>
            {post.tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.postFooter}>
            <Text style={styles.postAuthor}>Por {post.author}</Text>
            <Text style={styles.postTime}>{post.time_ago}</Text>
          </View>
          <View style={styles.postInteractions}>
            <View style={styles.reactionContainer}>
              <Text style={styles.reactionIcon}>❤️</Text>
              <Text style={styles.reactionCount}>{post.reacoes}</Text>
            </View>
            <View style={styles.commentContainer}>
              <Icon family="Feather" name="message-circle" size={16} color="#BBBBBB" />
              <Text style={styles.commentCount}>{post.comments_count}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    ));
  };

  

  const [comment, setComment] = useState<string>("")
  const handleLeaveCommentPost = async(post_id) => {
     try {
        const response = await leaveCommentPost(post_id,{
          content: newComment
        })
        console.log(response)
    
        if (response?.success === true) {
          /* setNotificationMessage */alert("Comentário enviado com sucesso!");
          setNewComment("");
        } else if (response?.status === 404) {
          /* setNotificationMessage */alert("Não foi possível encontrar o post para comentar.");
        } else {
          /* setNotificationMessage */alert("Erro ao enviar o comentário. Tente novamente.");
        }
      } catch (error) {
        console.log("Erro ao enviar comentário:", error);
        /* setNotificationMessage */alert("Erro de conexão com o servidor.");
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
  }

const renderStoryCard = (post: Post, index: number) => {
    return (
      <Animated.View
        key={post.id}
        style={[
          styles.storyCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(index + 1)) }],
          },
        ]}
      >
        <View style={styles.storyCardHeader}>
          <View style={styles.authorContainer}>
            {/* {renderAvatar(post.author)} */}
             <View style={[styles.avatarContainer, { width: 40, height: 40 }]}>
              <View
                style={[
                  styles.avatar,
                  {
                    width: 40,
                    height: 40,
                  },
                ]}
              >
                <Image  source={{ uri: `${apiConfig.baseUrl}${post.author_profile_picture}`  }} style={styles.avatarImage} />
              </View>
              <View style={[styles.avatarRing, { width: 40 + 6, height: 40 + 6 }]} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.postDate}>{post.time_ago}</Text>
            </View>
          </View>
          <Text style={styles.storyTitle}>{post.titulo}</Text>
        </View>

        <View style={styles.storyCardContent}>
          <Text style={styles.storyText}>{post.content}</Text>

          <View style={styles.tagsContainer}>
            {post.tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.separator} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(post.id, index)}>
             {/*  <Animated.View style={{ transform: [{ scale: heartScales?.current[index] || new Animated.Value(1) }] }}>
                <Icon
                  family="Feather"
                  name="heart"
                  size={18}
                  color={likedPosts.includes(post.id) ? "#E57373" : "#AAAAAA"}
                  style={likedPosts.includes(post.id) ? styles.filledHeart : {}}
                />
              </Animated.View> */}
              <Icon
                  family="Feather"
                  name="heart"
                  size={18}
                  color={likedPosts.includes(post.id) ? "#E57373" : "#AAAAAA"}
                  style={likedPosts.includes(post.id) ? styles.filledHeart : {}}
                />
              <Text style={[styles.actionButtonText, likedPosts.includes(post.id) && styles.activeActionText]}>
                {post.reacoes + (likedPosts.includes(post.id) ? 1 : 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon family="Feather" name="message-circle" size={18} color="#AAAAAA" />
              <Text style={styles.actionButtonText}>{post.comments_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => handleSharePost(post)}>
              <Icon family="Feather" name="share" size={18} color="#AAAAAA" />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentInputContainer}>
            {/* {renderAvatar("User", 24)} */}
             <View style={[styles.avatarContainer]}>
              <View
                style={[
                  styles.avatar,
                  {
                    width: 24,
                    height: 24,
                   /*  backgroundColor: `hsl(${hue}, 70%, 60%)`, */
                  },
                ]}
              >
                {/* <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{author[0]}</Text> */}
                <Image  source={{ uri: profileImage }} style={styles.avatarImageUserAuthed} />
              </View>
              <View style={[styles.avatarRing, { width: 24 + 6, height: 24 + 6 }]} />
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#777777"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={[styles.sendButton, !newComment && styles.sendButtonDisabled]}
              disabled={!newComment}
              onPress={() => handleLeaveCommentPost(post.id)}
            >
              <Icon family="Feather" name="send" size={14} color={newComment ? "#FFFFFF" : "#555555"} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  // Renderizar cartão de discussão
  const renderDiscussionCard = (post: Post, index: number) => {
    return (
      <Animated.View
        key={post.id}
        style={[
          styles.discussionCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(index + 1)) }],
          },
        ]}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{post.tags[0]?.name || "Discussão"}</Text>
        </View>

        <View style={styles.discussionCardHeader}>
          <Text style={styles.discussionTitle}>{post.titulo}</Text>
          {/* <View style={styles.repliesTag}>
            <Icon family="Feather" name="message-circle" size={12} color="#FFFFFF" />
            <Text style={styles.repliesCount}>{post.comments_count}</Text>
          </View> */}
        </View>

        <Text style={styles.discussionExcerpt}>{post.content/* .slice(0, 100) */}{/* ... */}</Text>

        {renderEngagementIndicator(post.reacoes, post.id)}

        <View style={styles.discussionAuthorContainer}>
          {renderAvatar(post.author, 20)}
          <Text style={styles.discussionAuthorName}>{post.author}</Text>
          <Text style={styles.discussionDate}>• {post.time_ago}</Text>
        </View>
      </Animated.View>
    );
  };

  // Renderizar aba de histórias
  const renderStoriesTab = () => {
    if (loading) {
      return renderSkeleton();
    }

    const storyPosts = apiData?.posts?.filter((post) => post.type === "História") || [];
    if (storyPosts.length === 0) {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.placeholderCard}>
            <AnimatedEmoji emoji="💬" size={48} style={{ marginBottom: 16 }} />
            <Text style={styles.placeholderText}>Nenhuma história encontrada</Text>
            <Text style={styles.placeholderDescription}>
              Seja a primeira a compartilhar uma história!
            </Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {storyPosts.map((post, index) => renderStoryCard(post, index))}
      </View>
    );
  };

  // Renderizar aba de discussões
  const renderDiscussionsTab = () => {
    if (loading) {
      return renderSkeleton();
    }

    const discussionPosts = apiData?.posts?.filter((post) => post.type === "Discussão") || [];
    if (discussionPosts.length === 0) {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.placeholderCard}>
            <AnimatedEmoji emoji="💬" size={48} style={{ marginBottom: 16 }} />
            <Text style={styles.placeholderText}>Nenhuma discussão encontrada</Text>
            <Text style={styles.placeholderDescription}>
              Inicie uma nova discussão!
            </Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {discussionPosts.map((post, index) => renderDiscussionCard(post, index))}
      </View>
    );
  };

   useEffect(() => {
  if (apiData?.posts) {
    heartScales.current = apiData.posts.map(() => new Animated.Value(1));
   // console.log("heartScales inicializado:", heartScales.current.length);
  }
}, [apiData]);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>Comunidade</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.newPostButton} onPress={handleNewPost}>
            <Icon family="Feather" name="plus" size={14} color="#F9A826" />
            <Text style={styles.newPostButtonText}>Nova Publicação</Text>
          </TouchableOpacity>
        </Animated.View>
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
            style={[styles.tab, localActiveTab === "stories" && styles.activeTab]}
            onPress={() => setLocalActiveTab("stories")}
          >
            <Icon family="Feather" name="book-open" size={18} color={localActiveTab === "stories" ? "#F9A826" : "#AAAAAA"} />
            <Text style={[styles.tabText, localActiveTab === "stories" && styles.activeTabText]}>Histórias</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, localActiveTab === "discussions" && styles.activeTab]}
            onPress={() => setLocalActiveTab("discussions")}
          >
            <Icon
              family="Feather"
              name="message-circle"
              size={18}
              color={localActiveTab === "discussions" ? "#F9A826" : "#AAAAAA"}
            />
            <Text style={[styles.tabText, localActiveTab === "discussions" && styles.activeTabText]}>Discussões</Text>
          </TouchableOpacity>

          <TabIndicator activeTabIndex={localActiveTab === "stories" ? 0 : 1} tabCount={2} containerWidth={tabsWidth} />
        </View>

        {/* Tab Content */}
        <Animated.View style={[styles.tabContentContainer, { opacity: fadeAnim }]}>
          {localActiveTab === "stories" ? renderStoriesTab() : renderDiscussionsTab()}
        </Animated.View>
      </View>
{/*           {renderPosts()} */}
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
  // Reference points for positioning (invisible)
  referencePoint: {
    position: "absolute",
    width: 1,
    height: 1,
    backgroundColor: "transparent",
  },
  // Pattern styles
  patternContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    zIndex: -1,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    position: "relative",
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
  patternDiamond: {
    width: 15,
    height: 15,
    backgroundColor: "#64B5F6",
    transform: [{ rotate: "45deg" }],
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  newPostButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newPostButtonText: {
    fontSize: 13,
    color: "#F9A826",
    fontWeight: "600",
  },
  // Tabs styles
  tabsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 4,
    position: "relative",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    zIndex: 1,
    gap: 8,
    borderRadius: 8,
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
    color: "#F9A826",
    fontWeight: "bold",
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    gap: 20,
  },
  // Avatar styles
  avatarContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  avatarRing: {
    position: "absolute",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#F9A826",
    opacity: 0.5,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Story card styles
  storyCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  storyCardHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  authorInfo: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  postDate: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  storyCardContent: {
    padding: 16,
    paddingTop: 12,
  },
  storyText: {
    fontSize: 15,
    color: "#DDDDDD",
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(229, 115, 115, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  tagText: {
    fontSize: 12,
    color: "#E57373",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 16,
  },
  // Action buttons
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  activeActionText: {
    color: "#E57373",
  },
  filledHeart: {
    color: "#E57373",
  },
  // Reactions panel
  reactionsPanel: {
    flexDirection: "row",
    backgroundColor: "#3A3A3A",
    borderRadius: 30,
    padding: 8,
    marginBottom: 16,
    justifyContent: "space-around",
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
  reactionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 4,
  },
  selectedReaction: {
    backgroundColor: "rgba(249, 168, 38, 0.3)",
    borderWidth: 1,
    borderColor: "#F9A826",
  },
  reactionEmoji: {
    fontSize: 16,
  },
  currentReactions: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  reactionCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  reactionCountText: {
    fontSize: 12,
    color: "#DDDDDD",
  },
  // Comment input
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#FFFFFF",
    backgroundColor: "#252525",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#3A3A3A",
  },
  // Discussion card styles
  discussionCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryBadge: {
    position: "absolute",
    top: -10,
    left: 16,
    backgroundColor: "#3A3A3A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A4A4A",
  },
  categoryText: {
    fontSize: 11,
    color: "#F9A826",
    fontWeight: "600",
  },
  discussionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    marginTop: 8,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  repliesTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(249, 168, 38, 0.3)",
    backgroundColor: "rgba(249, 168, 38, 0.1)",
    gap: 4,
  },
  repliesCount: {
    fontSize: 12,
    color: "#F9A826",
    fontWeight: "600",
  },
  discussionExcerpt: {
    fontSize: 14,
    color: "#BBBBBB",
    lineHeight: 20,
    marginBottom: 16,
  },
  // Engagement indicator
  engagementContainer: {
    marginBottom: 12,
    position: "relative",
  },
  engagementBackground: {
    height: 4,
    backgroundColor: "#3A3A3A",
    borderRadius: 2,
    overflow: "hidden",
  },
  engagementFill: {
    height: "100%",
    backgroundColor: "#F9A826",
    borderRadius: 2,
  },
  engagementText: {
    fontSize: 11,
    color: "#AAAAAA",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  discussionAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discussionAuthorName: {
    fontSize: 12,
    color: "#DDDDDD",
    fontWeight: "500",
  },
  discussionDate: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  // Skeleton loading
  skeletonContainer: {
    flex: 1,
    gap: 20,
  },
  skeletonCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    gap: 12,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3A3A3A",
  },
  skeletonLines: {
    gap: 6,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#3A3A3A",
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonTags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  skeletonTag: {
    width: 80,
    height: 24,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
  },
  bottomSpacing: {
    height: 80,
  },
  emptyText:{
    color: "#fff",
    textAlign: "center",
  },
  emptySubtext:{
    color: "#fff",
    textAlign: "center",
  },
  avatarImage:{
    width: 41.5, // 60
    height: 41.5,
    borderRadius: 30, // 30
  },
  avatarImageUserAuthed:{
    width: 26,
    height: 26,
    borderRadius: 30,
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
      textAlign: "center",
    },
    placeholderDescription: {
      fontSize: 14,
      color: "#AAAAAA",
      textAlign: "center",
      paddingHorizontal: 16,
      lineHeight: 20,
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
      inputLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 12,
      },
})

export default CommunityScreen