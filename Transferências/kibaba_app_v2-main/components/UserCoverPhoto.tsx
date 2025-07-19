"use client"

import type React from "react"
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native"
import { useTheme } from "../theme/ThemeContext"
import { Icon } from "../App"

interface UserCoverPhotoProps {
  username: string
  onEditPress?: () => void
}

const UserCoverPhoto: React.FC<UserCoverPhotoProps> = ({ username, onEditPress }) => {
  const { colors, isDark } = useTheme()

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3902dd26cbbb5414183932c1774dd5bb.jpg-DCcyoOYDvUSQpC03qly8iMUktgUDP4.jpeg",
        }}
        style={styles.coverPhoto}
      >
        <View style={[styles.overlay, { backgroundColor: "rgba(26, 26, 26, 0.6)" }]}>
          <View style={styles.userInfoContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary.orange }]}>
              <Text style={styles.avatarText}>{username.charAt(0)}</Text>
            </View>
            <Text style={styles.username}>{username}</Text>
          </View>

          {onEditPress && (
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <Icon family="Feather" name="edit-2" size={16} color={colors.primary.white} />
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: "100%",
    overflow: "hidden",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default UserCoverPhoto
