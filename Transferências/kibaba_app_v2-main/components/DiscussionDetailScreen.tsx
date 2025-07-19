"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Share, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Icon } from "../App"
import { addDiscussionReply, getLikedComments, toggleLikeComment } from "../services/data-service"

const DiscussionDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { discussion } = route.params

  const [newReply, setNewReply] = useState("")
  const [discussionData, setDiscussionData] = useState(discussion)
  const [likedComments, setLikedComments] = useState(getLikedComments())

  // Handle reply submission
  const handleReplySubmit = () => {
    if (newReply.trim() === "") return

    const reply = addDiscussionReply(discussionData.id, newReply)
    if (reply) {
      setNewReply("")
      // Update the discussion data to reflect the new reply
      setDiscussionData({
        ...discussionData,
        replies: [...discussionData.replies, reply],
      })
    }
  }

  // Toggle like for a reply
  const toggleReplyLike = (replyId) => {
    const isLiked = toggleLikeComment(replyId)
    setLikedComments(getLikedComments())

    // Update the reply data to reflect the like change
    const updatedReplies = discussionData.replies.map((reply) => {
      if (reply.id === replyId) {
        return {
          ...reply,
          likes: isLiked ? reply.likes + 1 : reply.likes - 1,
        }
      }
      return reply
    })

    setDiscussionData({
      ...discussionData,
      replies: updatedReplies,
    })
  }

  // Share content
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${discussionData.title} - ${discussionData.content.substring(0, 100)}... Participe da discussão no nosso app!`,
        title: discussionData.title,
      })
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar este conteúdo")
    }
  }

  // Render avatar component
  const renderAvatar = (author, size = 40) => {
    return (
      <View style={[styles.avatar, { width: size, height: size }]}>
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{author[0]}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon family="Feather" name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussão</Text>
        <TouchableOpacity onPress={handleShare}>
          <Icon family="Feather" name="share-2" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Discussion Content */}
      <View style={styles.discussionCard}>
        <Text style={styles.discussionTitle}>{discussionData.title}</Text>

        <View style={styles.authorContainer}>
          {renderAvatar(discussionData.author)}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{discussionData.author}</Text>
            <Text style={styles.postDate}>{discussionData.date}</Text>
          </View>
        </View>

        <Text style={styles.discussionContent}>{discussionData.content}</Text>

        <View style={styles.repliesTag}>
          <Icon family="Feather" name="message-square" size={14} color="#F9A826" />
          <Text style={styles.repliesCount}>{discussionData.replies.length} respostas</Text>
        </View>
      </View>

      {/* Reply Input */}
      <View style={styles.replyInputContainer}>
        {renderAvatar("User", 32)}
        <TextInput
          style={styles.replyInput}
          placeholder="Escreva uma resposta..."
          placeholderTextColor="#777777"
          value={newReply}
          onChangeText={setNewReply}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newReply && styles.sendButtonDisabled]}
          disabled={!newReply}
          onPress={handleReplySubmit}
        >
          <Icon family="Feather" name="send" size={16} color={!newReply ? "#777777" : "#1E1E1E"} />
        </TouchableOpacity>
      </View>

      {/* Replies List */}
      <View style={styles.repliesSection}>
        <Text style={styles.repliesSectionTitle}>Respostas</Text>

        {discussionData.replies.map((reply) => (
          <View key={reply.id} style={styles.replyCard}>
            <View style={styles.replyHeader}>
              {renderAvatar(reply.author, 32)}
              <View style={styles.replyAuthorInfo}>
                <Text style={styles.replyAuthorName}>{reply.author}</Text>
                <Text style={styles.replyDate}>{reply.date}</Text>
              </View>
            </View>
            <Text style={styles.replyText}>{reply.content}</Text>
            <View style={styles.replyActions}>
              <TouchableOpacity style={styles.replyAction} onPress={() => toggleReplyLike(reply.id)}>
                <Icon
                  family="Feather"
                  name="heart"
                  size={14}
                  color={likedComments.includes(reply.id) ? "#E57373" : "#AAAAAA"}
                />
                <Text style={styles.replyActionText}>{reply.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.replyAction}>
                <Icon family="Feather" name="message-square" size={14} color="#AAAAAA" />
                <Text style={styles.replyActionText}>Responder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom spacing */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  discussionCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
  },
  discussionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    borderRadius: 20,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
  authorInfo: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  postDate: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  discussionContent: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 22,
    marginBottom: 16,
  },
  repliesTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  repliesCount: {
    fontSize: 14,
    color: "#F9A826",
    fontWeight: "500",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "#1E1E1E",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9A826",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#3A3A3A",
  },
  repliesSection: {
    marginTop: 8,
  },
  repliesSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  replyCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  replyAuthorInfo: {
    marginLeft: 8,
  },
  replyAuthorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  replyDate: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  replyText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: "row",
    gap: 16,
  },
  replyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  replyActionText: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  bottomSpacing: {
    height: 80,
  },
})

export default DiscussionDetailScreen
