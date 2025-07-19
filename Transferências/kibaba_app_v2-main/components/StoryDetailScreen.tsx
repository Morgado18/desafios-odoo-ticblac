"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Share, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Icon } from "../App"
import {
  addComment,
  getLikedComments,
  getLikedPosts,
  toggleLikeComment,
  toggleLikePost,
} from "../services/data-service"

const StoryDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { story } = route.params

  const [newComment, setNewComment] = useState("")
  const [storyData, setStoryData] = useState(story)
  const [likedPosts, setLikedPosts] = useState(getLikedPosts())
  const [likedComments, setLikedComments] = useState(getLikedComments())

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return

    const comment = addComment(storyData.id, newComment)
    if (comment) {
      setNewComment("")
      // Update the story data to reflect the new comment
      setStoryData({
        ...storyData,
        comments: [...storyData.comments, comment],
      })
    }
  }

  // Toggle like for the story
  const toggleLike = () => {
    const isLiked = toggleLikePost(storyData.id)
    setLikedPosts(getLikedPosts())

    // Update the story data to reflect the like change
    setStoryData({
      ...storyData,
      likes: isLiked ? storyData.likes + 1 : storyData.likes - 1,
    })
  }

  // Toggle like for a comment
  const toggleCommentLike = (commentId) => {
    const isLiked = toggleLikeComment(commentId)
    setLikedComments(getLikedComments())

    // Update the comment data to reflect the like change
    const updatedComments = storyData.comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: isLiked ? comment.likes + 1 : comment.likes - 1,
        }
      }
      return comment
    })

    setStoryData({
      ...storyData,
      comments: updatedComments,
    })
  }

  // Share content
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${storyData.title} - ${storyData.content.substring(0, 100)}... Leia mais no nosso app!`,
        title: storyData.title,
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
        <Text style={styles.headerTitle}>História</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Story Content */}
      <View style={styles.storyCard}>
        <View style={styles.storyCardHeader}>
          <View style={styles.authorContainer}>
            {renderAvatar(storyData.author)}
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{storyData.author}</Text>
              <Text style={styles.postDate}>{storyData.date}</Text>
            </View>
          </View>
          <Text style={styles.storyTitle}>{storyData.title}</Text>
        </View>

        <View style={styles.storyCardContent}>
          <Text style={styles.storyText}>{storyData.content}</Text>

          <View style={styles.tagsContainer}>
            {storyData.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.separator} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
              <Icon
                family="Feather"
                name="heart"
                size={16}
                color={likedPosts.includes(storyData.id) ? "#E57373" : "#AAAAAA"}
              />
              <Text style={styles.actionButtonText}>{storyData.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon family="Feather" name="message-square" size={16} color="#AAAAAA" />
              <Text style={styles.actionButtonText}>{storyData.comments.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon family="Feather" name="share-2" size={16} color="#AAAAAA" />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comentários ({storyData.comments.length})</Text>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          {renderAvatar("User", 32)}
          <TextInput
            style={styles.commentInput}
            placeholder="Escreva um comentário..."
            placeholderTextColor="#777777"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment && styles.sendButtonDisabled]}
            disabled={!newComment}
            onPress={handleCommentSubmit}
          >
            <Icon family="Feather" name="send" size={16} color={!newComment ? "#777777" : "#1E1E1E"} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        {storyData.comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              {renderAvatar(comment.author, 32)}
              <View style={styles.commentAuthorInfo}>
                <Text style={styles.commentAuthorName}>{comment.author}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.content}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.commentAction} onPress={() => toggleCommentLike(comment.id)}>
                <Icon
                  family="Feather"
                  name="heart"
                  size={14}
                  color={likedComments.includes(comment.id) ? "#E57373" : "#AAAAAA"}
                />
                <Text style={styles.commentActionText}>{comment.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentAction}>
                <Icon family="Feather" name="message-square" size={14} color="#AAAAAA" />
                <Text style={styles.commentActionText}>Responder</Text>
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
  storyCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
  },
  storyCardHeader: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  storyCardContent: {
    padding: 16,
    paddingTop: 8,
  },
  storyText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(229, 115, 115, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 115, 115, 0.3)",
  },
  tagText: {
    fontSize: 12,
    color: "#E57373",
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  commentInput: {
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
  commentCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthorInfo: {
    marginLeft: 8,
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  commentDate: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  commentText: {
    fontSize: 14,
    color: "#DDDDDD",
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  bottomSpacing: {
    height: 80,
  },
})

export default StoryDetailScreen
